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
  getOrdersDetails,
  getOrdersHasDishes,
  deleteOrder,
  kitchenOrderCreate,
  kitchenOrderStart,
  getDishes,
  getDishesVariants,
  deleteOrderPart,
  createBill,
  getBills,
  logoutUser,
  getUsersDetails,
  checkNotifications,
} from "./ApiComponent";

const Orders = () => {
  const navigation = useNavigation();

  //Get Users

  const [isUserSelectionModalVisible, setUserSelectionModalVisible] =
    useState(false);

  const handleChangeUser = async () => {
    setUserSelectionModalVisible(true);
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

  const [isProfileModalVisible, setProfileModalVisible] = useState(false);
  const [isBookingCancelled] = useState(false);

  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);

  const [isMessagesNotificationVisible, setMessagesNotificationVisible] =
    useState(false);

  // Notifications

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

  const [isOrders, setFetchOrders] = useState([]);

  const fetchOrdersDetails = async (pk, uk) => {
    try {
      const data = await getOrdersDetails(pk, uk);
      const formattedData = data.map((item) => ({
        ...item,
        time: formatTimeString(item.time),
      }));
      setFetchOrders(formattedData);
      return { pk, uk, data };
    } catch (error) {
      console.error("Error when downloading order details:", error);
    }
  };
  useEffect(() => {
    fetchOrdersDetails(0, 0);
  }, []);

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
  const [selectedOrderId, setSelectedOrderId] = useState("");

  // Get Orders Has Dishes

  const handleCategorySelect = async (category) => {
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
      console.error("Error in receiving orders:", error);
    }
  };

  const [Dish, setDishes] = useState([]);
  const [Variant, setVariants] = useState([]);
  const pt = 0;
  const kk = 0;
  const dk = 0;

  useEffect(() => {
    // Get dish data
    getDishes(pt, kk)
      .then((data) => {
        setDishes(data);
      })
      .catch((error) => {
        console.error("Error when retrieving dish data:", error);
      });

    // Get data on meal variants
    getDishesVariants(pt, dk)
      .then((data) => {
        setVariants(data);
      })
      .catch((error) => {
        console.error("Error when retrieving data on meal variants:", error);
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
    setIsModalVisible(true);
  };

  // Get Bills

  const [bills, setBills] = useState([]);
  const [isModalVisibleBills, setModalVisibleBills] = useState(false);

  const closeModal = () => {
    setModalVisibleBills(false);
  };

  const handleShowBillsPress = async () => {
    try {
      const response = await getBills(0, 0);
      const formattedData = response.map((item) => ({
        ...item,
        time: formatTimeString(item.time),
      }));
      setBills(formattedData);
      setModalVisibleBills(true);
    } catch (error) {
      console.error("Error while downloading bills:", error);
    }
  };

  // Dodowanie zamówienia

  const handleAddOrder = async () => {
    try {
      // Przesyłanie odebranych danych do pamięci masowej
      const requestData = {
        Order: orderDetails.Order,
        Dish: orderDetails.Dish,
        counts: orderDetails.counts,
        Variant: orderDetails.Variant,
        note: orderDetails.note,
      };
      // Przekazywanie danych do bazy danych
      await kitchenOrderCreate(
        requestData.Order,
        requestData.Dish,
        requestData.counts,
        requestData.Variant,
        requestData.note
      );

      // Aktualizacja listy po dodaniu zamówienia
      await fetchOrdersDetails(0, 0);
      await getOrdersHasDishes(0, 0);
    } catch (error) {
      console.error("Error when creating a new kitchen order:", error);
    }
  };

  // Add Bill

  const handleAddBillPress = async (category) => {
    try {
      await createBill(category.Order);
      await fetchOrdersDetails(0, 0);
    } catch (error) {
      console.error("Error when creating an account:", error);
    }
  };

  // Delete Order

  const toggleDeleteModal = () => {
    setDeleteModalVisible(!isDeleteModalVisible);
  };

  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

  const handleDeleteOrderPress = (item) => {
    setSelectedOrderForModification(item.Order);
    setOrderDetails({ ...orderDetails, Order: item.Order });
    setDeleteModalVisible(true);
  };

  const handleDeleteOrderConfirmed = async (orderId) => {
    try {
      await deleteOrder(orderId);
      await fetchOrdersDetails(0, 0);
      toggleDeleteModal();
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  // Delete Order Two
  const toggleDeleteModalTwo = () => {
    setDeleteModalVisibleTwo(!isDeleteModalVisibleTwo);
  };

  const [isDeleteModalVisibleTwo, setDeleteModalVisibleTwo] = useState(false);

  const handleDeleteOrderPressTwo = (item) => {
    setSelectedOrderForModification(item.id);
    setOrderDetails({ ...orderDetails, id: item.id });
    setDeleteModalVisibleTwo(true);
  };

  const handleDeleteOrderConfirmedTwo = async (orderPartId) => {
    try {
      await deleteOrderPart(orderPartId);
      toggleDeleteModalTwo();
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  // Add nowe zamowienie

  const handleAddCategory = async () => {
    try {
      const table = orderDetails.table;
      console.log("Table number:", table);

      const response = await kitchenOrderStart(table);
      console.log("The new order has been started:", response);
      fetchOrdersDetails(0, 0);
      handleModalClose();
    } catch (error) {
      console.error("Error when adding an order:", error);
    }
  };

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  // Back button

  const handleGoBack = () => {
    setIsMainOrdersVisible(true);

    setIsSubOrdersVisible(false);
    setSubOrders([]);
  };

  // User

  const [currentUser, setCurrentUser] = useState({ id: null, username: "" });

  useEffect(() => {
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

  const handleOpenMessagesNotification = () => {
    setMessagesNotificationVisible(true);
  };

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
        source={require("./assets/background-image-orders_2.png")}
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
        <Text style={styles.additionalInfoText}>Orders</Text>
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
                data={isOrders}
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
                            <Image
                              source={require("./assets/order-not-done.png")}
                              style={styles.backgroundImageOrder}
                            />
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
                                    Create A Bill
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
                  <Text style={styles.changeUserButtonTextTwo}>Add Order</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={handleShowBillsPress}
                  style={styles.changeUserButtonTwo}
                >
                  <Text style={styles.changeUserButtonTextTwo}>Show Bills</Text>
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
                          {item.done ? (
                            <Image
                              source={require("./assets/order-done.png")}
                              style={styles.backgroundImageOrder}
                            />
                          ) : (
                            <Image
                              source={require("./assets/order-not-done.png")}
                              style={styles.backgroundImageOrder}
                            />
                          )}
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
                              <TouchableOpacity>
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
                <Text style={styles.changeUserButtonTextTwo}>Add Order</Text>
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
            <Text style={styles.modalTitle}>Select User</Text>
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
            <Text style={styles.billTextUp}>Bills</Text>
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
            <Text style={styles.modalText}>Add Order</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Table"
              value={orderDetails.table ? orderDetails.table.toString() : ""}
              onChangeText={(text) =>
                setOrderDetails({ ...orderDetails, table: text })
              }
            />
            <TouchableOpacity onPress={handleAddCategory}>
              <Text style={styles.modalAddOrderButton}>Add Order</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleModalClose}>
              <Text style={styles.modalCloseButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Dodowanie zamówienia */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addOrderModalVisible} // Otwieranie okna modalnego
        onRequestClose={() => setAddOrderModalVisible(false)} // Zamknieńcie okna modalnego
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>New Order</Text>

            <TextInput // Dodowanie id zamówienia
              style={styles.modalInput}
              placeholder="Order"
              value={selectedOrderId.toString()}
              editable={false}
              onTouchStart={() => {
                openOrderSelector();
              }}
            />

            <Picker // Dodowanie dania
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

            <TextInput // Dodowanie kwoty
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

            <TextInput // Dodowanie uwag
              style={styles.modalInput}
              placeholder="Note"
              value={orderDetails.note}
              onChangeText={(text) =>
                setOrderDetails({ ...orderDetails, note: text })
              }
            />

            <Picker // Dodowanie wariantów
              style={styles.picker}
              selectedValue={orderDetails.Variant}
              onValueChange={(text) =>
                setOrderDetails({ ...orderDetails, Variant: text })
              }
            >
              <Picker.Item label="Сhoose a variant" value={null} />
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
  additionalInfoBox: {
    width: 393,
    height: 279,
    backgroundColor: "#EB8C34",
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
    backgroundColor: "#98A21E",
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
    color: "000",
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

export default Orders;
