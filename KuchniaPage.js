import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PermissionsModal from './PermissionsModal';
import UserSelectionModal from './UserSelectionModal';
import MessagesNotification from './MessagesNotification';


const KuchniaPage = () => {
  const navigation = useNavigation();
  const [selectedLink, setSelectedLink] = useState(null);
  const [isTooltipVisible, setTooltipVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isProfileModalVisible, setProfileModalVisible] = useState(false);
  const [isBookingCancelled, setBookingCancelled] = useState(false);
  const [isModifyModalVisible, setModifyModalVisible] = useState(false);
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);
  
  const [isUserSelectionModalVisible, setUserSelectionModalVisible] = useState(false);
  const [isAddOrderModalVisible, setAddOrderModalVisible] = useState(false);

  const [isMessagesNotificationVisible, setMessagesNotificationVisible] = useState(false);

  const [selectedOrderForModification, setSelectedOrderForModification] = useState(null);




  // Добавьте функцию открытия уведомлений
  const handleOpenMessagesNotification = () => {
    setMessagesNotificationVisible(true);
  };

  // Добавьте функцию выбора пользователя из уведомлений
  const handleSelectUserFromNotification = (userId) => {
    // Ваш код для обработки выбранного пользователя
    // Например, перейти на экран чата с этим пользователем
    console.log('Selected user ID:', userId);
  };
  
  
  
  const handleModifyPress = (orderId) => {
    const selectedOrder = orders.find((order) => order.id === orderId);
    if (selectedOrder) {
      setSelectedOrderForModification(selectedOrder);
      setMealDetails({
        name: selectedOrder.name,
        order: selectedOrder.order,
        table: selectedOrder.table,
        time: selectedOrder.time,
        amount: selectedOrder.amount,
        waiter: selectedOrder.waiter,
      });
      setModifyModalVisible(true);
    }
  };
  
  
  const handleSaveChanges = () => {
    // Update the selected order with new details
    setOrders((prevOrders) => {
      return prevOrders.map((order) => {
        if (order.id === selectedOrderForModification.id) {
          return {
            ...order,
            name: mealDetails.name,
            order: mealDetails.order,
            table: mealDetails.table,
            time: mealDetails.time,
            amount: mealDetails.amount,
            waiter: mealDetails.waiter,
          };
        }
        return order;
      });
    });
  
    // Reset selected order and meal details
    setSelectedOrderForModification(null);
    setMealDetails(initialMealDetails);
    setModifyModalVisible(false);
  };
  
  const [mealDetails, setMealDetails] = useState({
    name: '',
    order: '',
    table: '',
    time: '',
    amount: '',
    waiter: '',
  });  
  
  
  const handleUserSelectionModalClose = () => {
    // Обработчик закрытия модального окна выбора пользователя

    setModalVisible(false);  // Закрываем модальное окно
  };

  const [notifications, setNotifications] = useState([
    {
      Notification_no: 1,
      notification: 'Przykład',
      status: 0,
    },
  ]);
  const [isNotificationModalVisible, setNotificationModalVisible] = useState(false);
  
  const handleChangeUser = () => {
    setUserSelectionModalVisible(true); // Изменено с setPermissionsModalVisible(true) на setUserSelectionModalVisible(true)
  };
  
  const handleUserSelection = (userId) => {
  setSelectedUserId(userId);
  setUserSelectionModalVisible(false);  // Закрываем модальное окно выбора пользователя

  // Вместо setPermissionsModalVisible(true) вызываем навигацию на LoginPage
  navigation.navigate('LoginPage');
};

const [editingOrderId, setEditingOrderId] = useState(null);


  
  const [isPermissionsModalVisible, setPermissionsModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null); // Set the user ID for fetching permissions
  const [currentUser, setCurrentUser] = useState('Anna Nowak');

  

  const [users, setUsers] = useState([
    { id: 1, name: 'Imie Nazwisko', status: 'Meneger' },
    { id: 2, name: 'Imie Nazwisko2', status: 'Kelner' },
    // Добавьте других пользователей по аналогии
  ]);

//  const handleChangeUser = () => {
//    setModalVisible(true);
//  };

const handleAddOrderPress = () => {
  setAddOrderModalVisible(true);
};

const handleModalClose = () => {
  setAddOrderModalVisible(false);
};




const [orders, setOrders] = useState([]);


  
  const [selectedUser, setSelectedUser] = useState(null);

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
      const response = await fetch('http://localhost:8000/kfp/Notifications', {
        method: 'GET',
      });

      const data = await response.json();

      if (data.message === 'Brak powiadomień') {
        setNotifications([]);
      } else {
        setNotifications(data);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
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

  const handleLogoutConfirmed = () => {
    console.log('User logged out');
    toggleLogoutModal();
    navigation.navigate('LoginPage');
  };
  const initialMealDetails = {
    name: '',
    order: '',
    table: '',
    time: '',
    amount: '',
    waiter: '',
  };
  
 

  const toggleModifyModal = () => {
    setModifyModalVisible(!isModifyModalVisible);
  };

  const handleCancelBookingPress = (orderId) => {
    // Фильтруем заказы, исключая отмененный заказ
    const updatedOrders = orders.filter(order => order.id !== orderId);
  
    // Устанавливаем новый массив заказов без отмененного заказа
    setOrders(updatedOrders);
  };
  



  const [orderDetails, setOrderDetails] = useState({
    name: '',
    order: '',
    table: '',
    time: '',
    amount: '',
    waiter: '',
  });




  const handleLinkPress = (screenName) => {
    navigation.navigate(screenName);
    setSelectedLink(screenName);
  };



  const handleAddOrder = () => {
    const newOrder = {
      id: orders.length + 1, // Генерируйте уникальный идентификатор (замените это своей логикой)
      name: orderDetails.name,
      order: orderDetails.order,
      table: orderDetails.table,
      amount: orderDetails.amount,
      time: orderDetails.time,

      
      // Добавьте любые другие данные, которые вам необходимо сохранить
    };
  
    setOrders((prevOrders) => [...prevOrders, newOrder]);
    setAddOrderModalVisible(false);
  };
  

  const handleInputChange = (field, value) => {
    setOrderDetails((prevDetails) => ({ ...prevDetails, [field]: value }));
  };

  const toggleProfileModal = () => {
    setProfileModalVisible(!isProfileModalVisible);
  };

 
  

  return (
    <View style={styles.container}>
      <Image source={require('./assets/background-image_2.png')} style={styles.backgroundImage} />
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Image source={require('./assets/logo.png')} style={styles.logo} />
          <View style={styles.headerTextContainer}>
            <TouchableOpacity onPress={() => handleLinkPress('KuchniaPage')}>
              <Text style={[styles.headerLink, selectedLink === 'KuchniaPage' && styles.selectedLink]}>Zamówienia</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleLinkPress('Kuchnia')}>
              <Text style={[styles.headerLink, selectedLink === 'Kuchnia' && styles.selectedLink]}>Kuchnia</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleLinkPress('ZarzadzaniePage')}>
              <Text style={[styles.headerLink, selectedLink === 'ZarzadzaniePage' && styles.selectedLink]}>Zarządzanie</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleLinkPress('Restauracja')}>
              <Text style={[styles.headerLink, selectedLink === 'Restauracja' && styles.selectedLink]}>Restauracja</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleLinkPress('Kategorie')}>
              <Text style={[styles.headerLink, selectedLink === 'Kategorie' && styles.selectedLink]}>Kategorie</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleOpenMessagesNotification}>
              <Image source={require('./assets/call.png')} style={styles.icon} />
              <MessagesNotification
                isVisible={isMessagesNotificationVisible}
                onClose={() => setMessagesNotificationVisible(false)}
                users={users} // передайте список пользователей
                onUserSelect={handleSelectUserFromNotification}
            />
            </TouchableOpacity>

            <TouchableOpacity onPress={toggleProfileModal}>
            
              <Image source={require('./assets/user_profile.png')} style={styles.profileImage} />
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
                  <View key={notification.Notification_no} style={styles.notificationItem}>
                    <Text style={styles.notificationText}>{notification.notification}</Text>
                  </View>
                ))}
                <TouchableOpacity onPress={() => setNotificationModalVisible(false)}>
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
        <Text style={styles.userInfoText}>Użytkownik: {currentUser}</Text>
        <TouchableOpacity onPress={handleChangeUser} style={styles.changeUserButton}>
          <Text style={styles.changeUserButtonText}>Zmień użytkownika</Text>
        </TouchableOpacity>

        <PermissionsModal
          isVisible={isPermissionsModalVisible}
          onClose={() => setPermissionsModalVisible(false)}
          userId={selectedUserId}
        />
      </View>
      </View>
      <View style={styles.contentContainer}>
      <Text style={styles.additionalInfoText}>Zamówienia</Text>
      <View style={styles.addContainer}>

      



      {orders.map((order) => (
    <View key={order.id} style={styles.addBasicInfoContainer}>
      <View style={styles.additionalInfoContainer}>
        {!isBookingCancelled && (
          <View style={styles.InfoBox}>
            <View style={styles.additionalInfoBox}>
              <View style={styles.additionalInfoBoxSecond}>
                <View style={styles.itionalInfoBoxSecondInfo}>
                  <Image
                    source={require('./assets/user_profile.png')}
                    style={styles.additionalInfoBoxSecondbackgroundImage}
                  />
                  <View style={styles.itionalInfoBoxSecondInfoText}>
                    <Text style={styles.infoBoxSecondInfoText}>{order.name}</Text>
                    <Text style={styles.infoBoxSecondInfoTextSecond}>{order.order}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setTooltipVisible(true)}
                    onPressOut={() => setTooltipVisible(false)}
                  >
                    <Image
                      source={require('./assets/expectation.png')}
                      style={styles.additionalInfoBoxSecondImage}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.additionalInfoBoxSecondRowTwo}>
                  <View>
                    <Text style={styles.infoBoxSecondInfoTextRowTwo}>Stolik</Text>
                    <Text style={styles.infoBoxSecondInfoTextSecondRowTwo}>{order.table}</Text>
                  </View>
                  <View>
                    <Text style={styles.infoBoxSecondInfoTextRowTwo}>Time</Text>
                    <Text style={styles.infoBoxSecondInfoTextSecondRowTwo}>{order.time}</Text>
                  </View>
                </View>
                <View style={styles.additionalInfoBoxSecondRowTwo}>
                  <View>
                    <Text style={styles.infoBoxSecondInfoTextRowTwo}>Kwota</Text>
                    <Text style={styles.infoBoxSecondInfoTextSecondRowTwo}>{order.amount}</Text>
                  </View>
                  <View>
                    <Text style={styles.infoBoxSecondInfoTextRowTwo}>Kelner</Text>
                    <Text style={styles.infoBoxSecondInfoTextSecondRowTwo}>{currentUser}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.additionalInfoBoxEdit}>
                <>
                  <TouchableOpacity onPress={() => handleCancelBookingPress(order.id)}>
                    <Text style={styles.additionalInfoBoxEditSecond}>Cancel Booking</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleModifyPress(order.id)}>
                    <Text style={styles.additionalInfoBoxEditSecond}>Modify</Text>
                  </TouchableOpacity>
                </>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  ))}

</View>
</View>

      <Modal
  animationType="slide"
  transparent={true}
  visible={isUserSelectionModalVisible}
  onRequestClose={() => setUserSelectionModalVisible(false)}
>
  <UserSelectionModal
    isVisible={isUserSelectionModalVisible}
    onClose={() => setUserSelectionModalVisible(false)}  // Передать функцию для закрытия модального окна
    users={users}
    onSelectUser={handleUserSelection}
    setPermissionsModalVisible={setPermissionsModalVisible}
  />
</Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isPermissionsModalVisible}
        onRequestClose={handlePermissionsModalClose}
      >
        <PermissionsModal
          isVisible={isPermissionsModalVisible}
          onClose={handlePermissionsModalClose}
          userId={selectedUserId}
        />
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
  placeholder="Nowe danie"
  value={mealDetails.name}
  onChangeText={(text) => setMealDetails({ ...mealDetails, name: text })}
/>
<TextInput
  style={styles.modifyModalInput}
  placeholder="Nowy opis dania"
  value={mealDetails.order}
  onChangeText={(text) => setMealDetails({ ...mealDetails, order: text })}
/>
<TextInput
  style={styles.modifyModalInput}
  placeholder="Nowy stolik"
  value={mealDetails.table}
  onChangeText={(text) => setMealDetails({ ...mealDetails, table: text })}
/>
<TextInput
  style={styles.modifyModalInput}
  placeholder="Nowy czas"
  value={mealDetails.time}
  onChangeText={(text) => setMealDetails({ ...mealDetails, time: text })}
/>
<TextInput
  style={styles.modifyModalInput}
  placeholder="Nowa kwota"
  value={mealDetails.amount}
  onChangeText={(text) => setMealDetails({ ...mealDetails, amount: text })}
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
            <Text style={styles.profileModalLink}>Are you sure you want to log out?</Text>
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
        visible={isTooltipVisible}
        onRequestClose={() => setTooltipVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Status</Text>
            <Text style={styles.modalTextTwo}>Krewetki</Text>
            <Text style={styles.modalTextTree}>UWAGI, ALERGENY</Text>
            <TouchableOpacity onPress={() => setTooltipVisible(false)}>
              <Text style={styles.modalCloseButton}>Close</Text>
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
            <Text style={styles.modalText}>Dodaj Nowe Zamówienie</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Nazwa"
              value={orderDetails.name}
              onChangeText={(text) => handleInputChange('name', text)}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Opis"
              value={orderDetails.order}
              onChangeText={(text) => handleInputChange('order', text)}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Czas"
              value={orderDetails.time}
              onChangeText={(text) => handleInputChange('time', text)}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Stolik"
              value={orderDetails.table}
              onChangeText={(text) => handleInputChange('table', text)}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Kwota"
              value={orderDetails.amount}
              onChangeText={(text) => handleInputChange('amount', text)}
            />

      <TouchableOpacity onPress={handleAddOrder}>
        <Text style={styles.modalAddOrderButton}>Dodaj Zamówienie</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleModalClose}>
        <Text style={styles.modalCloseButton}>Close</Text>
      </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleAddOrderPress} style={styles.changeUserButtonTwo}>
          <Text style={styles.changeUserButtonTextTwo}>Dodaj nowe zamówienie</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width:'100%',
    height:'100%',
    alignItems: 'center',
  },
  backgroundImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    position: 'absolute',
  },

  header: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    width: '100%',
  },
  contentContainer: {
    width: '70%',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 30,
  },
 
  headerTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    fontWeight: 'lighter',
  },
  headerLink: {
    marginHorizontal: 5,
    color: '#FFF',
    marginRight: 20,
    textDecorationLine: 'none',
  },
  selectedLink: {
    textDecorationLine: 'underline',
  },
  icon: {
    width: 20,
    height: 20,
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
    justifyContent: 'flex-start',
  },
  userInfoText: {
    fontSize: 16,
    marginLeft: 10,
    marginBottom: 10,
    fontSize: 24,
    color: '#FFF',
  },
  changeUserButtonTwo:{
    borderColor:'#000',
    borderRadius: 10,
    paddingVertical: 10,
    marginLeft: 10,
    width: 260,
    borderWidth: 2,

  },

  changeUserButtonTextTwo:{
    color: '#212121',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',

  },

  changeUserButton: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingVertical: 10,
    marginLeft: 10,
    width: 330,
  },
  changeUserButtonText: {
    color: '#000618',
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    width: 330,
    height: 35,
  },

  addBasicInfoContainer: {

    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginRight:400,
    marginTop: 10,

  },
  skrollBasicInfoContainer: {

    flexDirection: 'row',
    justifyContent: 'flex-start',

  },

  additionalInfoContainer: {
    

    alignItems: 'flex-start',

  },
  additionalInfoText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'light',
    paddingTop:80,

  },
  additionalInfoBox: {
    width: 393,
    height: 279,
    backgroundColor: '#FA8E4D',
    marginTop: 20,
    borderRadius:10,
    position: 'absolute',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowColor: '#000',
  },

  additionalInfoBoxSecond:{

    width: 393,
    height: 230,
    backgroundColor: '#FFF',
    borderRadius:10,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowColor: '#000',
    padding:14,

  },
  itionalInfoBoxSecondInfo:{
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    
  },

  additionalInfoBoxSecondbackgroundImage:{
    width: 65,
    height: 65,

  },

  additionalInfoBoxSecondImage:{
    width: 20,
    height: 20,
  },
  infoBoxSecondInfoText:{
    fontSize:18,
    fontWeight: 'light',
    color: '#000618',

  },
  infoBoxSecondInfoTextSecond:{
    fontSize:14,
    fontWeight: 'light',
    color: '#646567',

  },
  additionalInfoBoxSecondRowTwo:{
    marginTop:20,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  infoBoxSecondInfoTextRowTwo:{
    fontSize:15,
    fontWeight: 'light',
    color: '#575757',
  },
  infoBoxSecondInfoTextSecondRowTwo:{
    fontSize:15,
    fontWeight: 'normal',
    color: '#000618',
  },

  additionalInfoBoxEdit:{
    marginTop:15,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },

  additionalInfoBoxEditSecond:{
    fontSize:15,
    fontWeight: 'light',
    color: '#FFF',
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 360,
  },

  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalTextTwo: {
    fontSize: 16,
    fontWeight: 'normal',
    marginBottom: 5,
  },

  modalTextTree: {
    fontSize: 12,
    fontWeight: 'normal',
    marginBottom: 10,
  },
  
  modalCloseButton: {
    color: 'blue',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    width: '60%', // Увеличил ширину до 80%
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
  modalAddOrderButton: {
    backgroundColor: '#FA8E4D',
    color: '#fff',
    fontSize: 16,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  modalCloseButton: {
    color: 'blue',
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  profileModalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  profileModalLink: {
    fontSize: 16,
    fontWeight: 'light',
    marginBottom: 10,
    color: 'black', // Цвет ссылок (можете настроить под ваш дизайн)
  },
  profileModalCloseButton: {
    color: 'blue',
    fontSize: 16,
    marginTop: 10,
  },
  notificationModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  notificationModalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    width: '60%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  notificationModalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  notificationItem: {
    marginTop: 10,
  },
  notificationText: {
    fontSize: 16,
  },
  notificationModalCloseButton: {
    color: 'blue',
    fontSize: 16,
    marginTop: 10,
  },
  modifyModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modifyModalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modifyModalInput: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
  modifyModalSaveButton: {
    backgroundColor: '#FA8E4D',
    color: '#fff',
    fontSize: 16,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  modifyModalCloseButton: {
    color: 'blue',
    fontSize: 16,
  },
  addContainer:{
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  }
});

export default KuchniaPage;
