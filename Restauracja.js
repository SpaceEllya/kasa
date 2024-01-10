import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';


const Restauracja = () => {
  
  const navigation = useNavigation();
  const [selectedLink, setSelectedLink] = useState(null);
  const [isTooltipVisible, setTooltipVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

 

  const [orderDetails, setOrderDetails] = useState({
    table: '',
    amount: '',
    time: '',
    order: '',
  });

  const handleCancelBookingPress = () => {
    console.log('Cancel Booking pressed...');
  };

  const handleModifyPress = () => {
    console.log('Modify pressed...');
  };
  

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
          <View style={styles.searchContainer}>
            <Image source={require('./assets/search.png')} style={styles.searchIcon} />
            <TextInput style={styles.searchInput} placeholder="Search..." placeholderTextColor="#666B78" />
          </View>
          <View style={styles.headerTextContainer}>
        <TouchableOpacity onPress={() => handleLinkPress('KuchniaPage')}>
          <Text style={[styles.headerLink, selectedLink === 'KuchniaPage' && styles.selectedLink]}>Kuchnia</Text>
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
      </View>
          <Image source={require('./assets/call.png')} style={styles.icon} />
          <Image source={require('./assets/user_profile.png')} style={styles.profileImage} />
        </View>

        <View style={styles.userInfoContainer}>
          <Text style={styles.userInfoText}>Użytkownik: Anna Nowak</Text>
          <TouchableOpacity onPress={handleChangeUser} style={styles.changeUserButton}>
            <Text style={styles.changeUserButtonText}>Zmień użytkownika</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.addBasicInfoContainer}>
        <View style={styles.additionalInfoContainer}>
          <Text style={styles.additionalInfoText}>Menu</Text>
          <View style={styles.InfoBox}>
            <View style={styles.additionalInfoBox}>
              <View style={styles.additionalInfoBoxSecond}>
                <View style={styles.itionalInfoBoxSecondInfo}>
                  <Image
                    source={require('./assets/user_profile.png')}
                    style={styles.additionalInfoBoxSecondbackgroundImage}
                  />
                  <View style={styles.itionalInfoBoxSecondInfoText}>
                    <Text style={styles.infoBoxSecondInfoText}>Dania Główne</Text>
                    <Text style={styles.infoBoxSecondInfoTextSecond}>
                    Kucharz
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setTooltipVisible(true)}
                    onPressOut={() => setTooltipVisible(false)}
                    >
                    
                  </TouchableOpacity>
                </View>
                <View style={styles.additionalInfoBoxSecondRowTwo}>
                  <View>
                    <Text style={styles.infoBoxSecondInfoTextRowTwo}>Ilość pozycji</Text>
                    <Text style={styles.infoBoxSecondInfoTextSecondRowTwo}>16</Text>
                  </View>
                  
                </View>
              </View>

              <View style={styles.additionalInfoBoxEdit}>

                <TouchableOpacity onPress={() => handleModifyPress()}>
                  <Text style={styles.additionalInfoBoxEditSecond}>Edytuj Kategorię</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>

      

      <Modal animationType="slide" transparent={true} visible={isModalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Dodaj Kategorię</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Kategoria"
              value={orderDetails.table}
              onChangeText={(text) => handleInputChange('table', text)}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Kucharz"
              value={orderDetails.amount}
              onChangeText={(text) => handleInputChange('amount', text)}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Ilość pozycji"
              value={orderDetails.time}
              onChangeText={(text) => handleInputChange('time', text)}
            />
           

            <TouchableOpacity onPress={handleAddOrder}>
              <Text style={styles.modalAddOrderButton}>Dodaj Kategorię</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleModalClose}>
              <Text style={styles.modalCloseButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleAddOrderPress} style={styles.changeUserButtonTwo}>
          <Text style={styles.changeUserButtonTextTwo}>Dodaj Kategorię</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginLeft:250,
    marginRight:250,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 30,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#FFF',
    backgroundColor: '#FFF',
    width: 300,
    height: 35,
    borderRadius: 10,
    padding: 5,
    marginRight: 20,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  searchInput: {
    flex: 1,
    color: '#000',
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
    marginLeft:250,
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
    marginLeft:250,
    marginRight:250,
    marginTop: 70,

  },

  additionalInfoContainer: {
    

    alignItems: 'flex-start',

  },
  additionalInfoText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'light',
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
    justifyContent: 'flex-start',
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
    marginLeft:20,
    fontWeight: 'light',
    color: '#000618',

  },
  infoBoxSecondInfoTextSecond:{
    fontSize:14,
    marginLeft:20,
    fontWeight: 'light',
    color: '#646567',

  },
  additionalInfoBoxSecondRowTwo:{
    marginTop:20,
    marginLeft:40,
    justifyContent: 'flex-start',
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
    width: '60%', // Увеличил ширину до 60%
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

});
  


export default Restauracja;