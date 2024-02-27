import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  Picker,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import MessagesNotification from "./MessagesNotification";
import {
  getKitchenOrders,
  updateDoneStatus,
  logoutUser,
  checkNotifications,
} from "./ApiComponent";

const Kuchnia = () => {
  const navigation = useNavigation();
  const [selectedLink, setSelectedLink] = useState(null);
  const [isTooltipVisible, setTooltipVisible] = useState(false);
  const [isProfileModalVisible, setProfileModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filter, setFilter] = useState("");
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);
  const [isMessagesNotificationVisible, setMessagesNotificationVisible] =
    useState(false);
  const [notifications, setNotifications] = useState([]);
  const [selectedOrderIndex, setSelectedOrderIndex] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [ordersMap, setOrdersMap] = useState(new Map());
  const [filteredOrders, setFilteredOrders] = useState([]);

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

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getKitchenOrders(0);
      const ordersData = response.Orders || [];

      const formattedOrders = ordersData.map((order) => ({
        Order: order.Order,
        id: order.id,
        count: order.count,
        done: false,
        Variant_no: order.Variant_no,
        Variant_count: order.Variant_count,
        Dish_name: order.Dish_name,
        note: order.note || "",
      }));

      const newOrdersMap = new Map();

      formattedOrders.forEach((order) => {
        const orderId = order.Order;
        if (!newOrdersMap.has(orderId)) {
          newOrdersMap.set(orderId, []);
        }
        newOrdersMap.get(orderId).push(order);
      });

      setOrdersMap(newOrdersMap);
    } catch (error) {
      console.error("Błąd podczas pobierania zamówień kuchennych:", error);
    }
  };

  useEffect(() => {
    if (ordersMap.size > 0) {
      setFilteredOrders(getSortedAndFilteredOrders());
    }
  }, [ordersMap, filter, selectedCategory, sortOrder]);

  const getSortedAndFilteredOrders = () => {
    const lowercasedFilter = filter.toLowerCase();

    const allOrders = Array.from(ordersMap.values()).flat();

    const filteredOrders = allOrders.filter(
      (order) =>
        (order &&
          order[selectedCategory] &&
          order[selectedCategory].toString().includes(lowercasedFilter)) ||
        (order.Dish_name &&
          order.Dish_name.toLowerCase().includes(lowercasedFilter)) ||
        (order.note && order.note.toLowerCase().includes(lowercasedFilter)) ||
        (order.Variant_no &&
          order.Variant_no.toLowerCase().includes(lowercasedFilter)) ||
        (order.Variant_count &&
          order.Variant_count.toString().includes(lowercasedFilter)) ||
        (order.done && order.done.toString().includes(lowercasedFilter)) ||
        (order.count && order.count.toString().includes(lowercasedFilter))
    );

    filteredOrders.sort((a, b) => {
      const aValue = (a[selectedCategory] || "").toString().toLowerCase();
      const bValue = (b[selectedCategory] || "").toString().toLowerCase();

      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

    return filteredOrders;
  };

  useEffect(() => {
    if (ordersMap.size > 0) {
      setFilteredOrders(getSortedAndFilteredOrders());
    }
  }, [ordersMap, filter, selectedCategory, sortOrder]);

  const handleOpenMessagesNotification = () => {
    setMessagesNotificationVisible(true);
  };

  const handleSelectUserFromNotification = (userId) => {
    console.log("Selected user ID:", userId);
  };

  const sendNotification = (orderNumber, dishName, newStatus) => {
    const newNotification = {
      message: `Zamowienie: ${orderNumber}\nNazwa: ${dishName}\nStatus: ${newStatus}`,
      read: false,
    };
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      newNotification,
    ]);
    handleOpenMessagesNotification();
  };

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

  const toggleProfileModal = () => {
    setProfileModalVisible(!isProfileModalVisible);
  };

  const handleLinkPress = (screenName) => {
    navigation.navigate(screenName);
    setSelectedLink(screenName);
  };

  const handleStatusChange = async (order) => {
    try {
      console.log("Selected Order:", order);
      setSelectedOrderIndex(order.id);
      setNewStatus(order.done === "true");

      await updateDoneStatus(order.id);
      fetchOrders(0);
    } catch (error) {
      console.error(
        "Błąd podczas aktualizacji statusu wykonania zamówienia:",
        error
      );
    }
  };

  useEffect(() => {
    if (ordersMap.size > 0) {
      setFilteredOrders(getSortedAndFilteredOrders());
    }
  }, [ordersMap, filter, selectedCategory, sortOrder]);

  const handleSortOrderChange = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    // После изменения порядка сортировки вызываем функцию для обновления отфильтрованных заказов
    setFilteredOrders(getSortedAndFilteredOrders());
  };

  const handleCategoryChange = (itemValue) => {
    setSelectedCategory(itemValue);
    // После изменения категории вызываем функцию для обновления отфильтрованных заказов
    setFilteredOrders(getSortedAndFilteredOrders());
  };

  const handleFilterChange = (text) => {
    setFilter(text);
    // После изменения фильтра вызываем функцию для обновления отфильтрованных заказов
    setFilteredOrders(getSortedAndFilteredOrders());
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
                notifications={notifications}
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
      </View>

      <View style={styles.addBasicInfoContainer}>
        <View style={styles.additionalInfoContainer}>
          <Text style={styles.additionalInfoText}>Lista kuchni</Text>
          <View style={styles.InfoBox}>
            <View style={styles.additionalInfoBox}>
              <View style={styles.additionalInfoBoxSecond}>
                {/* <View style={styles.itionalInfoBoxSecondInfo}>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Szukać"
                    value={filter}
                    onChangeText={handleFilterChange}
                  />

                  <View style={styles.additionalInfoBoxEdit}>
                    <Picker
                      selectedValue={selectedCategory}
                      onValueChange={handleCategoryChange}
                      style={styles.pickerStyle}
                    >
                      <Picker.Item label="Filtr" value="" />
                      <Picker.Item label="Numer zamówienia" value="Order" />
                      <Picker.Item label="Nazwa dania" value="Dish_name" />
                      <Picker.Item label="Uwagi" value="note" />
                      <Picker.Item label="Variant" value="Variant_no" />
                      <Picker.Item label="Kwota" value="count" />
                    </Picker>
                    <TouchableOpacity
                      onPress={handleSortOrderChange}
                      style={styles.sortOrderButton}
                    >
                      <Text>{sortOrder === "asc" ? "↓" : "↑"}</Text>
                    </TouchableOpacity>
                  </View>
                </View> */}

                <FlatList
                  data={Array.from(ordersMap.values()).flat()}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <View style={styles.orderItemContainer}>
                      <Text
                        style={styles.orderItem}
                      >{`Zamówienie: ${item.Order}`}</Text>
                      <Text
                        style={styles.orderItem}
                      >{`Nazwa: ${item.Dish_name}`}</Text>
                      <Text
                        style={styles.orderItem}
                      >{`Uwagi: ${item.note}`}</Text>
                      <Text
                        style={styles.orderItem}
                      >{`Variant: ${item.Variant_no}`}</Text>
                      <Text
                        style={styles.orderItem}
                      >{`Kwota Variant: ${item.Variant_count}`}</Text>
                      <Text
                        style={styles.orderItem}
                      >{`Status: ${item.done}`}</Text>
                      <Text
                        style={styles.orderItem}
                      >{`Kwota: ${item.count}`}</Text>
                      <TouchableOpacity
                        onPress={() => handleStatusChange(item)}
                        style={styles.statusChangeButton}
                      >
                        <Text style={styles.statusChangeButtonText}>
                          Zmień status
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                />
              </View>
            </View>
          </View>
        </View>
      </View>

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
    alignItems: "center",
  },
  backgroundImage: {
    width: "100%",
    height: 60,
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

  orderItem: {
    maxWidth: 130,
    minWidth: 130,
    fontSize: 16,
    marginBottom: 5,
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
  additionalInfoContainer: {
    width: "100%",
    height: "100%",
    marginTop: 20,
  },
  additionalInfoText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "light",
  },
  additionalInfoBox: {
    width: "100%",
    height: "100%",
    backgroundColor: "#FA8E4D",
    marginTop: 20,
    borderRadius: 10,
    position: "absolute",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowColor: "#000",
  },
  additionalInfoBoxSecond: {
    width: "100%",
    height: "90%",
    backgroundColor: "#FFF",
    borderRadius: 10,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowColor: "#000",
    padding: 14,
  },
  itionalInfoBoxSecondInfo: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 30,
  },
  additionalInfoBoxSecondbackgroundImage: {
    width: 65,
    height: 65,
  },
  additionalInfoBoxSecondImage: {
    width: 20,
    height: 20,
  },
  infoBoxSecondInfoText: {
    fontSize: 18,
    marginLeft: 20,
    fontWeight: "light",
    color: "#000618",
  },
  infoBoxSecondInfoTextSecond: {
    fontSize: 14,
    marginLeft: 20,
    fontWeight: "light",
    color: "#646567",
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
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 500,
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
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalInput: {
    width: "30%",
    height: 30,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 15,
    paddingLeft: 10,
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    alignItems: "center",
    margin: 10,
  },
  modalCloseButton: {
    color: "#FA8E4D",
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
  },
  modalAddButton: {
    backgroundColor: "#FA8E4D",
    color: "#fff",
    fontSize: 16,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
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
  pickerStyle: {
    height: 30,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 15,
    marginRight: 5,
    paddingLeft: 5,
  },
  statusChangeButton: {
    backgroundColor: "#FA8E4D",
    color: "white",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },

  statusChangeButtonText: {
    color: "white",
    fontSize: 14,
  },
  addBasicInfoContainer: {
    width: "70%",
    height: "85%",
  },
  orderText: {
    fontSize: 16,
    width: "100%",
  },
  InfoBox: {
    height: "90%",
    width: "100%",
  },
  orderItemContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    alignItems: "center",

    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 20,
    marginBottom: 20,
  },
});

export default Kuchnia;
