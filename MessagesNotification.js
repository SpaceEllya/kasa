import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  Picker,
} from "react-native";

import {
  getNotifications,
  getUsersDetails,
  createNotification,
  markNotificationAsViewed,
} from "./ApiComponent";

const MessagesNotification = ({ isVisible, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [notificationText, setNotificationText] = useState("");
  const [isSendingNotification, setIsSendingNotification] = useState(false);
  const [selectedUsername, setSelectedUsername] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(0);
  const [activeNotificationId, setActiveNotificationId] = useState(null);

  // Receive notifications and updates

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notificationsData = await getNotifications();
        setNotifications(notificationsData);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    const interval = setInterval(fetchNotifications, 10000);

    fetchNotifications();

    return () => clearInterval(interval);
  }, []);

  // Message read

  const handleOpenNotification = async (notificationId) => {
    try {
      setActiveNotificationId(notificationId);
      await markNotificationAsViewed(notificationId);
      const updatedNotifications = notifications.map((notification) => {
        if (notification.id === notificationId) {
          return { ...notification, status: 2 };
        }
        return notification;
      });

      setNotifications(updatedNotifications);
    } catch (error) {
      console.error("Error marking notification as viewed:", error);
    }
  };

  // Notifications

  const renderNotificationItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => handleOpenNotification(item.Notification_no)}
      >
        <View
          style={[
            styles.notificationItemContainer,
            activeNotificationId === item.Notification_no && {
              backgroundColor: "#FF9C40",
            },
          ]}
        >
          <View style={styles.notificationItemContent}>
            <Text
              style={[
                styles.notificationItemContentText,
                activeNotificationId === item.Notification_no && {
                  color: "#fff",
                },
              ]}
            >
              {item.notification}
            </Text>
            <Text
              style={[
                styles.notificationItemContentTextStatus,
                activeNotificationId === item.Notification_no && {
                  color: "#fff",
                },
              ]}
            >
              Status: {item.status === 1 ? "Warning" : "Info"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Send User Mess

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsersDetails(0, 0);
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const renderUserItem = ({ item }) => {
    return (
      <View style={styles.notificationItemContainer}>
        <TouchableOpacity
          onPress={() => {
            handleUserSelect(item);
          }}
        >
          <View style={styles.notificationItemContent}>
            <Text style={styles.notificationItemContentText}>
              {item.username}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const handleSendNotification = async () => {
    try {
      if (!selectedUserId || !notificationText.trim()) {
        return;
      }

      const notificationData = {
        To: selectedUserId,
        notification: notificationText,
        status: selectedStatus,
      };

      await createNotification(notificationData);
      setNotificationText("");
      setIsSendingNotification(false);
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsersDetails(0, 0);
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleUserSelect = (item) => {
    setSelectedUserId(item.id);
    setSelectedUsername(item.username);
    setIsSendingNotification(true);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.notificationContent}>
          <View style={styles.centeredContainer}>
            <Text style={styles.notificationHeaderText}>Notifications</Text>
          </View>
          <View style={styles.notificationsContent}>
            <FlatList
              data={notifications.slice().reverse()}
              renderItem={renderNotificationItem}
              keyExtractor={(item) => item.Notification_no.toString()}
            />
          </View>

          {isSendingNotification ? (
            <>
              <View style={styles.centeredContainer}>
                <Text style={styles.notificationHeaderText}>
                  Send notification to {selectedUsername}
                </Text>
              </View>

              <TextInput
                style={styles.inputField}
                placeholder="Type your message here..."
                value={notificationText}
                onChangeText={setNotificationText}
                multiline
              />

              <View style={styles.centeredContainer}>
                <Text style={styles.notificationHeaderStatus}>Status:</Text>
                <Picker
                  selectedValue={selectedStatus}
                  style={styles.picker}
                  onValueChange={(itemValue) => setSelectedStatus(itemValue)}
                >
                  <Picker.Item label="Info" value={0} />
                  <Picker.Item label="Warning" value={1} />
                </Picker>
              </View>

              <TouchableOpacity onPress={handleSendNotification}>
                <Text style={styles.sendMessageButton}>Send Notification</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsSendingNotification(false)}>
                <Text style={styles.notificationCloseButton}>Close</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.centeredContainer}>
                <Text style={styles.notificationHeaderText}>
                  Send notification
                </Text>
              </View>
              <View style={styles.notificationsContentMess}>
                <FlatList
                  data={users}
                  renderItem={renderUserItem}
                  keyExtractor={(item) => item.id.toString()}
                />
              </View>

              <TouchableOpacity onPress={onClose}>
                <Text style={styles.notificationCloseButton}>Close</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  notificationContent: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: "center",
    width: "40%",
    height: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  centeredContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  notificationHeaderText: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  notificationHeaderStatus: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },

  inputField: {
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
    marginVertical: 10,
    justifyContent: "center",
    width: "100%",
    minHeight: 100,
    textAlignVertical: "center",
    color: "white",
  },
  sendMessageButton: {
    backgroundColor: "#FA8E4D",
    color: "#fff",
    fontSize: 16,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    textAlign: "center",
    marginBottom: 10,
  },
  notificationCloseButton: {
    backgroundColor: "#FA8E4D",
    color: "#fff",
    fontSize: 16,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },

  notificationItemContainer: {
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  notificationItemContent: {
    padding: 10,
  },
  notificationsContent: {
    height: "50%",
    width: "100%",
    marginTop: 15,
  },
  notificationsContentMess: {
    width: "100%",
    marginTop: 15,
  },
  notificationItemContentText: {
    fontSize: 18,
    fontWeight: "light",
    color: "#000618",
  },
  notificationItemContentTextStatus: {
    fontSize: 14,
    fontWeight: "light",
    color: "#646567",
  },
});

export default MessagesNotification;
