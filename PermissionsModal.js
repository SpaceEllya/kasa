import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';

const PermissionsModal = ({ isVisible, onClose, userId }) => {
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    if (isVisible) {
      // Fetch user permissions
      fetchUserPermissions(userId);
    }
  }, [isVisible, userId]);

  const fetchUserPermissions = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8000/kfp/UserPermissions/${userId}/`, {
        method: 'GET',
      });
      const data = await response.json();
      setPermissions(data);
    } catch (error) {
      console.error('Error fetching user permissions', error);
    }
  };

  const renderPermissionItem = ({ item }) => (
    <View>
      <Text>{item.name}</Text>
      <Text>{item.codename}</Text>
    </View>
  );

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose}>
      <View>
        <Text>User Permissions</Text>
        <FlatList
          data={permissions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPermissionItem}
        />
        <TouchableOpacity onPress={onClose}>
          <Text>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default PermissionsModal;
