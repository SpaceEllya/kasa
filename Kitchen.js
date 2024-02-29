import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
  Modal,
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

const Kitchen = () => {
  const navigation = useNavigation();
  const [selectedLink, setSelectedLink] = useState(null);
  const [isProfileModalVisible, setProfileModalVisible] = useState(false);
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);
  const [isMessagesNotificationVisible, setMessagesNotificationVisible] =
    useState(false);
  const [notifications] = useState([]);
  const [selectedOrderIndex, setSelectedOrderIndex] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [ordersMap, setOrdersMap] = useState(new Map());
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

  // Get Kitchen Orders

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
      console.error("Error when downloading kitchen orders:", error);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOpenMessagesNotification = () => {
    setMessagesNotificationVisible(true);
  };

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

  const toggleProfileModal = () => {
    setProfileModalVisible(!isProfileModalVisible);
  };

  const handleLinkPress = (screenName) => {
    navigation.navigate(screenName);
    setSelectedLink(screenName);
  };

  // Zmiana statusu na gotowy

  const handleStatusChange = async (order) => {
    try {
      setSelectedOrderIndex(order.id);
      setNewStatus(order.done === "true");

      await updateDoneStatus(order.id);
      fetchOrders(0);
    } catch (error) {
      console.error("Error while updating the order execution status:", error);
    }
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
                notifications={notifications}
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
          <Text style={styles.additionalInfoText}>List of kitchens</Text>
          <View style={styles.InfoBox}>
            <View style={styles.additionalInfoBox}>
              <View style={styles.additionalInfoBoxSecond}>
                <FlatList
                  data={Array.from(ordersMap.values()).flat()}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <View style={styles.orderItemContainer}>
                      <Text
                        style={styles.orderItem}
                      >{`Orders: ${item.Order}`}</Text>
                      <Text
                        style={styles.orderItem}
                      >{`Name: ${item.Dish_name}`}</Text>
                      <Text
                        style={styles.orderItem}
                      >{`Notes: ${item.note}`}</Text>
                      <Text
                        style={styles.orderItem}
                      >{`Variant: ${item.Variant_no}`}</Text>
                      <Text
                        style={styles.orderItem}
                      >{`Cost Variant: ${item.Variant_count}`}</Text>
                      <Text
                        style={styles.orderItem}
                      >{`Status: ${item.done}`}</Text>
                      <Text
                        style={styles.orderItem}
                      >{`Cost: ${item.count}`}</Text>
                      <TouchableOpacity
                        onPress={() => handleStatusChange(item)}
                        style={styles.statusChangeButton}
                      >
                        <Text style={styles.statusChangeButtonText}>
                          Change status
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

export default Kitchen;
