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
  Picker,
} from "react-native";

import { useNavigation } from "@react-navigation/native";

import MessagesNotification from "./MessagesNotification";

import {
  getUserDetails,
  getDishes,
  getDishesProducts,
  getDishesVariants,
  addDishesProducts,
  addDishesVariants,
  deleteDish,
  deleteDishesProducts,
  deleteDishesVariants,
  updateDish,
  getCategories,
  logoutUser,
  addDishToMenu,
  getUsersDetails,
  checkNotifications,
} from "./ApiComponent";

const Restaurant = () => {
  const navigation = useNavigation();

  // Zmiana obrazu po otrzymaniu powiadomień

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

  const handleOpenMessagesNotification = () => {
    setMessagesNotificationVisible(true);
  };

  // Get users

  const [isUserSelectionModalVisible, setUserSelectionModalVisible] =
    useState(false);

  const handleChangeUser = async () => {
    setUserSelectionModalVisible(true);
    // Pobranie listy użytkowników
    try {
      const userList = await getUsersDetails(0, 0);
      setUsers(userList);
    } catch (error) {
      console.error("Error when retrieving a list of users:", error);
    }
  };

  const handleSelectUser = (user) => {
    setUserSelectionModalVisible(false);
    console.log(user.username);
    navigation.navigate("Login", { username: user.username });
  };

  const handleCloseUserSelectionModal = () => {
    setUserSelectionModalVisible(false);
  };

  // Get dish

  const [dishes, setDishes] = useState([]);

  const [isMainOrdersVisible, setIsMainOrdersVisible] = useState(true);

  const fetchData = async () => {
    try {
      const data = await getDishes(0, 0);
      setDishes(data);
    } catch (error) {
      console.error("Error while downloading dishes:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Get products

  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [isSubOrdersVisible, setIsSubOrdersVisible] = useState(false);
  const [isVariantsOrdersVisible, setIsVariantsOrdersVisible] = useState(false);

  const handleCategorySelect = async (D_no) => {
    try {
      const getProducts = await getDishesProducts(0, D_no);
      const getVariants = await getDishesVariants(0, D_no);

      setSelectedProducts(getProducts);
      setSelectedVariants(getVariants);
      setSelectedOrderId(D_no.toString());
      setIsCategoryModalVisible(true);
    } catch (error) {
      console.error("Error while receiving orders:", error);
    }
  };

  const handleCategoryProductsPress = async () => {
    try {
      setIsCategoryModalVisible(false);
      setIsMainOrdersVisible(false);
      setIsSubOrdersVisible(true);
    } catch (error) {
      console.error("Error while handling category products:", error);
    }
  };

  const handleCategoryVariantsPress = async () => {
    try {
      setIsCategoryModalVisible(false);
      setIsMainOrdersVisible(false);
      setIsVariantsOrdersVisible(true);
    } catch (error) {
      console.error("Error while handling category variants:", error);
    }
  };
  const handleSsubProductsSelect = () => {};

  //Add dish

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [orderDetails, setOrderDetails] = useState({
    name: "",
    Categories: "",
    description: "",
    Cost: "",
    Dish: "",
    weight: "",
    Variant_no: "",
    count: "",
    D_no: "",
    id: "",
    vat: "",
  });
  const handleAddOrderPress = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleAddDishToMenu = async () => {
    try {
      const formData = new FormData();
      formData.append("name", orderDetails.name);
      formData.append("category", orderDetails.Categories);

      formData.append("description", orderDetails.description);
      formData.append("Cost", orderDetails.Cost);
      formData.append("vat", orderDetails.vat);

      const responseData = await addDishToMenu(formData);
      console.log(
        "The dish has been successfully added to the menu:",
        responseData
      );

      setIsModalVisible(false);
      setOrderDetails({
        name: "",
        Categories: "",
        description: "",
        Cost: "",
        vat: "",
      });
      await fetchData(0, 0);
    } catch (error) {
      console.error("Error when adding a dish to the menu:", error);
    }
  };

  //Edit dish

  const [isVisible, setIsVisible] = useState(false);
  const [editedDish, setEditedDish] = useState({
    D_no: "",
    name: "",
    Category: "",
    description: "",
    Cost: "",
    vat: "",
  });

  const onRequestClose = () => {
    setIsVisible(false);
  };

  const handleAddBillPress = (item) => {
    setEditedDish({
      D_no: item.D_no,
      name: item.name,
      сategory: item.Category,
      description: item.description,
      Cost: item.Cost,
      vat: item.vat,
    });
    setIsVisible(true);
  };

  const handleSave = async () => {
    try {
      await updateDish(editedDish.D_no, editedDish);
      setIsVisible(false);
      fetchData();
    } catch (error) {
      console.error("Error while saving changes:", error);
    }
  };

  // Funkcja aktualizująca stan po wprowadzeniu danych przez użytkownika

  const handleChangeText = (key, value) => {
    setEditedDish({ ...editedDish, [key]: value });
  };

  //Add produkts

  const [isModalProductVisible, setIsModalProductVisible] = useState(false);

  const toggleModalProduct = () => {
    setIsModalProductVisible(!isModalProductVisible);
  };
  const toggleSubProductsModal = () => {
    setIsModalProductVisible(true);
  };

  const handleAddProductToMenu = async () => {
    try {
      // Sprawdzamy, czy selectedOrderId jest zdefiniowany
      if (selectedOrderId !== undefined) {
        const responseData = await addDishesProducts({
          ...orderDetails,
          Dish: selectedOrderId,
        });

        console.log("Product added successfully:", responseData);

        // Zamknięcie okna modalnego
        toggleModalProduct();
      } else {
        console.warn("Order Id is undefined.");
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  //Add variants

  const [isModalVariantsVisible, setIsModalVariantsVisible] = useState(false);

  const toggleModalVariants = () => {
    setIsModalVariantsVisible(!isModalVariantsVisible);
  };
  const toggleSubVariantssModal = () => {
    setIsModalVariantsVisible(true);
  };

  const handleAddVariantsToMenu = async () => {
    try {
      if (selectedOrderId !== undefined) {
        const responseData = await addDishesVariants({
          ...orderDetails,
          Dish: selectedOrderId,
        });

        console.log("Variant added successfully:", responseData);

        toggleModalVariants();
      } else {
        console.warn("Order Id is undefined.");
      }
    } catch (error) {
      console.error("Error adding variants:", error);
    }
  };

  // Delete variants

  const [selectedOrderForModification, setSelectedOrderForModification] =
    useState(null);

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const handleDeleteVariant = (item) => {
    setSelectedOrderForModification(item.id);
    setOrderDetails({ ...orderDetails, id: item.id });
    setIsDeleteModalVisible(true);
  };

  const toggleDeleteModal = () => {
    setIsDeleteModalVisible(!isDeleteModalVisible);
  };

  const handleDeleteOrderConfirmed = async (id) => {
    try {
      const responseData = await deleteDishesVariants(id);
      console.log("Variant deleted successfully:", responseData);

      toggleDeleteModal();
    } catch (error) {
      console.error("Error deleting variant:", error);
    }
  };

  // Delete produkt
  const [isDeleteModalVisibleTwo, setIsDeleteModalVisibleTwo] = useState(false);

  const handlesubProductsPress = (item) => {
    setSelectedOrderForModification(item.id);
    setOrderDetails({ ...orderDetails, id: item.id });
    setIsDeleteModalVisibleTwo(true);
  };

  const toggleDeleteModalTwo = () => {
    setIsDeleteModalVisibleTwo(!isDeleteModalVisibleTwo);
  };

  const handleDeleteOrderConfirmedTwo = async (id) => {
    try {
      const responseData = await deleteDishesProducts(id);
      console.log("Variant deleted successfully:", responseData);

      toggleDeleteModalTwo();
    } catch (error) {
      console.error("Error deleting variant:", error);
    }
  };

  // Delete dish

  const [isDeleteModalVisibleThree, setIsDeleteModalVisibleThree] =
    useState(false);

  const handlesubDishPress = (item) => {
    setSelectedOrderForModification(item.D_no);
    setOrderDetails({ ...orderDetails, D_no: item.D_no });
    setIsDeleteModalVisibleThree(true);
  };

  const toggleDeleteModalThree = () => {
    setIsDeleteModalVisibleThree(!isDeleteModalVisibleThree);
  };

  const handleDeleteOrderConfirmedThree = async (D_no) => {
    try {
      const responseData = await deleteDish(D_no);
      console.log("Dish deleted successfully:", responseData);
      await fetchData(0, 0);
      toggleDeleteModalThree();
    } catch (error) {
      console.error("Error deleting dish:", error);
    }
  };

  //Add category

  const [Categories, setCategories] = useState([]);
  const [Variant, setVariants] = useState([]);

  const pk = 0;
  const hk = 0;
  const pt = 0;
  const dk = 0;

  useEffect(() => {
    getCategories(pk, hk)
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        console.error("Error when retrieving category data:", error);
      });

    getDishesVariants(pt, dk)
      .then((data) => {
        setVariants(data);
      })
      .catch((error) => {
        console.error("Error when retrieving data on meal variants:", error);
      });
  }, []);

  const [isProfileModalVisible, setProfileModalVisible] = useState(false);
  const [isBookingCancelled] = useState(false);

  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);

  //Back button

  const handleGoBack = async () => {
    // Przywróć widoczność głównych zamówień
    setIsMainOrdersVisible(true);
    // Ukryj podzamówienia
    setIsSubOrdersVisible(false);
    setIsVariantsOrdersVisible(false);
    setSelectedProducts([]);
    setSelectedVariants([]);
    // Aktualizacja danych dania
    await fetchData();
  };

  // User

  const [currentUser, setCurrentUser] = useState({ id: null, username: "" });

  useEffect(() => {
    // Funkcja ładowania danych użytkownika
    const loadUserData = async () => {
      try {
        const userData = await getUserDetails();

        setCurrentUser(userData);
      } catch (error) {
        console.error("Error while loading user data:", error);
      }
    };

    loadUserData();
  }, []);

  //Notifications

  const [notifications] = useState([
    {
      Notification_no: "",
      notification: "",
      status: "",
    },
  ]);

  const [isNotificationModalVisible, setNotificationModalVisible] =
    useState(false);

  const [users, setUsers] = useState([{ id: "", name: "", status: "" }]);

  // Logout

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
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
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
        source={require("./assets/background-image-restaurant.png")}
        style={styles.backgroundImage}
      />
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Image source={require("./assets/logo.svg")} style={styles.logo} />
          <View style={styles.headerTextContainer}>
            <TouchableOpacity onPress={() => handleLinkPress("Orders")}>
              <Text
                style={[
                  styles.headerLink,
                  selectedLink === "Orders" && styles.selectedLink,
                ]}
              >
                Orders
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleLinkPress("Kitchen")}>
              <Text
                style={[
                  styles.headerLink,
                  selectedLink === "Kitchen" && styles.selectedLink,
                ]}
              >
                Kitchen
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleLinkPress("Management")}>
              <Text
                style={[
                  styles.headerLink,
                  selectedLink === "Management" && styles.selectedLink,
                ]}
              >
                Management
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleLinkPress("Restaurant")}>
              <Text
                style={[
                  styles.headerLink,
                  selectedLink === "Restaurant" && styles.selectedLink,
                ]}
              >
                Restaurant
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleLinkPress("Categories")}>
              <Text
                style={[
                  styles.headerLink,
                  selectedLink === "Categories" && styles.selectedLink,
                ]}
              >
                Categories
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
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={toggleProfileModal}>
              <Image
                source={require("./assets/list.svg")}
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
                <Text style={styles.notificationModalText}>Notifications</Text>
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
          <Text style={styles.userInfoText}>User: {currentUser.username}</Text>
          <TouchableOpacity
            onPress={handleChangeUser}
            style={styles.changeUserButton}
          >
            <Text style={styles.changeUserButtonText}>Change user</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.contentContainer}>
        {isMainOrdersVisible && (
          <>
            <Text style={styles.additionalInfoText}>Menu</Text>
            <View style={styles.addContainer}>
              <FlatList
                data={dishes}
                horizontal={true}
                keyExtractor={(item, index) =>
                  item && item.order ? item.order.toString() : index.toString()
                }
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleCategorySelect(item.D_no)}
                  >
                    <View style={styles.additionalInfoContainer}>
                      {!isBookingCancelled && (
                        <View style={styles.InfoBox}>
                          <View style={styles.additionalInfoBox}>
                            <Image
                              source={require("./assets/dishes.png")}
                              style={styles.backgroundImageOrder}
                            />
                            <View style={styles.additionalInfoBoxSecond}>
                              <View style={styles.itionalInfoBoxSecondInfo}>
                                <View
                                  style={styles.itionalInfoBoxSecondInfoflex}
                                >
                                  <Image
                                    source={require("./assets/dish-icon.svg")}
                                    style={
                                      styles.additionalInfoBoxSecondbackgroundImage
                                    }
                                  />

                                  <View
                                    style={styles.itionalInfoBoxSecondInfoText}
                                  >
                                    <Text style={styles.infoBoxSecondInfoText}>
                                      {item.name}
                                    </Text>
                                    <Text
                                      style={styles.infoBoxSecondInfoTextSecond}
                                    >
                                      Description: {item.description}
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
                                    Category
                                  </Text>
                                  <Text
                                    style={
                                      styles.infoBoxSecondInfoTextSecondRowTwo
                                    }
                                  >
                                    {item.category}
                                  </Text>
                                </View>
                                <View>
                                  <Text
                                    style={styles.infoBoxSecondInfoTextRowTwo}
                                  >
                                    Cost
                                  </Text>
                                  <Text
                                    style={
                                      styles.infoBoxSecondInfoTextSecondRowTwo
                                    }
                                  >
                                    {item.Cost}
                                  </Text>
                                </View>
                                <View>
                                  <Text
                                    style={styles.infoBoxSecondInfoTextRowTwo}
                                  >
                                    Vat
                                  </Text>
                                  <Text
                                    style={
                                      styles.infoBoxSecondInfoTextSecondRowTwo
                                    }
                                  >
                                    {item.vat}
                                  </Text>
                                </View>
                              </View>
                            </View>
                            <View style={styles.additionalInfoBoxEdit}>
                              <>
                                <TouchableOpacity
                                  onPress={() => handlesubDishPress(item)}
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
            <View style={styles.buttonsContainer}>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={handleAddOrderPress}
                  style={styles.changeUserButtonTwo}
                >
                  <Text style={styles.changeUserButtonTextTwo}>Add Dish</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}

        {isSubOrdersVisible && (
          <>
            <Text style={styles.additionalInfoText}>Products</Text>
            <TouchableOpacity
              onPress={handleGoBack}
              style={styles.containergoBackButton}
            >
              <Text style={styles.goBackButton}>Back</Text>
            </TouchableOpacity>

            <View style={styles.addContainer}>
              <FlatList
                data={selectedProducts}
                horizontal={true}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleSsubProductsSelect(item)}
                  >
                    <View style={styles.additionalInfoContainer}>
                      <View style={styles.InfoBox}>
                        <View style={styles.additionalInfoBox}>
                          <Image
                            source={require("./assets/produkts.png")}
                            style={styles.backgroundImageOrder}
                          />
                          <View style={styles.additionalInfoBoxSecond}>
                            <View style={styles.itionalInfoBoxSecondInfo}>
                              <View style={styles.itionalInfoBoxSecondInfoflex}>
                                <Image
                                  source={require("./assets/dish-icon.svg")}
                                  style={
                                    styles.additionalInfoBoxSecondbackgroundImage
                                  }
                                />
                                <View
                                  style={styles.itionalInfoBoxSecondInfoText}
                                >
                                  <Text style={styles.infoBoxSecondInfoText}>
                                    {item.name}
                                  </Text>
                                  <Text
                                    style={styles.infoBoxSecondInfoTextSecond}
                                  >
                                    Dish: {item.Dish}
                                  </Text>
                                </View>
                              </View>
                            </View>
                            <View style={styles.additionalInfoBoxSecondRowTwo}>
                              <View>
                                <Text
                                  style={styles.infoBoxSecondInfoTextRowTwo}
                                >
                                  Weight
                                </Text>
                                <Text
                                  style={
                                    styles.infoBoxSecondInfoTextSecondRowTwo
                                  }
                                >
                                  {item.weight}
                                </Text>
                              </View>
                            </View>
                          </View>
                          <View style={styles.additionalInfoBoxEdit}>
                            <>
                              <TouchableOpacity
                                onPress={() => handlesubProductsPress(item)}
                              >
                                <Text
                                  style={styles.additionalInfoBoxEditSecond}
                                >
                                  Delete
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
                onPress={toggleSubProductsModal}
                style={styles.changeUserButtonTwo}
              >
                <Text style={styles.changeUserButtonTextTwo}>Add Product</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        {isVariantsOrdersVisible && (
          <>
            <Text style={styles.additionalInfoText}>Variants</Text>
            <TouchableOpacity
              onPress={handleGoBack}
              style={styles.containergoBackButton}
            >
              <Text style={styles.goBackButton}>Back</Text>
            </TouchableOpacity>

            <View style={styles.addContainer}>
              <FlatList
                data={selectedVariants}
                horizontal={true}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleSsubProductsSelect(item)}
                  >
                    <View style={styles.additionalInfoContainer}>
                      <View style={styles.InfoBox}>
                        <View style={styles.additionalInfoBox}>
                          <Image
                            source={require("./assets/variants.png")}
                            style={styles.backgroundImageOrder}
                          />
                          <View style={styles.additionalInfoBoxSecond}>
                            <View style={styles.itionalInfoBoxSecondInfo}>
                              <View style={styles.itionalInfoBoxSecondInfoflex}>
                                <Image
                                  source={require("./assets/dish-icon.svg")}
                                  style={
                                    styles.additionalInfoBoxSecondbackgroundImage
                                  }
                                />
                                <View
                                  style={styles.itionalInfoBoxSecondInfoText}
                                >
                                  <Text style={styles.infoBoxSecondInfoText}>
                                    {item.Variant_no}
                                  </Text>
                                  <Text
                                    style={styles.infoBoxSecondInfoTextSecond}
                                  >
                                    Dish: {item.Dish}
                                  </Text>
                                </View>
                              </View>
                            </View>
                            <View style={styles.additionalInfoBoxSecondRowTwo}>
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
                                onPress={() => handleDeleteVariant(item)}
                              >
                                <Text
                                  style={styles.additionalInfoBoxEditSecond}
                                >
                                  Delete
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
            <View style={styles.buttonContainerVariant}>
              <TouchableOpacity
                onPress={toggleSubVariantssModal}
                style={styles.changeUserButtonTwo}
              >
                <Text style={styles.changeUserButtonTextTwo}>Add Variant</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isCategoryModalVisible}
        onRequestClose={() => setIsCategoryModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Products or Variants</Text>

            <TouchableOpacity onPress={handleCategoryProductsPress}>
              <Text style={styles.modifyModalSaveButton}>Products</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleCategoryVariantsPress}>
              <Text style={styles.modifyModalSaveButton}>Variants</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setIsCategoryModalVisible(false)}>
              <Text style={styles.modalButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
        visible={isDeleteModalVisibleThree}
        onRequestClose={toggleDeleteModalThree}
      >
        <View style={styles.profileModalContainer}>
          <View style={styles.profileModalContent}>
            <Text style={styles.profileModalLink}>
              Are you sure you want to delete?
            </Text>
            <TouchableOpacity
              onPress={() =>
                handleDeleteOrderConfirmedThree(selectedOrderForModification)
              }
            >
              <Text style={styles.profileModalLink}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleDeleteModalThree}>
              <Text style={styles.profileModalLink}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={onRequestClose}
      >
        <View style={styles.modifyModalContainer}>
          <View style={styles.modifyModalContent}>
            <TextInput
              style={styles.modifyModalInput}
              placeholder="Name"
              value={editedDish.name}
              onChangeText={(text) => handleChangeText("name", text)}
            />
            <Picker
              style={styles.picker}
              selectedValue={editedDish.Category}
              onValueChange={(value) => handleChangeText("category", value)}
            >
              <Picker.Item label="Choose a category" value="" />
              {Categories.map((category) => (
                <Picker.Item
                  key={category.Category}
                  label={category.name}
                  value={category.Category}
                />
              ))}
            </Picker>
            <TextInput
              style={styles.modalInput}
              placeholder="Description"
              value={editedDish.description}
              onChangeText={(text) => handleChangeText("description", text)}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Cost"
              value={editedDish.Cost}
              onChangeText={(text) => handleChangeText("Cost", text)}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Vat"
              value={editedDish.vat}
              onChangeText={(text) => handleChangeText("vat", text)}
            />

            <TouchableOpacity onPress={handleSave}>
              <Text style={styles.modifyModalSaveButton}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onRequestClose}>
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
            <Text style={styles.modalText}>Add Dish</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Name"
              value={orderDetails.name}
              onChangeText={(text) =>
                setOrderDetails({ ...orderDetails, name: text })
              }
            />
            <Picker
              style={styles.picker}
              selectedValue={orderDetails.Categories}
              onValueChange={(text) =>
                setOrderDetails({ ...orderDetails, Categories: text })
              }
            >
              <Picker.Item
                key="default"
                label="Choose a category"
                value={null}
              />
              {Categories.map((category) => (
                <Picker.Item
                  key={category.Category}
                  label={category.name}
                  value={category.Category}
                />
              ))}
            </Picker>

            <TextInput
              style={styles.modalInput}
              placeholder="Description"
              value={orderDetails.description}
              onChangeText={(text) =>
                setOrderDetails({ ...orderDetails, description: text })
              }
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Cost"
              value={orderDetails.Cost}
              onChangeText={(text) => {
                let formattedText = text
                  .replace(/\D/g, "")
                  .replace(/(\d{1})(\d{0,2})/, "$1.$2");
                setOrderDetails({ ...orderDetails, Cost: formattedText });
              }}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Vat"
              keyboardType="numeric"
              value={orderDetails.vat}
              onChangeText={(text) => {
                // Usunięcie wszystkich znaków z wyjątkiem cyfr i kropki
                let cleanedText = text.replace(/[^\d.]/g, "");

                // oddzielenie części całkowitej od części ułamkowej
                let parts = cleanedText.split(".");
                let integerPart = parts[0];
                let decimalPart = parts[1] || "";

                // ograniczenie liczby cyfr w części ułamkowej do dwóch
                decimalPart = decimalPart.slice(0, 2);

                // Łączenie części całkowitej i ułamkowej przez dodanie kropki
                let formattedText = integerPart
                  ? integerPart + "." + decimalPart
                  : text === "."
                  ? "0."
                  : "";

                // Sprawdzenie, czy wartość jest większa niż 1, a następnie ograniczenie jej do 1,00
                let numberValue = parseFloat(formattedText);
                if (numberValue > 1) {
                  formattedText = "1.00";
                }

                // Aktualizacja stanu komponentu
                setOrderDetails({ ...orderDetails, vat: formattedText });
              }}
            />
            <TouchableOpacity onPress={handleAddDishToMenu}>
              <Text style={styles.modalAddOrderButton}>Add Dish</Text>
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
        visible={isModalProductVisible}
        onRequestClose={toggleModalProduct}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Add Product</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Name"
              value={orderDetails.name}
              onChangeText={(text) =>
                setOrderDetails({ ...orderDetails, name: text })
              }
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Dish"
              value={selectedOrderId.toString()}
              editable={false}
              onTouchStart={() => {
                openOrderSelector();
              }}
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Weight"
              value={orderDetails.weight}
              onChangeText={(text) => {
                let formattedText = text
                  .replace(/\D/g, "")
                  .replace(/(\d{1})(\d{0,2})/, "$1.$2");
                setOrderDetails({ ...orderDetails, weight: formattedText });
              }}
            />
            <TouchableOpacity onPress={handleAddProductToMenu}>
              <Text style={styles.modalAddOrderButton}>Add Product</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleModalProduct}>
              <Text style={styles.modalCloseButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVariantsVisible}
        onRequestClose={toggleModalVariants}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Add Variant</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Name"
              value={orderDetails.Variant_no}
              onChangeText={(text) =>
                setOrderDetails({ ...orderDetails, Variant_no: text })
              }
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Dish"
              value={selectedOrderId.toString()}
              editable={false}
              onTouchStart={() => {
                openOrderSelector();
              }}
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Count"
              value={orderDetails.count}
              onChangeText={(text) => {
                let formattedText = text
                  .replace(/\D/g, "")
                  .replace(/(\d{1})(\d{0,2})/, "$1.$2");
                setOrderDetails({ ...orderDetails, count: formattedText });
              }}
            />
            <TouchableOpacity onPress={handleAddVariantsToMenu}>
              <Text style={styles.modalAddOrderButton}>Add Variant</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleModalVariants}>
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

  contentContainerTwo: {
    width: "100%",
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
    width: 20,
    height: 20,
    marginLeft: 10,
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
  additionalInfoTextVariants: {
    color: "#000",
    fontSize: 18,
    fontWeight: "light",
    paddingTop: 15,
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
  backgroundImageOrder: {
    width: "100%",
    height: 279,
    resizeMode: "cover",
    position: "absolute",
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
  buttonContainerVariant: {
    marginTop: 30,
    marginBottom: 30,
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

  modalCloseButton: {
    color: "black",
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
    width: "60%",
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
    color: "black",
    fontSize: 16,
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
    color: "black",
  },
  profileModalCloseButton: {
    color: "black",
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
    color: "black",
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
    color: "black",
    fontSize: 16,
  },
  addContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    gap: 2,
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

  picker: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "gray",
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
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

  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: "bold",
  },
});

export default Restaurant;
