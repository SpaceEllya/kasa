import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const UserSelectionModal = ({ isVisible, onClose, onSelectUser }) => {
  const [users, setUsers] = useState([
    { id: 1, name: 'Anna Nowak', status: 'Menadżer' },
    { id: 2, name: 'Jan Kowalski', status: 'Kelner' },

    // Добавьте других пользователей по аналогии
  ]);

  const handleUserSelection = (userId) => {
    onSelectUser(userId);
    setPermissionsModalVisible(true);

    // Используйте navigation.navigate для перехода на LoginPage
    navigation.navigate('LoginPage');
  };


  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => {
        onSelectUser(item);
      }}
    >
      <Text style={styles.userName}>{item.name}</Text>
      <Text style={styles.userStatus}>Status: {item.status}</Text>
    </TouchableOpacity>
  );

  return (
    
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Wybierz użytkownika</Text>
          <FlatList
            data={users}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
          />
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.modalCloseButton}>Zamknij</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    width: '50%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  userItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userStatus: {
    fontSize: 14,
    color: '#555',
  },
  modalCloseButton: {
    color: 'blue',
    fontSize: 16,
    marginTop: 15,
  },
});

export default UserSelectionModal;
