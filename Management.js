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
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import MessagesNotification from "./MessagesNotification";

import {
  getUserDetails,
  getUsersDetails,
  getGroupPermissions,
  getUserPermissions,
  getUserGroup,
  editUser,
  removeUser,
  registerUser,
  deactivateUser,
  logoutUser,
  getGroupPermissionsModal,
  addPermissionToGroup,
  removePermissionFromGroup,
  addGroup,
  deleteGroup,
  addPermissionToUser,
  removePermissionFromUser,
  AddUserToGroup,
  RemoveUserFromGroup,
  checkNotifications,
} from "./ApiComponent";

const Management = () => {
  const navigation = useNavigation();

  // Add pracownikow

  const [isUsersDetails, setUsersDetails] = useState([]);
  const [isMainOrdersVisible] = useState(true);

  const fetchUserDetails = async () => {
    try {
      const userData = await getUsersDetails(0, 0);

      const userDetails = userData.map((user) => ({
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        phone_no: user.phone_no,
        hired_time: user.hired_time,
        fired_time: user.fired_time,
        last_login: formatTimeString(user.last_login),
        email: user.email,
        id: user.id,
      }));

      setUsersDetails(userDetails);
    } catch (error) {
      console.error("Error while retrieving user data:", error);
    }
  };
  useEffect(() => {
    fetchUserDetails();
  }, []);

  const [isProfileModalVisible, setProfileModalVisible] = useState(false);
  const [isBookingCancelled] = useState(false);

  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);

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

  const [selectedLink, setSelectedLink] = useState(null);

  // Funkcja konwertująca ciąg czasu do normalnego formatu
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

  const [isModalVisible, setIsModalVisible] = useState(false);

  // Function to process pressing the "Close" button
  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  //Edit user

  const [editedUserData, setEditedUserData] = useState({});

  const handleEditUserPress = (item) => {
    setEditedUserData(item);
    setIsModalVisible(true);
  };

  const handleSaveChanges = async () => {
    try {
      await editUser(editedUserData.id, editedUserData);

      setIsModalVisible(false);
      await fetchUserDetails(0, 0);
    } catch (error) {
      console.error("Error during user update:", error);
    }
  };

  //DeactivateUser

  const [isDeactivateUser, setIsDeactivateUser] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleDeactivateUserPress = (userId) => {
    setSelectedUserId(userId);
    setIsDeactivateUser(true);
  };

  const handleDeactivateConfirmation = async () => {
    try {
      await deactivateUser(selectedUserId);
      setIsDeactivateUser(false);
      await fetchUserDetails(0, 0);
    } catch (error) {
      console.error("Error during user deactivation:", error);
    }
  };

  //Delete user

  const [isDeleteUser, setIsDeleteUser] = useState(false);

  const handleDeleteUserPress = (userId) => {
    setSelectedUserId(userId);
    setIsDeleteUser(true);
  };

  const handleDeleteConfirmation = async () => {
    try {
      await removeUser(selectedUserId);
      setIsDeleteUser(false);
      await fetchUserDetails(0, 0);
      setSelectedGroup(null);
      setGroupPermissions([]);
      setShowGroupList(true);
    } catch (error) {
      console.error("Error when deleting a user:", error);
    }
  };

  // Permissions user

  const [isModalVisiblePermissionUser, setIsModalVisiblePermissionUser] =
    useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userGroupPermissions, setUserGroupPermissions] = useState([]);
  const [userPermissions, setUserPermissions] = useState([]);

  useEffect(() => {
    if (selectedUser && selectedUser.id) {
      fetchUserPermissions(selectedUser.id);
    }
  }, [selectedUser]);

  const fetchUserPermissions = async (selectedUserId) => {
    try {
      const groupPermissions = await getUserPermissions(selectedUserId, false);
      const permissions = await getUserPermissions(selectedUserId, true);

      setUserGroupPermissions(groupPermissions);
      setUserPermissions(permissions);
    } catch (error) {
      console.error("Error fetching user permissions:", error);
    }
  };

  const handleCategorySelect = (user) => {
    setSelectedUser(user); // Ustawianie wybranego użytkownika
    setIsModalVisiblePermissionUser(true);
  };

  const handleModalClosePermissions = () => {
    setIsModalVisiblePermissionUser(false);
  };

  const [selectedUserItem, setSelectedUserItem] = useState(null);

  const handleItemUserPress = (item) => {
    setSelectedUserItem(item);
  };

  const renderItemRemoveUser = ({ item }) => (
    <TouchableOpacity onPress={() => handleItemUserPress(item)}>
      <Text
        style={[
          styles.itemText,
          item === selectedUserItem && styles.selectedUserItem,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderItemUser = ({ item }) => (
    <TouchableOpacity onPress={() => handleItemUserPress(item)}>
      <Text
        style={[
          styles.itemText,
          item === selectedUserItem && styles.selectedUserItem,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  //Add user permissions

  const handleLeftArrowUserPress = async () => {
    try {
      if (!selectedUser || !selectedUserItem) return;

      const { codename } = selectedUserItem;

      await addPermissionToUser(selectedUser.id, codename);

      await fetchUserPermissions(selectedUser.id);
      setSelectedUserItem(null);
    } catch (error) {
      console.error("Error adding permission to user:", error);
    }
  };

  //Remove user permissions

  const handleRightArrowUserPress = async () => {
    try {
      if (!selectedUser || !selectedUserItem) return;

      const { codename } = selectedUserItem;

      await removePermissionFromUser(selectedUser.id, codename);

      await fetchUserPermissions(selectedUser.id);

      setSelectedUserItem(null);
    } catch (error) {
      console.error("Error removing permission from group:", error);
    }
  };

  // UserGroup

  const fetchGroupUsers = async (groupId, isInGroup) => {
    try {
      const usersData = await getUserGroup(groupId, isInGroup);
      return usersData;
    } catch (error) {
      console.error(
        `Error fetching users in group: ${groupId}, isInGroup: ${isInGroup}`,
        error
      );
      return [];
    }
  };

  const handleItemPressUserGroup = (item) => {
    setSelectedItemUserGroup(item);
  };

  const [selectedItemUserGroup, setSelectedItemUserGroup] = useState(null);

  const renderItemRemoveUserGroup = ({ item }) => (
    <TouchableOpacity onPress={() => handleItemPressUserGroup(item)}>
      <Text
        style={[
          styles.itemText,
          item === selectedItemUserGroup && styles.selectedItem,
        ]}
      >
        {item.username}
      </Text>
    </TouchableOpacity>
  );

  const renderItemUserGroup = ({ item }) => (
    <TouchableOpacity onPress={() => handleItemPressUserGroup(item)}>
      <Text
        style={[
          styles.itemText,
          item === selectedItemUserGroup && styles.selectedItem,
        ]}
      >
        {item.username}
      </Text>
    </TouchableOpacity>
  );

  const handleRightArrowPressUserGroup = async () => {
    try {
      if (!selectedGroup || !selectedItemUserGroup || !selectedItemUserGroup.id)
        return;

      const { id: userId } = selectedItemUserGroup;

      await RemoveUserFromGroup(userId, groupId); // Usunięcie użytkownika z grupy

      // Aktualizacja listy użytkowników w grupie
      const updatedGroupUsersInGroup = await fetchGroupUsers(groupId, true);
      setGroupUsersInGroup(updatedGroupUsersInGroup);

      // Aktualizacja listy użytkowników spoza grupy
      const updatedGroupUsersNotInGroup = await fetchGroupUsers(groupId, false);
      setGroupUsersNotInGroup(updatedGroupUsersNotInGroup);

      setSelectedItemUserGroup(null);
    } catch (error) {
      console.error("Error removing user from group:", error);
    }
  };

  const handleLeftArrowPressUserGroup = async () => {
    try {
      if (!selectedGroup || !selectedItemUserGroup || !selectedItemUserGroup.id)
        return;

      const { id: userId } = selectedItemUserGroup;

      await AddUserToGroup(userId, groupId);

      const updatedGroupUsersInGroup = await fetchGroupUsers(groupId, true);
      setGroupUsersInGroup(updatedGroupUsersInGroup);

      const updatedGroupUsersNotInGroup = await fetchGroupUsers(groupId, false);
      setGroupUsersNotInGroup(updatedGroupUsersNotInGroup);

      setSelectedItemUserGroup(null);
    } catch (error) {
      console.error("Error adding user to group:", error);
    }
  };

  // Groups
  const [isModalVisiblePermission, setIsModalVisiblePermission] =
    useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupPermissions, setGroupPermissions] = useState([]);
  const [allPermissions, setAllPermissions] = useState([]);
  const [showGroupList, setShowGroupList] = useState(true);
  const [permissions, setPermissions] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [groupId, setGroupId] = useState(null);

  const [groupUsersPermissions, setGroupUsersInGroup] = useState([]);
  const [groupUsersNotPermissions, setGroupUsersNotInGroup] = useState([]);

  const handleGroupPress = async (group) => {
    setSelectedGroupId(group.id);
    setSelectedGroup(group);
    setGroupId(group.id);
    const permissionsData = await getGroupPermissionsModal(group.id, false);
    setGroupPermissions(permissionsData);
    const modalPermissionsData = await getGroupPermissionsModal(group.id, true);
    setPermissions(modalPermissionsData);

    // Pobieranie użytkowników w grupie
    const groupUsersInGroup = await fetchGroupUsers(group.id, true);
    setGroupUsersInGroup(groupUsersInGroup);

    // Pobieranie użytkowników spoza grupy i zapisywanie ich w osobnym stanie
    const groupUsersNotInGroup = await fetchGroupUsers(group.id, false);
    setGroupUsersNotInGroup(groupUsersNotInGroup);

    setIsModalVisiblePermission(true);
    setShowGroupList(false);
  };

  const handleBackPress = () => {
    setSelectedGroup(null);
    setGroupPermissions([]);
    setShowGroupList(true);
  };

  const handleModalClosePermission = () => {
    setIsModalVisiblePermission(false);
    setSelectedGroup(null);
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const permissionsData = await getGroupPermissions(0, 0);

      setAllPermissions(permissionsData);
    } catch (error) {
      console.error("Error fetching permissions:", error);
    }
  };

  const handleRightArrowPress = async () => {
    try {
      if (!selectedGroup || !selectedItem || !groupId) return;

      const { codename } = selectedItem;

      await removePermissionFromGroup(groupId, codename);

      const updatedPermissionsData = await getGroupPermissionsModal(
        groupId,
        true
      );
      setPermissions(updatedPermissionsData);

      const updatedGroupPermissionsData = await getGroupPermissionsModal(
        groupId,
        false
      );
      setGroupPermissions(updatedGroupPermissionsData);

      setSelectedItem(null);
    } catch (error) {
      console.error("Error removing permission from group:", error);
    }
  };

  const handleLeftArrowPress = async () => {
    try {
      if (!selectedGroup || !selectedItem) return;

      const { codename } = selectedItem;

      await addPermissionToGroup(groupId, codename);

      const updatedPermissionsData = await getGroupPermissionsModal(
        groupId,
        true
      );
      setPermissions(updatedPermissionsData);

      const updatedGroupPermissionsData = await getGroupPermissionsModal(
        groupId,
        false
      );
      setGroupPermissions(updatedGroupPermissionsData);

      setSelectedItem(null);
    } catch (error) {
      console.error("Error adding permission to group:", error);
    }
  };

  const handleItemPress = (item) => {
    setSelectedItem(item);
  };

  const renderItemRemove = ({ item }) => (
    <TouchableOpacity onPress={() => handleItemPress(item)}>
      <Text
        style={[styles.itemText, item === selectedItem && styles.selectedItem]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleItemPress(item)}>
      <Text
        style={[styles.itemText, item === selectedItem && styles.selectedItem]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  //Add group

  const [isModalVisibleGroup, setIsModalVisibleGroup] = useState(false);

  const [groupName, setGroupName] = useState("");

  const handleModalAddGroupPermission = () => {
    setIsModalVisibleGroup(true);
  };

  const handleModalGroupClose = () => {
    setIsModalVisibleGroup(false);
  };

  const handleAddGroup = async () => {
    try {
      await addGroup(groupName);
      console.log("Adding group:", groupName);

      setIsModalVisibleGroup(false);
      setGroupName("");
      await fetchPermissions(0, 0);
    } catch (error) {
      console.error("Error adding group:", error);
    }
  };

  // Delete group
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  const [isDeleteGroupModalVisible, setIsDeleteGroupModalVisible] =
    useState(false);

  const handleDeleteGroupPress = () => {
    setIsDeleteGroupModalVisible(true);
  };

  const toggleDeleteGroupModal = () => {
    setIsDeleteGroupModalVisible(false);
  };

  const handleDeleteGroupConfirmed = async () => {
    try {
      if (!selectedGroupId) return;
      await deleteGroup(selectedGroupId);

      setIsDeleteGroupModalVisible(false);
      await fetchPermissions(0, 0); // Updating the list of groups
      setSelectedGroup(null); // Reset the selected group
      setGroupPermissions([]); // Reset group permissions
      setShowGroupList(true); // Display all groups
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };

  const handleShowPermissionsPress = () => {
    setIsModalVisiblePermission(true);
  };

  // User permission

  const [isModalVisibleUserPermission, setIsModalVisibleUserPermission] =
    useState(false);

  const closeModalUserPermission = () => {
    setIsModalVisibleUserPermission(false);
    setUserPermissions([]);
  };

  // User

  const [currentUser, setCurrentUser] = useState({ id: null, username: "" });

  const loadUserData = async () => {
    try {
      const userData = await getUserDetails();

      setCurrentUser(userData);
    } catch (error) {
      console.error("User data loading error:", error);
    }
  };
  useEffect(() => {
    loadUserData();
  }, []);

  // Add User

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isModalVisibleAddUser, setIsModalVisibleAddUser] = useState(false);

  const handleAddUserPress = () => {
    setIsModalVisibleAddUser(true);
  };

  const handleRegisterUser = async () => {
    try {
      await registerUser(username, password);
      setIsModalVisibleAddUser(false);
      await fetchUserDetails(0, 0);
    } catch (error) {
      console.error("Error while logging in:", error);
    }
  };

  // Get Users

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

  // Function for opening notifications

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
                users={users}
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
        <Text style={styles.additionalInfoText}>Employees</Text>

        {isMainOrdersVisible && (
          <>
            <View style={styles.addContainer}>
              <FlatList
                data={isUsersDetails}
                horizontal={true}
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
                                    source={require("./assets/user_profile.png")}
                                    style={
                                      styles.additionalInfoBoxSecondbackgroundImage
                                    }
                                  />
                                  <View
                                    style={styles.itionalInfoBoxSecondInfoText}
                                  >
                                    <Text style={styles.infoBoxSecondInfoText}>
                                      {item.first_name}&nbsp;{item.last_name}
                                    </Text>
                                    <Text
                                      style={styles.infoBoxSecondInfoTextSecond}
                                    >
                                      Username: {item.username}
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
                                    Phone
                                  </Text>
                                  <Text
                                    style={
                                      styles.infoBoxSecondInfoTextSecondRowTwo
                                    }
                                  >
                                    {item.phone_no}
                                  </Text>
                                </View>
                                <View>
                                  <Text
                                    style={styles.infoBoxSecondInfoTextRowTwo}
                                  >
                                    Hired Time
                                  </Text>
                                  <Text
                                    style={
                                      styles.infoBoxSecondInfoTextSecondRowTwo
                                    }
                                  >
                                    {item.hired_time}
                                  </Text>
                                </View>
                                {item.fired_time && (
                                  <View>
                                    <Text
                                      style={styles.infoBoxSecondInfoTextRowTwo}
                                    >
                                      Fired Time
                                    </Text>
                                    <Text
                                      style={
                                        styles.infoBoxSecondInfoTextSecondRowTwo
                                      }
                                    >
                                      {item.fired_time}
                                    </Text>
                                  </View>
                                )}
                              </View>
                              <View
                                style={styles.additionalInfoBoxSecondRowTwo}
                              >
                                <View>
                                  <Text
                                    style={styles.infoBoxSecondInfoTextRowTwo}
                                  >
                                    Last Login
                                  </Text>
                                  <Text
                                    style={
                                      styles.infoBoxSecondInfoTextSecondRowTwo
                                    }
                                  >
                                    {item.last_login}
                                  </Text>
                                </View>
                                <View>
                                  <Text
                                    style={styles.infoBoxSecondInfoTextRowTwo}
                                  >
                                    Email
                                  </Text>
                                  <Text
                                    style={
                                      styles.infoBoxSecondInfoTextSecondRowTwo
                                    }
                                  >
                                    {item.email}
                                  </Text>
                                </View>
                              </View>
                            </View>

                            <View style={styles.additionalInfoBoxEdit}>
                              <>
                                <TouchableOpacity
                                  onPress={() =>
                                    handleDeactivateUserPress(item.id)
                                  }
                                >
                                  <Text
                                    style={styles.additionalInfoBoxEditSecond}
                                  >
                                    Deactivate User
                                  </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() => handleEditUserPress(item)}
                                >
                                  <Text
                                    style={styles.additionalInfoBoxEditSecond}
                                  >
                                    Edit User
                                  </Text>
                                </TouchableOpacity>
                              </>
                            </View>
                            <View style={styles.additionalInfoBoxEditTwo}>
                              <>
                                <TouchableOpacity
                                  onPress={() => handleDeleteUserPress(item.id)}
                                >
                                  <Text
                                    style={styles.additionalInfoBoxEditSecond}
                                  >
                                    Delete User
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
                  onPress={handleAddUserPress}
                  style={styles.changeUserButtonTwo}
                >
                  <Text style={styles.changeUserButtonTextTwo}>
                    Dodaj Pracownika
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={handleShowPermissionsPress}
                  style={styles.changeUserButtonTwo}
                >
                  <Text style={styles.changeUserButtonTextTwo}>
                    Show Groups
                  </Text>
                </TouchableOpacity>
              </View>
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
        visible={isModalVisibleAddUser}
        onRequestClose={() => setIsModalVisibleAddUser(false)}
      >
        <View style={styles.modifyModalContainer}>
          <View style={styles.modifyModalContent}>
            <Text style={styles.modalTitle}>Add User</Text>
            <TextInput
              style={styles.modifyModalInput}
              placeholder="Usarname"
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              style={styles.modifyModalInput}
              placeholder="Password"
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={handleRegisterUser}
              style={styles.addButton}
            >
              <Text style={styles.modifyModalSaveButton}>Add User</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsModalVisibleAddUser(false)}
              style={styles.modifyModalCloseButton}
            >
              <Text style={styles.cancelButtonLabel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisibleUserPermission}
        onRequestClose={closeModalUserPermission}
      >
        <View style={styles.modalContainerPermissions}>
          <View style={styles.permissionsModalContent}>
            <View>
              <Text style={styles.modalTitle}>
                Permissions for {selectedUser?.first_name}{" "}
                {selectedUser?.last_name}
              </Text>
              <FlatList
                data={userPermissions}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.permissionsItemContainer}>
                    <Text style={styles.billText}>{item.name}</Text>
                  </View>
                )}
              />
              <TouchableOpacity
                onPress={closeModalUserPermission}
                style={styles.closeButtonBill}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisibleGroup}
        onRequestClose={handleModalGroupClose}
      >
        <View style={styles.modifyModalContainer}>
          <View style={styles.modifyModalContent}>
            <Text style={styles.modalTitle}>Add Group</Text>
            <TextInput
              style={styles.modifyModalInput}
              placeholder="Enter group name"
              value={groupName}
              onChangeText={setGroupName}
            />

            <TouchableOpacity onPress={handleAddGroup}>
              <Text style={styles.modifyModalSaveButton}>Add</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleModalGroupClose}>
              <Text style={styles.modifyModalCloseButton}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isDeleteGroupModalVisible}
        onRequestClose={toggleDeleteGroupModal}
      >
        <View style={styles.profileModalContainer}>
          <View style={styles.profileModalContent}>
            <Text style={styles.profileModalLink}>
              Are you sure you want to delete?
            </Text>
            <TouchableOpacity onPress={handleDeleteGroupConfirmed}>
              <Text style={styles.profileModalLink}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleDeleteGroupModal}>
              <Text style={styles.profileModalLink}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisiblePermission}
        onRequestClose={handleModalClosePermission}
      >
        <View style={styles.modalContainerPermissions}>
          <View style={styles.permissionsModalContent}>
            {selectedGroup && (
              <View style={styles.permissionsModalCenterlContent}>
                <Text style={styles.modalTitle}>{selectedGroup.name}</Text>
                <View style={styles.permissionsModalContentCenterTwo}>
                  <View style={styles.permissionsModalContentTwo}>
                    <Text style={styles.modalTitle}>Group Has</Text>
                    <FlatList
                      data={groupPermissions}
                      keyExtractor={(item) => item.id.toString()}
                      renderItem={renderItemRemove}
                    />
                  </View>
                  <View style={styles.arrows}>
                    <TouchableOpacity
                      onPress={handleLeftArrowPress}
                      style={styles.arrowButton}
                    >
                      <Text style={styles.arrowText}>←</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleRightArrowPress}
                      style={styles.arrowButton}
                    >
                      <Text style={styles.arrowText}>→</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.permissionsModalContentTwo}>
                    <Text style={styles.modalTitle}>Group Does Not Have</Text>
                    <FlatList
                      data={permissions}
                      keyExtractor={(item) => item.id.toString()}
                      renderItem={renderItem}
                    />
                  </View>
                </View>

                <Text style={styles.modalTitleUserGroup}>
                  Add User To Group
                </Text>
                <View style={styles.permissionsModalContentCenterTwo}>
                  <View style={styles.permissionsModalContentTwo}>
                    <Text style={styles.modalTitle}>Users in this group</Text>
                    <FlatList
                      data={groupUsersPermissions}
                      keyExtractor={(item) => item.id.toString()}
                      renderItem={renderItemRemoveUserGroup}
                    />
                  </View>
                  <View style={styles.arrows}>
                    <TouchableOpacity
                      onPress={handleLeftArrowPressUserGroup}
                      style={styles.arrowButton}
                    >
                      <Text style={styles.arrowText}>←</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleRightArrowPressUserGroup}
                      style={styles.arrowButton}
                    >
                      <Text style={styles.arrowText}>→</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.permissionsModalContentTwo}>
                    <Text style={styles.modalTitle}>
                      Users without this group
                    </Text>
                    <FlatList
                      data={groupUsersNotPermissions}
                      keyExtractor={(item) => item.id.toString()}
                      renderItem={renderItemUserGroup}
                    />
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => {
                    handleDeleteGroupPress();
                    handleModalClosePermission();
                  }}
                  style={styles.containergoBackButton}
                >
                  <Text style={styles.goBackButton}>Delete Group</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleBackPress}
                  style={styles.containergoBackButton}
                >
                  <Text style={styles.goBackButton}>Back</Text>
                </TouchableOpacity>
              </View>
            )}
            {showGroupList && (
              <>
                <Text style={styles.modalTitle}>Groups</Text>
                <FlatList
                  data={allPermissions}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleGroupPress(item)}>
                      <View style={styles.billItemContainer}>
                        <Text style={styles.billText}>{item.name}</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                />
                <View style={styles.modifyModalContentButtons}>
                  <TouchableOpacity
                    onPress={() => {
                      handleModalAddGroupPermission();
                      handleModalClosePermission();
                    }}
                  >
                    <Text style={styles.modifyModalSaveButton}>Add Group</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleModalClosePermission}>
                    <Text style={styles.modifyModalCloseButton}>Close</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisiblePermissionUser}
        onRequestClose={handleModalClosePermissions}
      >
        <View style={styles.modalContainerPermissions}>
          <View style={styles.permissionsModalContent}>
            <View>
              <View style={styles.permissionsModalCenterlContent}>
                <Text style={styles.modalTitle}>User Permissions</Text>
                <View style={styles.permissionsModalContentCenterTwo}>
                  <View style={styles.permissionsModalContentTwo}>
                    <Text style={styles.modalTitle}>User Permissions Have</Text>
                    <FlatList
                      data={userGroupPermissions}
                      keyExtractor={(item) => item.id.toString()}
                      renderItem={renderItemRemoveUser}
                    />
                  </View>
                  <View style={styles.arrows}>
                    <TouchableOpacity
                      onPress={handleLeftArrowUserPress}
                      style={styles.arrowButton}
                    >
                      <Text style={styles.arrowText}>←</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleRightArrowUserPress}
                      style={styles.arrowButton}
                    >
                      <Text style={styles.arrowText}>→</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.permissionsModalContentTwo}>
                    <Text style={styles.modalTitle}>
                      The User Does Not Have
                    </Text>
                    <FlatList
                      data={userPermissions}
                      keyExtractor={(item) => item.id.toString()}
                      renderItem={renderItemUser}
                    />
                  </View>
                </View>

                <TouchableOpacity onPress={handleModalClosePermissions}>
                  <Text style={styles.modifyModalCloseButton}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isDeleteUser}
        onRequestClose={() => setIsDeleteUser(false)}
      >
        <View style={styles.profileModalContainer}>
          <View style={styles.profileModalContent}>
            <Text style={styles.profileModalLink}>
              Are you sure you want to delete user?
            </Text>
            <TouchableOpacity onPress={handleDeleteConfirmation}>
              <Text style={styles.profileModalLink}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsDeleteUser(false)}>
              <Text style={styles.profileModalLink}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isDeactivateUser}
        onRequestClose={() => setIsDeactivateUser(false)}
      >
        <View style={styles.profileModalContainer}>
          <View style={styles.profileModalContent}>
            <Text style={styles.profileModalLink}>
              Are you sure you want to deactivate?
            </Text>
            <TouchableOpacity onPress={handleDeactivateConfirmation}>
              <Text style={styles.profileModalLink}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsDeactivateUser(false)}>
              <Text style={styles.profileModalLink}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modifyModalContainer}>
          <View style={styles.modifyModalContent}>
            <TextInput
              style={styles.modifyModalInput}
              placeholder="First Name"
              value={editedUserData.first_name || ""}
              onChangeText={(text) =>
                setEditedUserData({ ...editedUserData, first_name: text })
              }
            />
            <TextInput
              style={styles.modifyModalInput}
              placeholder="Last Name"
              value={editedUserData.last_name || ""}
              onChangeText={(text) =>
                setEditedUserData({ ...editedUserData, last_name: text })
              }
            />
            <TextInput
              style={styles.modifyModalInput}
              placeholder="username"
              value={editedUserData.username || ""}
              onChangeText={(text) =>
                setEditedUserData({ ...editedUserData, username: text })
              }
            />
            <TextInput
              style={styles.modifyModalInput}
              placeholder="Phone"
              value={editedUserData.phone_no || ""}
              onChangeText={(text) =>
                setEditedUserData({ ...editedUserData, phone_no: text })
              }
            />
            <TextInput
              style={styles.modifyModalInput}
              placeholder="Email"
              value={editedUserData.email || ""}
              onChangeText={(text) =>
                setEditedUserData({ ...editedUserData, email: text })
              }
            />
            <TextInput
              style={styles.modifyModalInput}
              placeholder="Password"
              value={editedUserData.password || ""}
              onChangeText={(text) =>
                setEditedUserData({ ...editedUserData, password: text })
              }
            />
            <TouchableOpacity onPress={handleSaveChanges}>
              <Text style={styles.modifyModalSaveButton}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleModalClose}>
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
    height: 328,
    backgroundColor: "#FA8E4D",
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
    maxWidth: 200,
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
    borderBottomWidth: 1,
    borderBottomColor: "#DC702F",
    paddingBottom: 15,
  },
  additionalInfoBoxEditTwo: {
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
  modalContainerPermissions: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    height: "40%",
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

  closeButtonTextAddGroup: {
    marginTop: 20,

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
  permissionsItemContainer: {
    flexDirection: "row",
    maxHeight: "50%",
  },
  permissionsItemContainerGroups: {},

  permissionsModalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "40%",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  permissionsModalContentCenterTwo: {
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
    gap: 30,
  },
  permissionsModalContentTwo: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    height: 300,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  permissionsModalCenterlContent: {
    alignItems: "center",
  },

  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: "bold",
  },

  modalTitleUserGroup: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: "bold",
    marginTop: 15,
  },

  arrows: {
    flexDirection: "column",
    justifyContent: "center",
    marginTop: 10,
    gap: 20,
  },
  arrowButton: {
    backgroundColor: "lightgray",
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  arrowText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  selectedItem: {
    backgroundColor: "#FA8E4D",
    fontWeight: "bold",
    color: "white",
    width: "100%",
  },

  selectedUserItem: {
    backgroundColor: "#FA8E4D",
    fontWeight: "bold",
    color: "white",
    width: "100%",
  },

  modifyModalContentButtons: {
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Management;
