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
  Picker,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TextInputMask } from "react-native-masked-text";
import PermissionsModal from "./PermissionsModal";
import UserSelectionModal from "./UserSelectionModal";
import MessagesNotification from "./MessagesNotification";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  addCategory,
  deleteCategory,
  updateCategory,
  getUserDetails,
  getGroupPermissions,
  getUserPermissions,
  getPermissions,
  getOrdersDetails,
  getOrdersHasDishes,
  deleteOrder,
  kitchenOrderCreate,
  kitchenOrderStart,
  getDishes,
  getDishesProducts,
  getDishesVariants,
  deleteOrderPart,
  getOrdersRestDetails,
  createBill,
  getBills,
  logoutUser,
  getUsersDetails,
  checkNotifications,
} from "./ApiComponent";

const KuchniaPage = () => {
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

  const [isProfileModalVisible, setProfileModalVisible] = useState(false);
  const [isBookingCancelled, setBookingCancelled] = useState(false);

  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);

  // const [isAddOrderModalVisible, setAddOrderModalVisible] = useState(false);

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

  const [isTooltipVisible, setTooltipVisible] = useState(false);

  const fetchOrdersDetails = async (pk, uk) => {
    try {
      const data = await getOrdersDetails(pk, uk);
      const formattedData = data.map((item) => ({
        ...item,
        time: formatTimeString(item.time),
      }));
      setCategories(formattedData);
      return { pk, uk, data };
    } catch (error) {
      console.error("Błąd podczas pobierania szczegółów zamówień:", error);
    }
  };
  useEffect(() => {
    fetchOrdersDetails(0, 0);
  }, []);

  // Функция для конвертации строки времени в нормальный формат
  const formatTimeString = (timeString) => {
    const date = new Date(timeString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const [subOrders, setSubOrders] = useState([]);
  const [isMainOrdersVisible, setIsMainOrdersVisible] = useState(true);
  const [isSubOrdersVisible, setIsSubOrdersVisible] = useState(false);

  const [mainOrder, setMainOrder] = useState(null); // Aktualnie wybrane główne zamówienie

  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(""); // Состояние для выбранного заказа

  const handleCategorySelect = async (category, selectedId) => {
    try {
      const ordersHasDishesData = await getOrdersHasDishes(0, category.Order);
      setOrders(ordersHasDishesData);
      setSubOrders(ordersHasDishesData);
      setMainOrder(category);
      setSelectedOrderId(category.Order.toString());
      setOrderDetails({ ...orderDetails, Order: category.Order.toString() });
      setIsMainOrdersVisible(false);
      setIsSubOrdersVisible(true);
    } catch (error) {
      console.error("Ошибка при получении заказов:", error);
    }
  };

  const [Dish, setDishes] = useState([]);
  const [Variant, setVariants] = useState([]);
  const pt = 0;
  const kk = 0;
  const dk = 0;

  useEffect(() => {
    console.log(getDishes);
    console.log(getDishesVariants);
    // Получить данные о блюдах
    getDishes(pt, kk)
      .then((data) => {
        setDishes(data);
      })
      .catch((error) => {
        console.error("Ошибка при получении данных о блюдах:", error);
      });

    // Получить данные о вариантах блюд
    getDishesVariants(pt, dk)
      .then((data) => {
        setVariants(data);
      })
      .catch((error) => {
        console.error("Ошибка при получении данных о вариантах блюд:", error);
      });
  }, []);

  const [addOrderModalVisible, setAddOrderModalVisible] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    table: "",
    Order: "",
    Dish: "",
    counts: "",
    note: "",
    Variant: "",
    id: "",
  });

  const toggleAddOrderModal = () => {
    setAddOrderModalVisible(true);
  };

  const handleAddOrderPress = () => {
    setIsModalVisible(true); // Устанавливаем состояние видимости модального окна
  };

  //get Bills

  const [bills, setBills] = useState([]); // Состояние для хранения данных о счетах
  const [isModalVisibleBills, setModalVisibleBills] = useState(false); // Состояние для отображения модального окна

  const closeModal = () => {
    setModalVisibleBills(false);
  };

  const handleShowBillsPress = async () => {
    try {
      // Вызываем API для получения счетов
      const response = await getBills(0, 0);
      const formattedData = response.map((item) => ({
        ...item,
        time: formatTimeString(item.time),
      }));
      setBills(formattedData);
      setModalVisibleBills(true);
    } catch (error) {
      console.error("Błąd podczas pobierania rachunków:", error);
    }
  };

  const handleAddOrder = async () => {
    try {
      const requestData = {
        Order: orderDetails.Order,
        Dish: orderDetails.Dish,
        counts: orderDetails.counts,
        Variant: orderDetails.Variant,
        note: orderDetails.note,
      };

      const response = await kitchenOrderCreate(
        requestData.Order,
        requestData.Dish,
        requestData.counts,
        requestData.Variant,
        requestData.note
      );

      console.log("Odpowiedz z serwera:", response);

      // Обновляем список заказов только для выбранного заказа
      await fetchOrdersDetails(0, 0);
      await getOrdersHasDishes(0, 0);
    } catch (error) {
      console.error(
        "Błąd podczas tworzenia nowego zamówienia kuchennego:",
        error
      );
    }
  };

  // add bill

  const handleAddBillPress = async (category) => {
    try {
      await createBill(category.Order);
      await fetchOrdersDetails(0, 0);
    } catch (error) {
      console.error("Błąd podczas tworzenia rachunku:", error);
    }
  };

  //delete

  const toggleDeleteModal = () => {
    setDeleteModalVisible(!isDeleteModalVisible); // Инвертируем значение состояния
  };

  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

  const handleDeleteOrderPress = (item) => {
    console.log("Item:", item);
    setSelectedOrderForModification(item.Order);
    setOrderDetails({ ...orderDetails, Order: item.Order });
    setDeleteModalVisible(true);
  };

  // handleDeleteOrderConfirmed
  const handleDeleteOrderConfirmed = async (orderId) => {
    try {
      console.log("Response from server:", orderId);
      const response = await deleteOrder(orderId);
      console.log("Response from server:", response);
      await fetchOrdersDetails(0, 0);

      toggleDeleteModal();
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  //delete 2
  const toggleDeleteModalTwo = () => {
    setDeleteModalVisibleTwo(!isDeleteModalVisibleTwo); // Инвертируем значение состояния
  };

  const [isDeleteModalVisibleTwo, setDeleteModalVisibleTwo] = useState(false);

  const handleDeleteOrderPressTwo = (item) => {
    console.log("Item:", item);
    setSelectedOrderForModification(item.id);
    setOrderDetails({ ...orderDetails, id: item.id });
    setDeleteModalVisibleTwo(true);
  };

  const handleDeleteOrderConfirmedTwo = async (orderPartId) => {
    try {
      console.log("Response from server:", orderPartId);
      const response = await deleteOrderPart(orderPartId);
      console.log("Response from server:", response);
      toggleDeleteModalTwo();
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  // add nowe zamowienie

  const handleAddCategory = async () => {
    try {
      const table = orderDetails.table;
      console.log("Numer stolika:", table);

      const response = await kitchenOrderStart(table);
      console.log("Nowe zamówienie zostało rozpoczęte:", response);
      fetchOrdersDetails(0, 0);
      handleModalClose();
    } catch (error) {
      console.error("Błąd podczas dodawania zamówienia:", error);
    }
  };

  const [isModalVisible, setIsModalVisible] = useState(false);

  // Функция для обработки нажатия на кнопку "Close"
  const handleModalClose = () => {
    setIsModalVisible(false); // Устанавливаем состояние видимости модального окна
  };

  //update

  const [isModifyModalVisible, setModifyModalVisible] = useState(false);
  const [selectedCategoryForModification, setSelectedCategoryForModification] =
    useState(null);
  const [mealDetails, setMealDetails] = useState({
    table: "",
  });

  const handleModifyPress = (category) => {
    setSelectedCategoryForModification(category); // Устанавливаем выбранную категорию для редактирования
    setModifyModalVisible(true); // Открываем модальное окно редактирования
    // Заполняем поля модального окна данными выбранной категории
    setMealDetails({
      table: category.table,
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
      await setCategories(0, 0); // Параметры 0, 0 означают, что вы хотите получить только главные категории

      // Сбрасываем выбранную категорию для редактирования
      setSelectedCategoryForModification(null);

      // Очищаем данные редактируемой категории
      setMealDetails(initialMealDetails);
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  //back

  const handleGoBack = () => {
    // Przywróć widoczność głównych zamówień
    setIsMainOrdersVisible(true);
    // Ukryj podzamówienia
    setIsSubOrdersVisible(false);
    setSubOrders([]);
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

  //   handleCloseUserSelectionModal();
  // };

  /////

  // Добавьте функцию открытия уведомлений
  const handleOpenMessagesNotification = () => {
    setMessagesNotificationVisible(true);
  };

  // Добавьте функцию выбора пользователя из уведомлений
  const handleSelectUserFromNotification = (userId) => {
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

  const [users, setUsers] = useState([
    { id: 1, name: "Imie Nazwisko", status: "Meneger" },
    { id: 2, name: "Imie Nazwisko2", status: "Kelner" },

    // Добавьте других пользователей по аналогии
  ]);

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
        source={require("./assets/background-image_2.png")}
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
        <Text style={styles.additionalInfoText}>Zamówienia</Text>
        {isSubOrdersVisible && (
          <TouchableOpacity
            onPress={handleGoBack}
            style={styles.containergoBackButton}
          >
            <Text style={styles.goBackButton}>Back</Text>
          </TouchableOpacity>
        )}

        {isMainOrdersVisible && (
          <>
            <View style={styles.addContainer}>
              <FlatList
                data={categories}
                horizontal={true}
                keyExtractor={(item, index) =>
                  item && item.order ? item.order.toString() : index.toString()
                }
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleCategorySelect(item)}>
                    <View style={styles.additionalInfoContainer}>
                      {!isBookingCancelled && (
                        <View style={styles.InfoBox}>
                          <View style={styles.additionalInfoBox}>
                            <View style={styles.additionalInfoBoxSecond}>
                              <View style={styles.itionalInfoBoxSecondInfo}>
                                <View
                                  style={styles.itionalInfoBoxSecondInfoflex}
                                >
                                  <Image
                                    source={require("./assets/orders.svg")}
                                    style={
                                      styles.additionalInfoBoxSecondbackgroundImage
                                    }
                                  />
                                  <View
                                    style={styles.itionalInfoBoxSecondInfoText}
                                  >
                                    <Text style={styles.infoBoxSecondInfoText}>
                                      Waiter: {item.waiter}
                                    </Text>
                                    <Text
                                      style={styles.infoBoxSecondInfoTextSecond}
                                    >
                                      Order: {item.Order}
                                    </Text>
                                  </View>
                                </View>
                              </View>
                              <View
                                style={styles.additionalInfoBoxSecondRowTwo}
                              >
                                <View>
                                  <Text
                                    style={styles.infoBoxSecondInfoTextRowTwo}
                                  >
                                    Table
                                  </Text>
                                  <Text
                                    style={
                                      styles.infoBoxSecondInfoTextSecondRowTwo
                                    }
                                  >
                                    {item.table}
                                  </Text>
                                </View>
                                <View>
                                  <Text
                                    style={styles.infoBoxSecondInfoTextRowTwo}
                                  >
                                    Time
                                  </Text>
                                  <Text
                                    style={
                                      styles.infoBoxSecondInfoTextSecondRowTwo
                                    }
                                  >
                                    {item.time}
                                  </Text>
                                </View>
                              </View>
                            </View>
                            <View style={styles.additionalInfoBoxEdit}>
                              <>
                                <TouchableOpacity
                                  onPress={() => handleDeleteOrderPress(item)}
                                >
                                  <Text
                                    style={styles.additionalInfoBoxEditSecond}
                                  >
                                    Delete
                                  </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() => handleAddBillPress(item)}
                                >
                                  <Text
                                    style={styles.additionalInfoBoxEditSecond}
                                  >
                                    Stwórz rachunek
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
            <View style={styles.buttonsContainer}>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={handleAddOrderPress}
                  style={styles.changeUserButtonTwo}
                >
                  <Text style={styles.changeUserButtonTextTwo}>
                    Dodaj Zamówienie
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={handleShowBillsPress}
                  style={styles.changeUserButtonTwo}
                >
                  <Text style={styles.changeUserButtonTextTwo}>
                    Pokaż Rahunki
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}

        {isSubOrdersVisible && (
          <>
            <View style={styles.addContainer}>
              <FlatList
                data={subOrders}
                horizontal={true}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleSubOrderSelect(item)}>
                    <View style={styles.additionalInfoContainer}>
                      <View style={styles.InfoBox}>
                        <View
                          style={
                            item.done
                              ? styles.additionalInfoBoxDone
                              : styles.additionalInfoBox
                          }
                        >
                          <View style={styles.additionalInfoBoxSecond}>
                            <View style={styles.itionalInfoBoxSecondInfo}>
                              <View style={styles.itionalInfoBoxSecondInfoflex}>
                                {item.done ? (
                                  <Image
                                    source={require("./assets/order-dish.svg")}
                                    style={
                                      styles.additionalInfoBoxSecondbackgroundImage
                                    }
                                  />
                                ) : (
                                  <Image
                                    source={require("./assets/order-dish-not-done.svg")}
                                    style={
                                      styles.additionalInfoBoxSecondbackgroundImage
                                    }
                                  />
                                )}
                                <View
                                  style={styles.itionalInfoBoxSecondInfoText}
                                >
                                  <Text style={styles.infoBoxSecondInfoText}>
                                    Order: {item.Order}
                                  </Text>
                                  <Text
                                    style={styles.infoBoxSecondInfoTextSecond}
                                  >
                                    Info: {item.note}
                                  </Text>
                                </View>
                              </View>
                              <TouchableOpacity
                                onPress={() => setTooltipVisible(true)}
                                onPressOut={() => setTooltipVisible(false)}
                              >
                                {item.done ? (
                                  <Image
                                    source={require("./assets/expectation-done.png")}
                                    style={styles.additionalInfoBoxSecondImage}
                                  />
                                ) : (
                                  <Image
                                    source={require("./assets/expectation.png")}
                                    style={styles.additionalInfoBoxSecondImage}
                                  />
                                )}
                              </TouchableOpacity>
                            </View>
                            <View style={styles.additionalInfoBoxSecondRowTwo}>
                              <View>
                                <Text
                                  style={styles.infoBoxSecondInfoTextRowTwo}
                                >
                                  Dish
                                </Text>
                                <Text
                                  style={
                                    styles.infoBoxSecondInfoTextSecondRowTwo
                                  }
                                >
                                  {item.Dish}
                                </Text>
                              </View>
                              <View>
                                <Text
                                  style={styles.infoBoxSecondInfoTextRowTwo}
                                >
                                  Variant
                                </Text>
                                <Text
                                  style={
                                    styles.infoBoxSecondInfoTextSecondRowTwo
                                  }
                                >
                                  {item.Variant}
                                </Text>
                              </View>
                              <View>
                                <Text
                                  style={styles.infoBoxSecondInfoTextRowTwo}
                                >
                                  Count
                                </Text>
                                <Text
                                  style={
                                    styles.infoBoxSecondInfoTextSecondRowTwo
                                  }
                                >
                                  {item.count}
                                </Text>
                              </View>
                            </View>
                          </View>
                          <View style={styles.additionalInfoBoxEdit}>
                            <>
                              <TouchableOpacity
                                onPress={() => handleDeleteOrderPressTwo(item)}
                              >
                                <Text
                                  style={styles.additionalInfoBoxEditSecond}
                                >
                                  Cancel
                                </Text>
                              </TouchableOpacity>
                            </>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={toggleAddOrderModal}
                style={styles.changeUserButtonTwo}
              >
                <Text style={styles.changeUserButtonTextTwo}>Dodaj Order</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
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
        visible={isModalVisibleBills}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainerBill}>
          <View style={styles.modalContentBill}>
            <Text style={styles.billTextUp}>Rahunki</Text>
            <FlatList
              data={bills}
              keyExtractor={(item) => item.Bill.toString()}
              renderItem={({ item }) => (
                <View style={styles.billItemContainer}>
                  <Text style={styles.billText}>{`Bill: ${item.Bill}`}</Text>
                  <Text style={styles.billText}>{`Time: ${item.time}`}</Text>
                  <Text style={styles.billText}>{`Cost: ${item.Cost}`}</Text>
                  <Text style={styles.billText}>{`Order: ${item.order}`}</Text>
                  <Text
                    style={styles.billText}
                  >{`Waiter: ${item.waiter}`}</Text>
                </View>
              )}
            />
            <TouchableOpacity
              onPress={closeModal}
              style={styles.closeButtonBill}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isDeleteModalVisible}
        onRequestClose={toggleDeleteModal}
      >
        <View style={styles.profileModalContainer}>
          <View style={styles.profileModalContent}>
            <Text style={styles.profileModalLink}>
              Are you sure you want to delete?
            </Text>
            <TouchableOpacity
              onPress={() =>
                handleDeleteOrderConfirmed(selectedOrderForModification)
              }
            >
              <Text style={styles.profileModalLink}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleDeleteModal}>
              <Text style={styles.profileModalLink}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isDeleteModalVisibleTwo}
        onRequestClose={toggleDeleteModalTwo}
      >
        <View style={styles.profileModalContainer}>
          <View style={styles.profileModalContent}>
            <Text style={styles.profileModalLink}>
              Are you sure you want to delete?
            </Text>
            <TouchableOpacity
              onPress={() =>
                handleDeleteOrderConfirmedTwo(selectedOrderForModification)
              }
            >
              <Text style={styles.profileModalLink}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleDeleteModalTwo}>
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
        visible={isModalVisible}
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Dodaj Zamówienie</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Table"
              value={orderDetails.table ? orderDetails.table.toString() : ""}
              onChangeText={(text) =>
                setOrderDetails({ ...orderDetails, table: text })
              }
            />
            <TouchableOpacity onPress={handleAddCategory}>
              <Text style={styles.modalAddOrderButton}>Dodaj Zamówienie</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleModalClose}>
              <Text style={styles.modalCloseButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={addOrderModalVisible}
        onRequestClose={() => setAddOrderModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>New Order</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Order"
              value={selectedOrderId.toString()}
              editable={false}
              onTouchStart={() => {
                openOrderSelector();
              }}
            />

            <Picker
              style={styles.picker}
              selectedValue={orderDetails.Dish}
              onValueChange={(text) => {
                setOrderDetails({ ...orderDetails, Dish: text });
              }}
            >
              <Picker.Item label="Сhoose a dish" value={null} />{" "}
              {Dish.map((Dish) => (
                <Picker.Item
                  key={Dish.D_no}
                  label={Dish.name}
                  value={Dish.D_no}
                />
              ))}
            </Picker>

            <TextInput
              style={styles.modalInput}
              placeholder="Counts"
              value={orderDetails.counts}
              onChangeText={(text) => {
                let formattedText = text
                  .replace(/\D/g, "")
                  .replace(/(\d{1})(\d{0,2})/, "$1.$2");

                setOrderDetails({ ...orderDetails, counts: formattedText });
              }}
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Note"
              value={orderDetails.note}
              onChangeText={(text) =>
                setOrderDetails({ ...orderDetails, note: text })
              }
            />

            <Picker
              style={styles.picker}
              selectedValue={orderDetails.Variant}
              onValueChange={(text) =>
                setOrderDetails({ ...orderDetails, Variant: text })
              }
            >
              <Picker.Item label="Сhoose a variant" value={null} />{" "}
              {Variant.map((Variant) => (
                <Picker.Item
                  key={Variant.id}
                  label={Variant.Variant_no}
                  value={Variant.id}
                />
              ))}
            </Picker>

            <TouchableOpacity onPress={handleAddOrder}>
              <Text style={styles.modalAddOrderButton}>Add Order</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setAddOrderModalVisible(false)}>
              <Text style={styles.modalCloseButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    height: 279,
    backgroundColor: "#FA8E4D",
    marginTop: 20,
    borderRadius: 10,

    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowColor: "#000",
  },
  additionalInfoBoxDone: {
    width: 393,
    height: 279,
    backgroundColor: "#33C426",
    marginTop: 20,
    borderRadius: 10,

    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowColor: "#000",
  },

  additionalInfoBoxSecond: {
    width: 393,
    height: 230,
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
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  itionalInfoBoxSecondInfoflex: {
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
  },

  additionalInfoBoxSecondbackgroundImage: {
    width: 59,
    height: 59,
    marginRight: 15,
  },

  itionalInfoBoxSecondInfoText: {
    width: 240,
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
    flexWrap: "wrap",
  },
  additionalInfoBoxSecondRowTwo: {
    marginTop: 20,

    justifyContent: "space-around",
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
    marginTop: 30,
    alignItems: "center",
  },
  buttonsContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
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
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  picker: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "gray",
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: "bold",
  },
});

export default KuchniaPage;
