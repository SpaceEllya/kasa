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
  Picker,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Kuchnia = () => {
  const navigation = useNavigation();
  const [selectedLink, setSelectedLink] = useState(null);
  const [isTooltipVisible, setTooltipVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isProfileModalVisible, setProfileModalVisible] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filter, setFilter] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);

  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);

  const toggleLogoutModal = () => {
    setLogoutModalVisible(!isLogoutModalVisible);
  };

  const handleLogout = () => {
    toggleLogoutModal();
  };

  const handleLogoutConfirmed = () => {
    console.log('User logged out');
    toggleLogoutModal();
  };

  const handleSortOrderChange = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const getSortedAndFilteredOrders = () => {
    const lowercasedFilter = filter.toLowerCase();
    const filteredOrders = orders.filter((order) =>
      order.numerZamowienia.toLowerCase().includes(lowercasedFilter) ||
      order.nazwaDania.toLowerCase().includes(lowercasedFilter) ||
      order.uwagi.toLowerCase().includes(lowercasedFilter) ||
      order.oczekiwanie.toLowerCase().includes(lowercasedFilter) ||
      order.time.toLowerCase().includes(lowercasedFilter)
    );

    filteredOrders.sort((a, b) => {
      const aValue = (a[selectedCategory] || '').toLowerCase();
      const bValue = (b[selectedCategory] || '').toLowerCase();

      return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });

    return filteredOrders;
  };

  const toggleProfileModal = () => {
    setProfileModalVisible(!isProfileModalVisible);
  };

  const [orderDetails, setOrderDetails] = useState({
    table: '',
    amount: '',
    time: '',
    order: '',
  });

  const handleCancelBookingPress = () => {
    console.log('Cancel Booking pressed...');
  };

  const handleStatusChange = (orderIndex) => {
    // Implement the logic to change the status here
    console.log('Changing status for order at index:', orderIndex);
  };

  const [orders, setOrders] = useState([
    {
      numerZamowienia: '1',
      nazwaDania: 'Danie 1',
      uwagi: '-',
      oczekiwanie: 'Nadal przygotowywane',
      time: '15:01',
    },
    {
      numerZamowienia: '2',
      nazwaDania: 'Danie 2',
      uwagi: 'Z ostrą papryką',
      oczekiwanie: 'Gotowe',
      time: '14:00',
    },
    // Add more orders as needed
  ]);

  useEffect(() => {
    setFilteredOrders(getSortedAndFilteredOrders());
  }, [filter, selectedCategory, sortOrder]);

  const handleChangeUser = () => {
    console.log('Changing user...');
  };

  const handleLinkPress = (screenName) => {
    navigation.navigate(screenName);
    setSelectedLink(screenName);
  };

  const handleAddOrderPress = () => {
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleAddOrder = () => {
    console.log('Adding new order:', orderDetails);
    setModalVisible(false);
  };

  const handleInputChange = (field, value) => {
    setOrderDetails((prevDetails) => ({ ...prevDetails, [field]: value }));
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
            <Image source={require('./assets/call.png')} style={styles.icon} />
            <TouchableOpacity onPress={toggleProfileModal}>
              <Image source={require('./assets/user_profile.png')} style={styles.profileImage} />
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
                <TouchableOpacity onPress={() => handleLinkPress('Profile')}>
                  <Text style={styles.profileModalLink}>Profile</Text>
                </TouchableOpacity>
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
                <View style={styles.itionalInfoBoxSecondInfo}>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Szukać"
                    value={filter}
                    onChangeText={(text) => setFilter(text)}
                  />

                  <View style={styles.additionalInfoBoxEdit}>
                    <Picker
                      selectedValue={selectedCategory}
                      onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                      style={styles.pickerStyle}
                    >
                      <Picker.Item label="Filtr" value="" />
                      <Picker.Item label="Numer zamówienia" value="numerZamowienia" />
                      <Picker.Item label="Nazwa dania" value="nazwaDania" />
                      <Picker.Item label="Uwagi" value="uwagi" />
                      <Picker.Item label="Oczekiwanie" value="oczekiwanie" />
                      <Picker.Item label="Czas" value="time" />
                    </Picker>
                    <TouchableOpacity onPress={handleSortOrderChange} style={styles.sortOrderButton}>
                      <Text>{sortOrder === 'asc' ? '↓' : '↑'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <FlatList
                  data={filteredOrders}
                  keyExtractor={(item) => item.numerZamowienia.toString()}
                  renderItem={({ item, index }) => (
                    <View style={styles.orderItem}>
                      <Text style={styles.orderText}>{`Numer zamówienia: ${item.numerZamowienia}`}</Text>
                      <Text style={styles.orderText}>{`Nazwa dania: ${item.nazwaDania}`}</Text>
                      <Text style={styles.orderText}>{`Uwagi: ${item.uwagi}`}</Text>
                      <Text style={styles.orderText}>{`Oczekiwanie: ${item.oczekiwanie}`}</Text>
                      <Text style={styles.orderText}>{`Czas: ${item.time}`}</Text>

                      <TouchableOpacity onPress={() => handleStatusChange(index)} style={styles.statusChangeButton}>
                        <Text>Zmień status</Text>
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
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    alignItems: 'center',
  },
  backgroundImage: {
    width: '100%',
    height: 60,
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
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
    marginBottom: 10,
  },
  changeUserButtonTwo: {
    borderColor: '#000',
    borderRadius: 10,
    paddingVertical: 10,
    marginLeft: 10,
    width: 260,
    borderWidth: 2,
  },
  changeUserButtonTextTwo: {
    color: '#212121',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  additionalInfoContainer: {
    width: '100%',
    marginTop: 20,
  },
  additionalInfoText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'light',
  },
  additionalInfoBox: {
    width: '100%',
    height: 400,
    backgroundColor: '#FA8E4D',
    marginTop: 20,
    borderRadius: 10,
    position: 'absolute',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowColor: '#000',
  },
  additionalInfoBoxSecond: {
    width: '100%',
    height: 390,
    backgroundColor: '#FFF',
    borderRadius: 10,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowColor: '#000',
    padding: 14,
  },
  itionalInfoBoxSecondInfo: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
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
    fontWeight: 'light',
    color: '#000618',
  },
  infoBoxSecondInfoTextSecond: {
    fontSize: 14,
    marginLeft: 20,
    fontWeight: 'light',
    color: '#646567',
  },
  additionalInfoBoxSecondRowTwo: {
    marginTop: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  infoBoxSecondInfoTextRowTwo: {
    fontSize: 15,
    fontWeight: 'light',
    color: '#575757',
  },
  infoBoxSecondInfoTextSecondRowTwo: {
    fontSize: 15,
    fontWeight: 'normal',
    color: '#000618',
  },
  additionalInfoBoxEdit: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 500,
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
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    width: '30%',
    height: 30,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 15,
    paddingLeft: 10,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalCloseButton: {
    color: '#FA8E4D',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  modalAddButton: {
    backgroundColor: '#FA8E4D',
    color: '#fff',
    fontSize: 16,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
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
    color: 'black',
  },
  profileModalCloseButton: {
    color: 'blue',
    fontSize: 16,
    marginTop: 10,
  },
  pickerStyle: {
    height: 30,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 15,
    marginRight: 5,
    paddingLeft: 5,
  },
  statusChangeButton: {
    backgroundColor: '#FA8E4D',
    color: '#fff',
    fontSize: 14,
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
  },
  addBasicInfoContainer: {
    width: '70%',
  },

});

export default Kuchnia;
