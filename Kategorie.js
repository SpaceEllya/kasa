import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import PermissionsModal from "./PermissionsModal";
import UserSelectionModal from "./UserSelectionModal";
import MessagesNotification from "./MessagesNotification";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  addCategory,
  getCategories,
  deleteCategory,
  updateCategory,
  getUserDetails,
  getGroupPermissions,
  getUserPermissions,
  getPermissions,
  logoutUser,
  getUsersDetails,
  refreshAccessToken,
  checkNotifications,
} from "./ApiComponent";

const Kategorie = () => {
  const navigation = useNavigation();

  //get users
  const [isUserSelectionModalVisible, setUserSelectionModalVisible] =
    useState(false);

  const handleChangeUser = async () => {
    setUserSelectionModalVisible(true);
    // Получаем список пользователей
    try {
      const userList = await getUsersDetails(0, 0); // Замените getUsersList на вашу функцию для получения списка пользователей
      setUsers(userList);
    } catch (error) {
      console.error("Error when retrieving a list of users:", error);
    }
  };

  const handleSelectUser = (user) => {
    setUserSelectionModalVisible(false);
    console.log(user.username);
    navigation.navigate("LoginPage", { username: user.username });
  };

  const handleCloseUserSelectionModal = () => {
    setUserSelectionModalVisible(false);
  };

  ///
  const [isModalVisible, setModalVisible] = useState(false);
  const [isProfileModalVisible, setProfileModalVisible] = useState(false);
  const [isBookingCancelled, setBookingCancelled] = useState(false);

  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);

  const [isAddOrderModalVisible, setAddOrderModalVisible] = useState(false);

  const [isMessagesNotificationVisible, setMessagesNotificationVisible] =
    useState(false);

  const [areNotificationsVisible, setNotificationsVisibility] = useState(false);

  const fetchNotifications = async () => {
    try {
      const response = await checkNotifications();

      setNotificationsVisibility(response.notification);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const [selectedOrderForModification, setSelectedOrderForModification] =
    useState(null);
  const [selectedLink, setSelectedLink] = useState(null);

  const [categories, setCategories] = useState([]);

  const fetchCategories = async (pk, hk) => {
    try {
      const data = await getCategories(pk, hk);
      setCategories(data);
      return { pk, hk, data };
    } catch (error) {
      console.error("Ошибка при получении категорий:", error);
    }
  };

  useEffect(() => {
    fetchCategories(0, 0); // Получаем только главные категории
  }, []);

  const handleCategorySelect = (category) => {
    // Сохраняем предыдущую категорию перед выбором новой
    setPreviousCategory(selectedCategory);
    setSelectedCategory(category);
    fetchCategories(0, category.Category); // Загружаем подкатегории выбранной категории
  };

  //delete
  const [isCancelModalVisible, setCancelModalVisible] = useState(false);

  const handleCancelBookingPress = (item) => {
    setSelectedOrderForModification(item); // Устанавливаем выбранную категорию для отмены
    setCancelModalVisible(true); // Открываем модальное окно отмены
  };

  const toggleCancelModal = () => {
    setCancelModalVisible(!isCancelModalVisible);
  };

  const handleCancelBookingConfirmed = async () => {
    try {
      if (!selectedOrderForModification) {
        console.error("No selected order for cancellation");
        return;
      }

      const categoryId = selectedOrderForModification.Category;
      await deleteCategory(categoryId);
      fetchCategories(0, 0); // Обновляем главные категории
      setCancelModalVisible(false);
    } catch (error) {
      console.error("Error canceling category:", error);
    }
  };

  const handleAddCategory = async () => {
    try {
      const response = await addCategory(orderDetails);
      console.log("Category added successfully:", response);
      fetchCategories(0, 0); // Обновляем список категорий после добавления новой категории
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  //update

  const [isModifyModalVisible, setModifyModalVisible] = useState(false);
  const [selectedCategoryForModification, setSelectedCategoryForModification] =
    useState(null);
  const [mealDetails, setMealDetails] = useState({
    name: "",
    higher_category: "",
  });

  const handleModifyPress = (category) => {
    setSelectedCategoryForModification(category); // Устанавливаем выбранную категорию для редактирования
    setModifyModalVisible(true); // Открываем модальное окно редактирования
    // Заполняем поля модального окна данными выбранной категории
    setMealDetails({
      name: category.name,
      higher_category: category.higher_category,
    });
  };

  const handleSaveChanges = async () => {
    try {
      // Вызываем функцию обновления категории с идентификатором categoryId и обновленными данными mealDetails
      await updateCategory(
        selectedCategoryForModification.Category,
        mealDetails
      );

      // Закрываем модальное окно редактирования после успешного обновления категории
      setModifyModalVisible(false);

      // Обновляем список категорий после обновления категории
      await fetchCategories(0, 0); // Параметры 0, 0 означают, что вы хотите получить только главные категории

      // Сбрасываем выбранную категорию для редактирования
      setSelectedCategoryForModification(null);

      // Очищаем данные редактируемой категории
      setMealDetails(initialMealDetails);
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  //back
  const [selectedCategory, setSelectedCategory] = useState(null); // Состояние для хранения выбранной категории
  const [previousCategory, setPreviousCategory] = useState([]); // Состояние для хранения предыдущей категории

  const handleGoBack = () => {
    // Возвращаемся к предыдущей категории, если она есть
    if (previousCategory) {
      setSelectedCategory(previousCategory);

      setPreviousCategory([]);
      fetchCategories(0, 0);
    }
  };

  // user

  const [currentUser, setCurrentUser] = useState({ id: null, username: "" }); // Стейт для хранения данных о текущем пользователе

  useEffect(() => {
    // Функция для загрузки данных о пользователе при монтировании компонента
    const loadUserData = async () => {
      try {
        // Получаем данные о пользователе с помощью функции getUserDetails
        const userData = await getUserDetails();
        // Обновляем состояние currentUser полученными данными о пользователе
        setCurrentUser(userData);
      } catch (error) {
        console.error("Ошибка при загрузке данных о пользователе:", error);
      }
    };

    // Вызываем функцию загрузки данных о пользователе
    loadUserData();
  }, []);

  // getPermissions

  // const [isUserSelectionModalVisible, setUserSelectionModalVisible] =
  //   useState(false);
  // const [permissions, setPermissions] = useState([]);

  // // Функция для открытия модального окна выбора пользователя
  // const handleChangeUser = async () => {
  //   setUserSelectionModalVisible(true);
  //   // Получаем разрешения пользователя
  //   try {
  //     const userPermissions = await getPermissions(); // Предположим, что getPermissions возвращает список разрешений
  //     setPermissions(userPermissions);
  //   } catch (error) {
  //     console.error("Błąd podczas pobierania listy uprawnień:", error);
  //   }
  // };

  // // Функция для закрытия модального окна выбора пользователя
  // const handleCloseUserSelectionModal = () => {
  //   setUserSelectionModalVisible(false);
  // };

  // // Функция для обработки выбора пользователя
  // const handleUserSelection = (userId) => {
  //   console.log("Выбран пользователь с ID:", userId);
  //   // Вы можете добавить здесь логику для обработки выбора пользователя
  //   // Например, загрузить разрешения для выбранного пользователя
  //   // и закрыть модальное окно выбора пользователя
  //   handleCloseUserSelectionModal();
  // };

  /////

  // Добавьте функцию открытия уведомлений
  const handleOpenMessagesNotification = () => {
    setMessagesNotificationVisible(true);
  };

  // Добавьте функцию выбора пользователя из уведомлений
  const handleSelectUserFromNotification = (userId) => {
    // Ваш код для обработки выбранного пользователя
    // Например, перейти на экран чата с этим пользователем
    console.log("Selected user ID:", userId);
  };

  const [notifications, setNotifications] = useState([
    {
      Notification_no: 1,
      notification: "Przykład",
      status: 0,
    },
  ]);
  const [isNotificationModalVisible, setNotificationModalVisible] =
    useState(false);

  const [isPermissionsModalVisible, setPermissionsModalVisible] =
    useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null); // Set the user ID for fetching permissions

  const [users, setUsers] = useState([
    { id: 1, name: "Imie Nazwisko", status: "Meneger" },
    { id: 2, name: "Imie Nazwisko2", status: "Kelner" },

    // Добавьте других пользователей по аналогии
  ]);

  const handleAddOrderPress = () => {
    setAddOrderModalVisible(true);
  };

  const handleModalClose = () => {
    setAddOrderModalVisible(false);
  };

  const handleShowPermissions = (userId) => {
    setSelectedUserId(userId);
    setPermissionsModalVisible(true);
  };

  const handlePermissionsModalClose = () => {
    setPermissionsModalVisible(false);
    setSelectedUserId(null);
  };

  const loadNotifications = async () => {
    try {
      const response = await fetch("http://localhost:8000/kfp/Notifications", {
        method: "GET",
      });

      const data = await response.json();

      if (data.message === "Brak powiadomień") {
        setNotifications([]);
      } else {
        setNotifications(data);
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  };

  useEffect(() => {
    if (isNotificationModalVisible) {
      loadNotifications();
    }
  }, [isNotificationModalVisible]);

  const toggleLogoutModal = () => {
    setLogoutModalVisible(!isLogoutModalVisible);
  };

  const handleLogout = () => {
    toggleLogoutModal();
  };

  const handleLogoutConfirmed = async () => {
    try {
      await logoutUser();
      toggleLogoutModal();
      navigation.navigate("LoginPage");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  const initialMealDetails = {
    name: "",
    order: "",
    table: "",
    time: "",
    amount: "",
    email: "",
  };

  const toggleModifyModal = () => {
    setModifyModalVisible(!isModifyModalVisible);
  };

  const [orderDetails, setOrderDetails] = useState({
    name: "",
    order: "",
    table: "",
    time: "",
    amount: "",
    email: "",
  });

  const handleLinkPress = (screenName) => {
    navigation.navigate(screenName);
    setSelectedLink(screenName);
  };

  const toggleProfileModal = () => {
    setProfileModalVisible(!isProfileModalVisible);
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("./assets/category-img.png")}
        style={styles.backgroundImage}
      />
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Image source={require("./assets/logo.png")} style={styles.logo} />
          <View style={styles.headerTextContainer}>
            <TouchableOpacity onPress={() => handleLinkPress("KuchniaPage")}>
              <Text
                style={[
                  styles.headerLink,
                  selectedLink === "KuchniaPage" && styles.selectedLink,
                ]}
              >
                Zamówienia
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleLinkPress("Kuchnia")}>
              <Text
                style={[
                  styles.headerLink,
                  selectedLink === "Kuchnia" && styles.selectedLink,
                ]}
              >
                Kuchnia
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleLinkPress("ZarzadzaniePage")}
            >
              <Text
                style={[
                  styles.headerLink,
                  selectedLink === "ZarzadzaniePage" && styles.selectedLink,
                ]}
              >
                Zarządzanie
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleLinkPress("Restauracja")}>
              <Text
                style={[
                  styles.headerLink,
                  selectedLink === "Restauracja" && styles.selectedLink,
                ]}
              >
                Restauracja
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleLinkPress("Kategorie")}>
              <Text
                style={[
                  styles.headerLink,
                  selectedLink === "Kategorie" && styles.selectedLink,
                ]}
              >
                Kategorie
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleOpenMessagesNotification}>
              <Image
                source={
                  areNotificationsVisible
                    ? require("./assets/call-new.svg")
                    : require("./assets/call.svg")
                }
                style={styles.icon}
              />
              <MessagesNotification
                isVisible={isMessagesNotificationVisible}
                onClose={() => setMessagesNotificationVisible(false)}
                users={users}
                onUserSelect={handleSelectUserFromNotification}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={toggleProfileModal}>
              <Image
                source={require("./assets/user_profile.png")}
                style={styles.profileImage}
              />
            </TouchableOpacity>
          </View>

          <Modal
            animationType="slide"
            transparent={true}
            visible={isNotificationModalVisible}
            onRequestClose={() => setNotificationModalVisible(false)}
          >
            <View style={styles.notificationModalContainer}>
              <View style={styles.notificationModalContent}>
                <Text style={styles.notificationModalText}>Powiadomienia</Text>
                {notifications.map((notification) => (
                  <View
                    key={notification.Notification_no}
                    style={styles.notificationItem}
                  >
                    <Text style={styles.notificationText}>
                      {notification.notification}
                    </Text>
                  </View>
                ))}
                <TouchableOpacity
                  onPress={() => setNotificationModalVisible(false)}
                >
                  <Text style={styles.notificationModalCloseButton}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <Modal
            animationType="slide"
            transparent={true}
            visible={isProfileModalVisible}
            onRequestClose={toggleProfileModal}
          >
            <View style={styles.profileModalContainer}>
              <View style={styles.profileModalContent}>
                <TouchableOpacity onPress={handleLogout}>
                  <Text style={styles.profileModalLink}>Log out</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleProfileModal}>
                  <Text style={styles.profileModalCloseButton}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>

        <View style={styles.userInfoContainer}>
          <Text style={styles.userInfoText}>
            Użytkownik: {currentUser.username}
          </Text>
          <TouchableOpacity
            onPress={handleChangeUser}
            style={styles.changeUserButton}
          >
            <Text style={styles.changeUserButtonText}>Zmień użytkownika</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.additionalInfoText}>Kategorie</Text>
        <TouchableOpacity
          onPress={handleGoBack}
          style={styles.containergoBackButton}
        >
          <Text style={styles.goBackButton}>Back</Text>
        </TouchableOpacity>

        <View style={styles.addContainer}>
          <FlatList
            data={categories}
            horizontal={true}
            keyExtractor={(item, index) =>
              item && item.id ? item.id.toString() : index.toString()
            }
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleCategorySelect(item)}>
                <View style={styles.additionalInfoContainer}>
                  {!isBookingCancelled && (
                    <View style={styles.InfoBox}>
                      <View style={styles.additionalInfoBox}>
                        <View style={styles.additionalInfoBoxSecond}>
                          <View style={styles.itionalInfoBoxSecondInfo}>
                            <Image
                              source={require("./assets/user_profile.png")}
                              style={
                                styles.additionalInfoBoxSecondbackgroundImage
                              }
                            />
                            <View style={styles.itionalInfoBoxSecondInfoText}>
                              <Text style={styles.infoBoxSecondInfoText}>
                                {item.name}
                              </Text>
                              <Text style={styles.infoBoxSecondInfoTextSecond}>
                                {item.higher_category}
                              </Text>
                            </View>
                          </View>
                          <View
                            style={styles.additionalInfoBoxSecondRowTwo}
                          ></View>
                        </View>
                        <View style={styles.additionalInfoBoxEdit}>
                          <>
                            <TouchableOpacity
                              onPress={() => handleCancelBookingPress(item)}
                            >
                              <Text style={styles.additionalInfoBoxEditSecond}>
                                Cancel
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => handleModifyPress(item)}
                            >
                              <Text style={styles.additionalInfoBoxEditSecond}>
                                Modify
                              </Text>
                            </TouchableOpacity>
                          </>
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isUserSelectionModalVisible}
        onRequestClose={handleCloseUserSelectionModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select user</Text>
            <FlatList
              data={users}
              keyExtractor={(user) => user.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.billItemContainer}>
                  <TouchableOpacity onPress={() => handleSelectUser(item)}>
                    <Text
                      style={styles.billText}
                    >{`Full name: ${item.first_name} ${item.last_name}`}</Text>
                    <Text style={styles.billText}>
                      Username: {item.username}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            />
            <TouchableOpacity onPress={handleCloseUserSelectionModal}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isCancelModalVisible}
        onRequestClose={toggleCancelModal}
      >
        <View style={styles.profileModalContainer}>
          <View style={styles.profileModalContent}>
            <Text style={styles.profileModalLink}>
              Are you sure you want to cancel?
            </Text>
            <TouchableOpacity onPress={handleCancelBookingConfirmed}>
              <Text style={styles.profileModalLink}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleCancelModal}>
              <Text style={styles.profileModalLink}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModifyModalVisible}
        onRequestClose={toggleModifyModal}
      >
        <View style={styles.modifyModalContainer}>
          <View style={styles.modifyModalContent}>
            <TextInput
              style={styles.modifyModalInput}
              placeholder="Category Name"
              value={mealDetails.name || ""}
              onChangeText={(text) =>
                setMealDetails({ ...mealDetails, name: text })
              }
            />
            <TextInput
              style={styles.modifyModalInput}
              placeholder="Higher Category"
              value={mealDetails.higher_category || ""}
              onChangeText={(text) =>
                setMealDetails({ ...mealDetails, higher_category: text })
              }
            />
            <TouchableOpacity onPress={handleSaveChanges}>
              <Text style={styles.modifyModalSaveButton}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleModifyModal}>
              <Text style={styles.modifyModalCloseButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isLogoutModalVisible}
        onRequestClose={toggleLogoutModal}
      >
        <View style={styles.profileModalContainer}>
          <View style={styles.profileModalContent}>
            <Text style={styles.profileModalLink}>
              Are you sure you want to log out?
            </Text>
            <TouchableOpacity onPress={handleLogoutConfirmed}>
              <Text style={styles.profileModalLink}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleLogoutModal}>
              <Text style={styles.profileModalLink}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isAddOrderModalVisible}
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Dodaj Kategorię</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Name category"
              value={orderDetails.name}
              onChangeText={(text) =>
                setOrderDetails({ ...orderDetails, name: text })
              }
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Higher Category ID"
              value={
                orderDetails.higher_category
                  ? orderDetails.higher_category.toString()
                  : ""
              }
              onChangeText={(text) =>
                setOrderDetails({ ...orderDetails, higher_category: text })
              }
            />
            <TouchableOpacity onPress={handleAddCategory}>
              <Text style={styles.modalAddOrderButton}>Dodaj Kategorię</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleModalClose}>
              <Text style={styles.modalCloseButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleAddOrderPress}
          style={styles.changeUserButtonTwo}
        >
          <Text style={styles.changeUserButtonTextTwo}>Dodaj Kategorię</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
  },
  backgroundImage: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
    position: "absolute",
  },

  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    width: "100%",
  },
  contentContainer: {
    width: "70%",
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 30,
  },

  headerTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    fontWeight: "lighter",
  },
  headerLink: {
    marginHorizontal: 5,
    color: "#FFF",
    marginRight: 20,
    textDecorationLine: "none",
  },
  selectedLink: {
    textDecorationLine: "underline",
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    marginLeft: 10,
    borderRadius: 20,
  },
  userInfoContainer: {
    marginTop: 40,
    justifyContent: "flex-start",
  },
  userInfoText: {
    fontSize: 16,
    marginLeft: 10,
    marginBottom: 10,
    fontSize: 24,
    color: "#FFF",
  },
  changeUserButtonTwo: {
    borderColor: "#000",
    borderRadius: 10,
    paddingVertical: 10,
    marginLeft: 10,
    width: 260,
    borderWidth: 2,
  },

  changeUserButtonTextTwo: {
    color: "#212121",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },

  changeUserButton: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingVertical: 10,
    marginLeft: 10,
    width: 330,
  },
  changeUserButtonText: {
    color: "#000618",
    textAlign: "center",
    fontSize: 25,
    fontWeight: "bold",
    width: 330,
    height: 35,
  },

  addBasicInfoContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginRight: 400,
    marginTop: 10,
  },
  skrollBasicInfoContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },

  additionalInfoContainer: {
    width: "100%",
    height: "100%",
    alignItems: "flex-start",
    marginRight: 15,
  },
  additionalInfoText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "light",
    paddingTop: 80,
  },
  additionalInfoBox: {
    width: 393,
    height: 149,
    backgroundColor: "#233000",
    marginTop: 20,
    borderRadius: 10,

    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowColor: "#000",
  },

  additionalInfoBoxSecond: {
    width: 393,
    height: 100,
    backgroundColor: "#FFF",
    borderRadius: 10,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowColor: "#000",
    padding: 14,
    justifyContent: "flex-start",
  },
  itionalInfoBoxSecondInfo: {
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
  },

  additionalInfoBoxSecondbackgroundImage: {
    width: 65,
    height: 65,
    marginRight: 15,
  },

  additionalInfoBoxSecondImage: {
    width: 20,
    height: 20,
  },
  infoBoxSecondInfoText: {
    fontSize: 18,
    fontWeight: "light",
    color: "#000618",
  },
  infoBoxSecondInfoTextSecond: {
    fontSize: 14,
    fontWeight: "light",
    color: "#646567",
  },
  additionalInfoBoxSecondRowTwo: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  infoBoxSecondInfoTextRowTwo: {
    fontSize: 15,
    fontWeight: "light",
    color: "#575757",
  },
  infoBoxSecondInfoTextSecondRowTwo: {
    fontSize: 15,
    fontWeight: "normal",
    color: "#000618",
  },

  additionalInfoBoxEdit: {
    marginTop: 15,
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
  },

  additionalInfoBoxEditSecond: {
    fontSize: 15,
    fontWeight: "light",
    color: "#FFF",
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 30,
  },

  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalTextTwo: {
    fontSize: 16,
    fontWeight: "normal",
    marginBottom: 5,
  },

  modalTextTree: {
    fontSize: 12,
    fontWeight: "normal",
    marginBottom: 10,
  },

  modalCloseButton: {
    color: "blue",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    width: "60%", // Увеличил ширину до 80%
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalInput: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
  modalAddOrderButton: {
    backgroundColor: "#FA8E4D",
    color: "#fff",
    fontSize: 16,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  modalCloseButton: {
    color: "blue",
    fontSize: 16,
  },

  profileImage: {
    width: 40,
    height: 40,
    marginLeft: 10,
    borderRadius: 20,
  },
  profileModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  profileModalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  profileModalLink: {
    fontSize: 16,
    fontWeight: "light",
    marginBottom: 10,
    color: "black", // Цвет ссылок (можете настроить под ваш дизайн)
  },
  profileModalCloseButton: {
    color: "blue",
    fontSize: 16,
    marginTop: 10,
  },
  notificationModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  notificationModalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    width: "60%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  notificationModalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  notificationItem: {
    marginTop: 10,
  },
  notificationText: {
    fontSize: 16,
  },
  notificationModalCloseButton: {
    color: "blue",
    fontSize: 16,
    marginTop: 10,
  },
  modifyModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modifyModalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modifyModalInput: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
  modifyModalSaveButton: {
    backgroundColor: "#FA8E4D",
    color: "#fff",
    fontSize: 16,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  modifyModalCloseButton: {
    color: "blue",
    fontSize: 16,
  },
  addContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    gap: 2,
    width: "100%",
    height: "100%",
  },

  containergoBackButton: {
    borderColor: "#000",
    borderRadius: 10,
    paddingVertical: 5,
    borderWidth: 1,
    width: 100,
    marginTop: 10,
  },
  goBackButton: {
    color: "#000",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },

  modalContainerBill: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContentBill: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "30%",
    maxHeight: "80%",
    alignItems: "center",
  },
  billItemContainer: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  billText: {
    fontSize: 16,
    marginBottom: 5,
  },
  billTextUp: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: "bold",
  },
  closeButtonBill: {
    marginTop: 20,
    backgroundColor: "#FA8E4D",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: "center",
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: "bold",
  },
});

export default Kategorie;
