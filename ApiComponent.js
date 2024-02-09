import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Button } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';


const baseUrl = 'http://localhost:8000/kfp'

export const registerUser = async (username, password) => {
    const registerEndpoint = `${baseUrl}/register`
    
    try {
      const response = await axios.post(registerEndpoint, {
        username,
        password,
      });
  
      const responseData = response.data;
      console.log('Dane z Django:', responseData);
  
      // Tutaj możesz przechowywać dane w zmiennej "QaQ" lub przekazać je dalej, w zależności od potrzeb
  
      return responseData;
    } catch (error) {
      console.error('Błąd podczas logowania:', error);
      throw error;
    }
  };

export const loginUser = async (username, password) => {
    const loginEndpoint = `${baseUrl}/login`;

    try {
        const response = await axios.post(loginEndpoint, {
        username,
        password,
        });

        const responseData = response.data;
        console.log('Dane z Django:', responseData);

        // Zapisywanie tokenów w AsyncStorage
        await AsyncStorage.setItem('accessToken', responseData.token);
        await AsyncStorage.setItem('refreshToken', responseData.refreshToken);

        // Tutaj możesz przechowywać dane w zmiennej "QaQ" lub przekazać je dalej, w zależności od potrzeb

        return responseData;
    } catch (error) {
        console.error('Błąd podczas logowania:', error);
        throw error;
    }
};

const getUserDetails = async () => {
    const userEndpoint = `${baseUrl}/user`

    try {
      // Pobierz refreshToken z AsyncStorage
      const refreshToken = await AsyncStorage.getItem('refreshToken');
  
      // Sprawdź, czy refreshToken istnieje
      if (!refreshToken) {
        console.error('Brak refreshToken w AsyncStorage');
        // Obsłuż brak refreshToken, np. przekieruj do ekranu logowania
        return;
      }
  
      // Dodaj refreshToken do nagłówka żądania
      const headers = {
        Cookie: `refreshToken=${refreshToken};`,
      };
  
      // Wysyłaj żądanie do endpointu z refreshToken w nagłówku
      const response = await axios.get(userEndpoint, { headers });
  
      const responseData = response.data;
      console.log('Dane użytkownika z Django:', responseData);
  
      // Tutaj możesz przechowywać dane w zmiennej "QaQ" lub przekazać je dalej, w zależności od potrzeb
  
      return responseData;
    } catch (error) {
      console.error('Błąd podczas pobierania danych użytkownika:', error);
      throw error;
    }
  };

const refreshAccessToken = async () => {
    const refreshEndpoint = `${baseUrl}/refresh`

    try {
      // Pobierz refreshToken z AsyncStorage
      const refreshToken = await AsyncStorage.getItem('refreshToken');
  
      // Sprawdź, czy refreshToken istnieje
      if (!refreshToken) {
        console.error('Brak refreshToken w AsyncStorage');
        // Obsłuż brak refreshToken, np. przekieruj do ekranu logowania
        return;
      }
  
      // Dodaj refreshToken do nagłówka żądania
      const headers = {
        Cookie: `refreshToken=${refreshToken};`,
      };
  
      // Wysyłaj żądanie do endpointu /refresh z refreshToken w nagłówku
      const response = await axios.post(refreshEndpoint, {}, { headers });
  
      const responseData = response.data;
      console.log('Odnawianie tokena dostępowego:', responseData);
  
      // Tutaj możesz przechowywać odnowiony token dostępowy w zmiennej "QaQ" lub przekazać go dalej, w zależności od potrzeb
  
      return responseData;
    } catch (error) {
      console.error('Błąd podczas odnawiania tokena dostępowego:', error);
      throw error;
    }
};

const logoutUser = async () => {
    const logoutEndpoint = `${baseUrl}/logout`

    try {
      // Pobierz refreshToken z AsyncStorage
      const refreshToken = await AsyncStorage.getItem('refreshToken');
  
      // Sprawdź, czy refreshToken istnieje
      if (!refreshToken) {
        console.error('Brak refreshToken w AsyncStorage');
        // Obsłuż brak refreshToken, np. przekierowuj do ekranu logowania
        return;
      }
  
      // Dodaj refreshToken do nagłówka żądania
      const headers = {
        Cookie: `refreshToken=${refreshToken};`,
      };
  
      // Wysyłaj żądanie do endpointu /logout z refreshToken w nagłówku
      const response = await axios.post(logoutEndpoint, {}, { headers });
  
      const responseData = response.data;
      console.log('Wylogowywanie:', responseData);
  
      // Usuń refreshToken i accessToken z AsyncStorage po wylogowaniu
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('accessToken');
  
      // Tutaj możesz obsługiwać dodatkowe czynności związane z wylogowaniem
  
      return responseData;
    } catch (error) {
      console.error('Błąd podczas wylogowywania:', error);
      throw error;
    }
};

export const getCategories = async (pk, hk) => {
  const CategoriesEndpoint = `${baseUrl}/Categories`

  try {
    
    const refreshToken = await AsyncStorage.getItem('refreshToken');

    
    if (!refreshToken) {
      console.error('Brak refreshToken w AsyncStorage');
      
      return;
    }

    
    const headers = {
      Cookie: `refreshToken=${refreshToken}`,
    };

    console.log(refreshToken);

    const url = `${CategoriesEndpoint}/${pk}/${hk}/`;

    
    const response = await axios.get(url, { headers });

    const responseData = response.data;
    console.log('Dane kategorii z Django:', responseData);

    

    return responseData;
  } catch (error) {
    console.error('Błąd podczas pobierania kategorii:', error);
    throw error;
  }
};

const getDishes = async (pk, kk) => {
    const DishesEndpoint = `${baseUrl}/Dishes`;
  
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
  
      if (!refreshToken) {
        console.error('Brak refreshToken w AsyncStorage');
        // Obsłuż brak refreshToken, np. przekierowuj do ekranu logowania
        return;
      }
  
      const headers = {
        Cookie: `refreshToken=${refreshToken};`,
      };
  
      const url = `${DishesEndpoint}/${pk}/${kk}/`;
  
      const response = await axios.get(url, { headers });
  
      const responseData = response.data;
      console.log('Dane potraw z Django:', responseData);
  
      // Tutaj możesz przechowywać dane w zmiennej "QaQ" lub przekazać je dalej, w zależności od potrzeb
  
      return responseData;
    } catch (error) {
      console.error('Błąd podczas pobierania potraw:', error);
      throw error;
    }
};

const getDishesProducts = async (pk, dk) => {
    const DishesProductsEndpoint = `${baseUrl}/DishesProducts`;
  
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
  
      if (!refreshToken) {
        console.error('Brak refreshToken w AsyncStorage');
        // Obsłuż brak refreshToken, np. przekierowuj do ekranu logowania
        return;
      }
  
      const headers = {
        Cookie: `refreshToken=${refreshToken};`,
      };
  
      const url = `${DishesProductsEndpoint}/${pk}/${dk}/`;
  
      const response = await axios.get(url, { headers });
  
      const responseData = response.data;
      console.log('Dane produktów potraw z Django:', responseData);
  
      // Tutaj możesz przechowywać dane w zmiennej "QaQ" lub przekazać je dalej, w zależności od potrzeb
  
      return responseData;
    } catch (error) {
      console.error('Błąd podczas pobierania produktów potraw:', error);
      throw error;
    }
};

const getDishesVariants = async (pk, dk) => {
    const DishesVariantsEndpoint = `${baseUrl}/DishesVariants`;
  
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
  
      if (!refreshToken) {
        console.error('Brak refreshToken w AsyncStorage');
        // Obsłuż brak refreshToken, np. przekierowuj do ekranu logowania
        return;
      }
  
      const headers = {
        Cookie: `refreshToken=${refreshToken};`,
      };
  
      const url = `${DishesVariantsEndpoint}/${pk}/${dk}/`;
  
      const response = await axios.get(url, { headers });
  
      const responseData = response.data;
      console.log('Dane wariantów potraw z Django:', responseData);
  
      // Tutaj możesz przechowywać dane w zmiennej "QaQ" lub przekazać je dalej, w zależności od potrzeb
  
      return responseData;
    } catch (error) {
      console.error('Błąd podczas pobierania wariantów potraw:', error);
      throw error;
    }
};

const getOrdersDetails = async (pk, uk) => {
    const OrdersDetailsEndpoint = `${baseUrl}/OrdersDetails`;
  
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
  
      if (!refreshToken) {
        console.error('Brak refreshToken w AsyncStorage');
        // Obsłuż brak refreshToken, np. przekierowuj do ekranu logowania
        return;
      }
  
      const headers = {
        Cookie: `refreshToken=${refreshToken};`,
      };
  
      const url = `${OrdersDetailsEndpoint}/${pk}/${uk}/`;
  
      const response = await axios.get(url, { headers });
  
      const responseData = response.data;
      console.log('Dane szczegółów zamówień z Django:', responseData);
  
      // Tutaj możesz przechowywać dane w zmiennej "QaQ" lub przekazać je dalej, w zależności od potrzeb
  
      return responseData;
    } catch (error) {
      console.error('Błąd podczas pobierania szczegółów zamówień:', error);
      throw error;
    }
};

const getOrdersHasDishes = async (pk, ok) => {
    const OrdersHasDishesEndpoint = `${baseUrl}/OrdershasDishes`;
  
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
  
      if (!refreshToken) {
        console.error('Brak refreshToken w AsyncStorage');
        // Obsłuż brak refreshToken, np. przekierowuj do ekranu logowania
        return;
      }
  
      const headers = {
        Cookie: `refreshToken=${refreshToken};`,
      };
  
      const url = `${OrdersHasDishesEndpoint}/${pk}/${ok}/`;
  
      const response = await axios.get(url, { headers });
  
      const responseData = response.data;
      console.log('Dane zamówień z potrawami z Django:', responseData);
  
      // Tutaj możesz przechowywać dane w zmiennej "QaQ" lub przekazać je dalej, w zależności od potrzeb
  
      return responseData;
    } catch (error) {
      console.error('Błąd podczas pobierania zamówień z potrawami:', error);
      throw error;
    }
};

const getBills = async (pk, uk) => {
    const BillsEndpoint = `${baseUrl}/Bills`;
  
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
  
      if (!refreshToken) {
        console.error('Brak refreshToken w AsyncStorage');
        // Obsłuż brak refreshToken, np. przekierowuj do ekranu logowania
        return;
      }
  
      const headers = {
        Cookie: `refreshToken=${refreshToken};`,
      };
  
      const url = `${BillsEndpoint}/${pk}/${uk}/`;
  
      const response = await axios.get(url, { headers });
  
      const responseData = response.data;
      console.log('Dane rachunków z Django:', responseData);
  
      // Tutaj możesz przechowywać dane w zmiennej "QaQ" lub przekazać je dalej, w zależności od potrzeb
  
      return responseData;
    } catch (error) {
      console.error('Błąd podczas pobierania rachunków:', error);
      throw error;
    }
};

const getKitchenOrders = async (pk) => {
    const KitchenOrdersEndpoint = `${baseUrl}/KitchenOrders`;
  
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
  
      if (!refreshToken) {
        console.error('Brak refreshToken w AsyncStorage');
        // Obsłuż brak refreshToken, np. przekierowuj do ekranu logowania
        return;
      }
  
      const headers = {
        Cookie: `refreshToken=${refreshToken};`,
      };
  
      const url = `${KitchenOrdersEndpoint}/${pk}/`;
  
      const response = await axios.get(url, { headers });
  
      const responseData = response.data;
      console.log('Dane zamówień kuchennych z Django:', responseData);
  
      // Tutaj możesz przechowywać dane w zmiennej "QaQ" lub przekazać je dalej, w zależności od potrzeb
  
      return responseData;
    } catch (error) {
      console.error('Błąd podczas pobierania zamówień kuchennych:', error);
      throw error;
    }
};

const updateDoneStatus = async (pk) => {
    const UpdateDoneStatusEndpoint = `${baseUrl}/UpdateDoneStatus/${pk}/`;
  
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
  
      if (!refreshToken) {
        console.error('Brak refreshToken w AsyncStorage');
        // Obsłuż brak refreshToken, np. przekierowuj do ekranu logowania
        return;
      }
  
      const headers = {
        Cookie: `refreshToken=${refreshToken};`,
      };
  
      const response = await axios.put(UpdateDoneStatusEndpoint, null, { headers });
  
      const responseData = response.data;
      console.log('Status wykonania zamówienia został zaktualizowany:', responseData);
  
      // Tutaj możesz przechowywać dane w zmiennej "QaQ" lub przekazać je dalej, w zależności od potrzeb
  
      return responseData;
    } catch (error) {
      console.error('Błąd podczas aktualizacji statusu wykonania zamówienia:', error);
      throw error;
    }
};

const kitchenOrderStart = async (table) => {
    const KitchenOrderStartEndpoint = `${baseUrl}/KitchenOrderStart`;
  
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
  
      if (!refreshToken) {
        console.error('Brak refreshToken w AsyncStorage');
        // Obsłuż brak refreshToken, np. przekierowuj do ekranu logowania
        return;
      }
  
      const headers = {
        Cookie: `refreshToken=${refreshToken};`,
      };
  
      const requestData = {
        table: table,
      };
  
      const response = await axios.post(KitchenOrderStartEndpoint, requestData, { headers });
  
      const responseData = response.data;
      console.log('Nowe zamówienie zostało rozpoczęte:', responseData);
  
      // Tutaj możesz przechowywać dane w zmiennej "QaQ" lub przekazać je dalej, w zależności od potrzeb
  
      return responseData;
    } catch (error) {
      console.error('Błąd podczas rozpoczynania nowego zamówienia:', error);
      throw error;
    }
};

const kitchenOrderCreate = async (orderNumber, dishes, counts, variants) => {
    const KitchenOrderCreateEndpoint = `${baseUrl}/KitchenOrderCreate`;
  
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
  
      if (!refreshToken) {
        console.error('Brak refreshToken w AsyncStorage');
        // Obsłuż brak refreshToken, np. przekierowuj do ekranu logowania
        return;
      }
  
      const headers = {
        Cookie: `refreshToken=${refreshToken};`,
      };
  
      const requestData = {
        order: orderNumber,
        dishes: dishes,
        counts: counts,
        variants: variants,
      };
  
      const response = await axios.post(KitchenOrderCreateEndpoint, requestData, { headers });
  
      const responseData = response.data;
      console.log('Nowe zamówienie kuchenne zostało utworzone:', responseData);
  
      // Tutaj możesz przechowywać dane w zmiennej "QaQ" lub przekazać je dalej, w zależności od potrzeb
  
      return responseData;
    } catch (error) {
      console.error('Błąd podczas tworzenia nowego zamówienia kuchennego:', error);
      throw error;
    }
};

const addPermissionToGroup = async (groupId, permissionCodename) => {
    const AddPermissionToGroupEndpoint = `${baseUrl}/AddPermissionToGroup`;
  
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
  
      if (!refreshToken) {
        console.error('Brak refreshToken w AsyncStorage');
        // Obsłuż brak refreshToken, np. przekierowuj do ekranu logowania
        return;
      }
  
      const headers = {
        Cookie: `refreshToken=${refreshToken};`,
      };
  
      const requestData = {
        group_id: groupId,
        permission_codename: permissionCodename,
      };
  
      const response = await axios.post(AddPermissionToGroupEndpoint, requestData, { headers });
  
      const responseData = response.data;
      console.log('Uprawnienie dodane do grupy:', responseData);
  
      // Tutaj możesz przechowywać dane w zmiennej "QaQ" lub przekazać je dalej, w zależności od potrzeb
  
      return responseData;
    } catch (error) {
      console.error('Błąd podczas dodawania uprawnienia do grupy:', error);
      throw error;
    }
};

const addPermissionToUser = async (userId, permissionCodename) => {
    const AddPermissionToUserEndpoint = `${baseUrl}/AddPermissionToUser`;
  
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
  
      if (!refreshToken) {
        console.error('Brak refreshToken w AsyncStorage');
        // Obsłuż brak refreshToken, np. przekierowuj do ekranu logowania
        return;
      }
  
      const headers = {
        Cookie: `refreshToken=${refreshToken};`,
      };
  
      const requestData = {
        user_id: userId,
        permission_codename: permissionCodename,
      };
  
      const response = await axios.post(AddPermissionToUserEndpoint, requestData, { headers });
  
      const responseData = response.data;
      console.log('Uprawnienie dodane do użytkownika:', responseData);
  
      // Tutaj możesz przechowywać dane w zmiennej "QaQ" lub przekazać je dalej, w zależności od potrzeb
  
      return responseData;
    } catch (error) {
      console.error('Błąd podczas dodawania uprawnienia do użytkownika:', error);
      throw error;
    }
};

const removePermissionFromGroup = async (groupId, permissionCodename) => {
    const RemovePermissionFromGroupEndpoint = `${baseUrl}/RemovePermissionFromGroup`;
  
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
  
      if (!refreshToken) {
        console.error('Brak refreshToken w AsyncStorage');
        // Obsłuż brak refreshToken, np. przekierowuj do ekranu logowania
        return;
      }
  
      const headers = {
        Cookie: `refreshToken=${refreshToken};`,
      };
  
      const requestData = {
        group_id: groupId,
        permission_codename: permissionCodename,
      };
  
      const response = await axios.delete(RemovePermissionFromGroupEndpoint, { data: requestData, headers });
  
      const responseData = response.data;
      console.log('Uprawnienie usunięte z grupy:', responseData);
  
      // Tutaj możesz przechowywać dane w zmiennej "QaQ" lub przekazać je dalej, w zależności od potrzeb
  
      return responseData;
    } catch (error) {
      console.error('Błąd podczas usuwania uprawnienia z grupy:', error);
      throw error;
    }
};

const removePermissionFromUser = async (userId, permissionCodename) => {
    const RemovePermissionFromUserEndpoint = `${baseUrl}/RemovePermissionFromUser`;
  
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
  
      if (!refreshToken) {
        console.error('Brak refreshToken w AsyncStorage');
        // Obsłuż brak refreshToken, np. przekierowuj do ekranu logowania
        return;
      }
  
      const headers = {
        Cookie: `refreshToken=${refreshToken};`,
      };
  
      const requestData = {
        user_id: userId,
        permission_codename: permissionCodename,
      };
  
      const response = await axios.delete(RemovePermissionFromUserEndpoint, { data: requestData, headers });
  
      const responseData = response.data;
      console.log('Uprawnienie usunięte z użytkownika:', responseData);
  
      // Tutaj możesz przechowywać dane w zmiennej "QaQ" lub przekazać je dalej, w zależności od potrzeb
  
      return responseData;
    } catch (error) {
      console.error('Błąd podczas usuwania uprawnienia z użytkownika:', error);
      throw error;
    }
};

const getPermissions = async () => {
    const PermissionsEndpoint = `${baseUrl}/Permissions`;
  
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
  
      if (!refreshToken) {
        console.error('Brak refreshToken w AsyncStorage');
        // Obsłuż brak refreshToken, np. przekierowuj do ekranu logowania
        return;
      }
  
      const headers = {
        Cookie: `refreshToken=${refreshToken};`,
      };
  
      const response = await axios.get(PermissionsEndpoint, { headers });
  
      const responseData = response.data;
      console.log('Lista uprawnień z Django:', responseData);
  
      // Tutaj możesz przechowywać dane w zmiennej "QaQ" lub przekazać je dalej, w zależności od potrzeb
  
      return responseData;
    } catch (error) {
      console.error('Błąd podczas pobierania listy uprawnień:', error);
      throw error;
    }
};

const getUserPermissions = async (userId) => {
    const UserPermissionsEndpoint = `${baseUrl}/UserPermissions/${userId}/`;
  
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
  
      if (!refreshToken) {
        console.error('Brak refreshToken w AsyncStorage');
        // Obsłuż brak refreshToken, np. przekierowuj do ekranu logowania
        return;
      }
  
      const headers = {
        Cookie: `refreshToken=${refreshToken};`,
      };
  
      const response = await axios.get(UserPermissionsEndpoint, { headers });
  
      const responseData = response.data;
      console.log('Uprawnienia użytkownika z Django:', responseData);
  
      // Tutaj możesz przechowywać dane w zmiennej "QaQ" lub przekazać je dalej, w zależności od potrzeb
  
      return responseData;
    } catch (error) {
      console.error('Błąd podczas pobierania uprawnień użytkownika:', error);
      throw error;
    }
};

const getGroupPermissions = async (groupId) => {
    const GroupPermissionsEndpoint = `${baseUrl}/GroupPermissions/${groupId}/`;
  
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
  
      if (!refreshToken) {
        console.error('Brak refreshToken w AsyncStorage');
        // Obsłuż brak refreshToken, np. przekierowuj do ekranu logowania
        return;
      }
  
      const headers = {
        Cookie: `refreshToken=${refreshToken};`,
      };
  
      const response = await axios.get(GroupPermissionsEndpoint, { headers });
  
      const responseData = response.data;
      console.log('Uprawnienia grupy z Django:', responseData);
  
      // Tutaj możesz przechowywać dane w zmiennej "QaQ" lub przekazać je dalej, w zależności od potrzeb
  
      return responseData;
    } catch (error) {
      console.error('Błąd podczas pobierania uprawnień grupy:', error);
      throw error;
    }
};

const getNotifications = async () => {
    const NotificationsEndpoint = `${baseUrl}/Notifications`;
  
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
  
      if (!refreshToken) {
        console.error('Brak refreshToken w AsyncStorage');
        // Obsłuż brak refreshToken, np. przekierowuj do ekranu logowania
        return;
      }
  
      const headers = {
        Cookie: `refreshToken=${refreshToken};`,
      };
  
      const response = await axios.get(NotificationsEndpoint, { headers });
  
      const responseData = response.data;
      console.log('Lista powiadomień z Django:', responseData);
  
      // Tutaj możesz przechowywać dane w zmiennej "QaQ" lub przekazać je dalej, w zależności od potrzeb
  
      return responseData;
    } catch (error) {
      console.error('Błąd podczas pobierania powiadomień:', error);
      throw error;
    }
};

const getUsersDetails = async (userId) => {
    const UsersEndpoint = `${baseUrl}/Users/${userId}/`;
  
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
  
      if (!refreshToken) {
        console.error('Brak refreshToken w AsyncStorage');
        // Obsłuż brak refreshToken, np. przekierowuj do ekranu logowania
        return;
      }
  
      const headers = {
        Cookie: `refreshToken=${refreshToken};`,
      };
  
      const response = await axios.get(UsersEndpoint, { headers });
  
      const responseData = response.data;
      console.log('Dane użytkownika z Django:', responseData);
  
      // Tutaj możesz przechowywać dane w zmiennej "QaQ" lub przekazać je dalej, w zależności od potrzeb
  
      return responseData;
    } catch (error) {
      console.error('Błąd podczas pobierania danych użytkownika:', error);
      throw error;
    }
};

const createNotification = async (notificationData) => {
    const NotificationsEndpoint = `${baseUrl}/CreateNotification`;
  
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
  
      if (!refreshToken) {
        console.error('Brak refreshToken w AsyncStorage');
        // Obsłuż brak refreshToken, np. przekierowuj do ekranu logowania
        return;
      }
  
      const headers = {
        Cookie: `refreshToken=${refreshToken};`,
      };
  
      const response = await axios.post(NotificationsEndpoint, notificationData, { headers });
  
      const responseData = response.data;
      console.log('Odpowiedź z Django po utworzeniu powiadomienia:', responseData);
  
      // Tutaj możesz przechowywać dane w zmiennej "QaQ" lub przekazać je dalej, w zależności od potrzeb
  
      return responseData;
    } catch (error) {
      console.error('Błąd podczas tworzenia powiadomienia:', error);
      throw error;
    }
};

const markNotificationAsViewed = async (notificationId) => {
    const ViewedNotificationEndpoint = `${baseUrl}/ViewedNotification/${notificationId}/`;
  
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
  
      if (!refreshToken) {
        console.error('Brak refreshToken w AsyncStorage');
        // Obsłuż brak refreshToken, np. przekierowuj do ekranu logowania
        return;
      }
  
      const headers = {
        Cookie: `refreshToken=${refreshToken};`,
      };
  
      const response = await axios.put(ViewedNotificationEndpoint, null, { headers });
  
      const responseData = response.data;
      console.log('Odpowiedź z Django po oznaczeniu powiadomienia jako przeczytanego:', responseData);
  
      // Tutaj możesz przechowywać dane w zmiennej "QaQ" lub przekazać je dalej, w zależności od potrzeb
  
      return responseData;
    } catch (error) {
      console.error('Błąd podczas oznaczania powiadomienia jako przeczytanego:', error);
      throw error;
    }
};

const removeUser = async (userId) => {
    const removeUserEndpoint = `${baseUrl}/RemoveUser/${userId}/`;
  
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
  
      if (!refreshToken) {
        console.error('Brak refreshToken w AsyncStorage');
        // Obsłuż brak refreshToken, np. przekierowuj do ekranu logowania
        return;
      }
  
      const headers = {
        Cookie: `refreshToken=${refreshToken};`,
      };
  
      const response = await axios.delete(removeUserEndpoint, { headers });
  
      const responseData = response.data;
      console.log('Odpowiedź z Django po usunięciu użytkownika:', responseData);
  
      // Tutaj możesz przechowywać dane w zmiennej "QaQ" lub przekazać je dalej, w zależności od potrzeb
  
      return responseData;
    } catch (error) {
      console.error('Błąd podczas usuwania użytkownika:', error);
      throw error;
    }
};

const deactivateUser = async (userId) => {
    const deactivateUserEndpoint = `${baseUrl}/DeactivateUser/${userId}/`;
  
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
  
      if (!refreshToken) {
        console.error('Brak refreshToken w AsyncStorage');
        // Obsłuż brak refreshToken, np. przekierowuj do ekranu logowania
        return;
      }
  
      const headers = {
        Cookie: `refreshToken=${refreshToken};`,
      };
  
      const response = await axios.patch(deactivateUserEndpoint, null, { headers });
  
      const responseData = response.data;
      console.log('Odpowiedź z Django po dezaktywacji użytkownika:', responseData);
  
      // Tutaj możesz przechowywać dane w zmiennej "QaQ" lub przekazać je dalej, w zależności od potrzeb
  
      return responseData;
    } catch (error) {
      console.error('Błąd podczas dezaktywacji użytkownika:', error);
      throw error;
    }
};

const addGroup = async (groupName) => {
    const addGroupEndpoint = `${baseUrl}/AddGroup`;
  
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
  
      if (!refreshToken) {
        console.error('Brak refreshToken w AsyncStorage');
        // Obsłuż brak refreshToken, np. przekierowuj do ekranu logowania
        return;
      }
  
      const headers = {
        Cookie: `refreshToken=${refreshToken};`,
      };
  
      const data = {
        group_name: groupName,
      };
  
      const response = await axios.post(addGroupEndpoint, data, { headers });
  
      const responseData = response.data;
      console.log('Odpowiedź z Django po utworzeniu nowej grupy:', responseData);
  
      // Tutaj możesz przechowywać dane w zmiennej "QaQ" lub przekazać je dalej, w zależności od potrzeb
  
      return responseData;
    } catch (error) {
      console.error('Błąd podczas tworzenia nowej grupy:', error);
      throw error;
    }
};

const deleteGroup = async (groupId) => {
    const deleteGroupEndpoint = `${baseUrl}/DeleteGroup/${groupId}/`;
  
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
  
      if (!refreshToken) {
        console.error('Brak refreshToken w AsyncStorage');
        // Obsłuż brak refreshToken, np. przekierowuj do ekranu logowania
        return;
      }
  
      const headers = {
        Cookie: `refreshToken=${refreshToken};`,
      };
  
      const response = await axios.delete(deleteGroupEndpoint, { headers });
  
      const responseData = response.data;
      console.log('Odpowiedź z Django po usunięciu grupy:', responseData);
  
      // Tutaj możesz przechowywać dane w zmiennej "QaQ" lub przekazać je dalej, w zależności od potrzeb
  
      return responseData;
    } catch (error) {
      console.error('Błąd podczas usuwania grupy:', error);
      throw error;
    }
};

const editUser = async (userId, userData) => {
    const editUserEndpoint = `${baseUrl}/EditUser/${userId}/`;
  
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
  
      if (!refreshToken) {
        console.error('Brak refreshToken w AsyncStorage');
        // Obsłuż brak refreshToken, np. przekierowuj do ekranu logowania
        return;
      }
  
      const headers = {
        Cookie: `refreshToken=${refreshToken};`,
      };
  
      const response = await axios.patch(editUserEndpoint, userData, { headers });
  
      const responseData = response.data;
      console.log('Odpowiedź z Django po aktualizacji użytkownika:', responseData);
  
      // Tutaj możesz przechowywać dane w zmiennej "QaQ" lub przekazać je dalej, w zależności od potrzeb
  
      return responseData;
    } catch (error) {
      console.error('Błąd podczas aktualizacji użytkownika:', error);
      throw error;
    }
};

const createBill = async (orderId) => {
    const createBillEndpoint = `${baseUrl}/CreateBill/${orderId}/`;
  
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
  
      if (!refreshToken) {
        console.error('Brak refreshToken w AsyncStorage');
        // Obsłuż brak refreshToken, np. przekierowuj do ekranu logowania
        return;
      }
  
      const headers = {
        Cookie: `refreshToken=${refreshToken};`,
      };
  
      const response = await axios.post(createBillEndpoint, null, { headers });
  
      const responseData = response.data;
      console.log('Odpowiedź z Django po utworzeniu rachunku:', responseData);
  
      // Tutaj możesz przechowywać dane w zmiennej "QaQ" lub przekazać je dalej, w zależności od potrzeb
  
      return responseData;
    } catch (error) {
      console.error('Błąd podczas tworzenia rachunku:', error);
      throw error;
    }
};

const deleteOrderPart = async (orderPartId) => {
    const deleteOrderPartEndpoint = `${baseUrl}/DeleteOrderPart/${orderPartId}/`;
  
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
  
      if (!refreshToken) {
        console.error('Brak refreshToken w AsyncStorage');
        // Obsłuż brak refreshToken, np. przekierowuj do ekranu logowania
        return;
      }
  
      const headers = {
        Cookie: `refreshToken=${refreshToken};`,
      };
  
      const response = await axios.delete(deleteOrderPartEndpoint, { headers });
  
      const responseData = response.data;
      console.log('Odpowiedź z Django po usunięciu pozycji zamówienia:', responseData);
  
      // Tutaj możesz przechowywać dane w zmiennej "QaQ" lub przekazać je dalej, w zależności od potrzeb
  
      return responseData;
    } catch (error) {
      console.error('Błąd podczas usuwania pozycji zamówienia:', error);
      throw error;
    }
};

const deleteOrder = async (orderId) => {
    const deleteOrderEndpoint = `${baseUrl}/DeleteOrder/${orderId}/`;
  
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
  
      if (!refreshToken) {
        console.error('Brak refreshToken w AsyncStorage');
        // Obsłuż brak refreshToken, np. przekierowuj do ekranu logowania
        return;
      }
  
      const headers = {
        Cookie: `refreshToken=${refreshToken};`,
      };
  
      const response = await axios.delete(deleteOrderEndpoint, { headers });
  
      const responseData = response.data;
      console.log('Odpowiedź z Django po usunięciu zamówienia:', responseData);
  
      // Tutaj możesz przechowywać dane w zmiennej "QaQ" lub przekazać je dalej, w zależności od potrzeb
  
      return responseData;
    } catch (error) {
      console.error('Błąd podczas usuwania zamówienia:', error);
      throw error;
    }
};

const AddDishScreen = () => {
    const [selectedImage, setSelectedImage] = useState(null);
  
    const handleImagePicker = () => {
      const options = {
        title: 'Select Image',
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      };
  
      ImagePicker.showImagePicker(options, (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          const source = { uri: response.uri };
          setSelectedImage(source);
        }
      });
    };
  
    const handleUpload = async () => {
      try {
        const formData = new FormData();
        formData.append('D_img', {
          uri: selectedImage.uri,
          type: 'image/jpeg',
          name: 'photo.jpg',
        });
  
        // Zmodyfikuj poniższy URL, aby dopasować adres Twojego endpointu dodawania dania
        const apiUrl = `${baseUrl}/AddDish`;
  
        // Zmodyfikuj poniższy kod, aby dopasować Twoje potrzeby
        const response = await axios.post(apiUrl, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Cookie: `refreshToken=${refreshToken};`,
          },
        });
  
        console.log(response.data);
        return response.data
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
};

export const addCategory = async (categoryData) => {
    const addCategoryEndpoint = `${baseUrl}/AddCategory`;
  
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
  
      if (!refreshToken) {
        console.error('Brak refreshToken w AsyncStorage');
        // Obsłuż brak refreshToken, np. przekierowuj do ekranu logowania
        return;
      }
  
      const headers = {
        Cookie: `refreshToken=${refreshToken};`,
      };
  
      const response = await axios.post(addCategoryEndpoint, categoryData, { headers });
  
      const responseData = response.data;
      console.log('Odpowiedź z Django po dodaniu kategorii:', responseData);
  
      // Tutaj możesz przechowywać dane w zmiennej "QaQ" lub przekazać je dalej, w zależności od potrzeb
  
      return responseData;
    } catch (error) {
      console.error('Błąd podczas dodawania kategorii:', error);
      throw error;
    }
};

const addDishesProducts = async (dishesProductsData) => {
    const addDishesProductsEndpoint = `${baseUrl}/AddDishesProducts`;
  
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
  
      if (!refreshToken) {
        console.error('Brak refreshToken w AsyncStorage');
        // Obsłuż brak refreshToken, np. przekierowuj do ekranu logowania
        return;
      }
  
      const headers = {
        Cookie: `refreshToken=${refreshToken};`,
      };
  
      const response = await axios.post(addDishesProductsEndpoint, dishesProductsData, { headers });
  
      const responseData = response.data;
      console.log('Odpowiedź z Django po dodaniu produktu dania:', responseData);
  
      // Tutaj możesz przechowywać dane w zmiennej lub przekazać je dalej, w zależności od potrzeb
  
      return responseData;
    } catch (error) {
      console.error('Błąd podczas dodawania produktu dania:', error);
      throw error;
    }
};

const addDishesVariants = async (dishesVariantsData) => {
    const addDishesVariantsEndpoint = `${baseUrl}/AddDishesVariants`;
  
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
  
      if (!refreshToken) {
        console.error('Brak refreshToken w AsyncStorage');
        // Obsłuż brak refreshToken, np. przekierowuj do ekranu logowania
        return;
      }
  
      const headers = {
        Cookie: `refreshToken=${refreshToken};`,
      };
  
      const response = await axios.post(addDishesVariantsEndpoint, dishesVariantsData, { headers });
  
      const responseData = response.data;
      console.log('Odpowiedź z Django po dodaniu wariantu dania:', responseData);
  
      // Tutaj możesz przechowywać dane w zmiennej lub przekazać je dalej, w zależności od potrzeb
  
      return responseData;
    } catch (error) {
      console.error('Błąd podczas dodawania wariantu dania:', error);
      throw error;
    }
};

const deleteCategory = async (categoryId) => {
    const deleteCategoryEndpoint = `${baseUrl}/DeleteCategory/${categoryId}/`;
  
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
  
      if (!refreshToken) {
        console.error('Brak refreshToken w AsyncStorage');
        // Obsłuż brak refreshToken, np. przekierowuj do ekranu logowania
        return;
      }
  
      const headers = {
        Cookie: `refreshToken=${refreshToken};`,
      };
  
      const response = await axios.delete(deleteCategoryEndpoint, { headers });
  
      console.log('Odpowiedź z Django po usunięciu kategorii:', response.data);
  
      // Tutaj możesz przechowywać dane w zmiennej lub przekazać je dalej, w zależności od potrzeb
  
      return response.data;
    } catch (error) {
      console.error('Błąd podczas usuwania kategorii:', error);
      throw error;
    }
};

const deleteDish = async (dishId) => {
    const deleteDishEndpoint = `${baseUrl}/DeleteDish/${dishId}/`;
  
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
  
      if (!refreshToken) {
        console.error('Brak refreshToken w AsyncStorage');
        // Obsłuż brak refreshToken, np. przekierowuj do ekranu logowania
        return;
      }
  
      const headers = {
        Cookie: `refreshToken=${refreshToken};`,
      };
  
      const response = await axios.delete(deleteDishEndpoint, { headers });
  
      console.log('Odpowiedź z Django po usunięciu dania:', response.data);
  
      // Tutaj możesz przechowywać dane w zmiennej lub przekazać je dalej, w zależności od potrzeb
  
      return response.data;
    } catch (error) {
      console.error('Błąd podczas usuwania dania:', error);
      throw error;
    }
};

const deleteDishesProducts = async (productId) => {
    const deleteDishesProductsEndpoint = `${baseUrl}/DeleteDishesProducts/${productId}/`;
  
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
  
      if (!refreshToken) {
        console.error('Brak refreshToken w AsyncStorage');
        // Obsłuż brak refreshToken, np. przekierowuj do ekranu logowania
        return;
      }
  
      const headers = {
        Cookie: `refreshToken=${refreshToken};`,
      };
  
      const response = await axios.delete(deleteDishesProductsEndpoint, { headers });
  
      console.log('Odpowiedź z Django po usunięciu produktu:', response.data);
  
      // Tutaj możesz przechowywać dane w zmiennej lub przekazać je dalej, w zależności od potrzeb
  
      return response.data;
    } catch (error) {
      console.error('Błąd podczas usuwania produktu:', error);
      throw error;
    }
};

const deleteDishesVariants = async (variantId) => {
    const deleteDishesVariantsEndpoint = `${baseUrl}/DeleteDishesVariants/${variantId}/`;
  
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
  
      if (!refreshToken) {
        console.error('Brak refreshToken w AsyncStorage');
        // Obsłuż brak refreshToken, np. przekierowuj do ekranu logowania
        return;
      }
  
      const headers = {
        Cookie: `refreshToken=${refreshToken};`,
      };
  
      const response = await axios.delete(deleteDishesVariantsEndpoint, { headers });
  
      console.log('Odpowiedź z Django po usunięciu wariantu dania:', response.data);
  
      // Tutaj możesz przechowywać dane w zmiennej lub przekazać je dalej, w zależności od potrzeb
  
      return response.data;
    } catch (error) {
      console.error('Błąd podczas usuwania wariantu dania:', error);
      throw error;
    }
};

const updateCategory = async (categoryId, updatedData) => {
  const updateCategoryEndpoint = `${baseUrl}/UpdateCategory/${categoryId}/`;

  try {
    const refreshToken = await AsyncStorage.getItem('refreshToken');

    if (!refreshToken) {
      console.error('Brak refreshToken w AsyncStorage');
      // Obsłuż brak refreshToken, np. przekierowuj do ekranu logowania
      return;
    }

    const headers = {
      Cookie: `refreshToken=${refreshToken};`,
    };

    const response = await axios.patch(updateCategoryEndpoint, updatedData, { headers });

    console.log('Odpowiedź z Django po aktualizacji kategorii:', response.data);

    // Tutaj możesz przechowywać dane w zmiennej lub przekazać je dalej, w zależności od potrzeb

    return response.data;
  } catch (error) {
    console.error('Błąd podczas aktualizacji kategorii:', error);
    throw error;
  }
};

const updateDish = async (dishId, updatedData) => {
  const updateDishEndpoint = `${baseUrl}/UpdateDish/${dishId}/`;

  try {
    const refreshToken = await AsyncStorage.getItem('refreshToken');

    if (!refreshToken) {
      console.error('Brak refreshToken w AsyncStorage');
      // Obsłuż brak refreshToken, np. przekierowuj do ekranu logowania
      return;
    }

    const headers = {
      Cookie: `refreshToken=${refreshToken};`,
      'Content-Type': 'multipart/form-data',
    };

    const formData = new FormData();

    for (const key in updatedData) {
      if (Object.prototype.hasOwnProperty.call(updatedData, key)) {
        if (key === 'D_img') {
          // Jeśli klucz to 'image', dodaj go jako plik do formData
          const fileType = uri.split('.').pop();
          formData.append(key, {
            uri: updatedData[key],
            type: `image/${fileType}`, // Dostosuj do formatu obrazu
            name: `${dishId}_image.${fileType}`,
          });
        } else {
          // Dodaj pozostałe dane jako pola zwykłe
          formData.append(key, updatedData[key]);
        }
      }
    }

    const response = await axios.patch(updateDishEndpoint, formData, { headers });

    console.log('Odpowiedź z Django po aktualizacji dania:', response.data);

    // Tutaj możesz przechowywać dane w zmiennej lub przekazać je dalej, w zależności od potrzeb

    return response.data;
  } catch (error) {
    console.error('Błąd podczas aktualizacji dania:', error);
    throw error;
  }
};

const updateDishesProducts = async (dishesProductsId, updatedData) => {
  const updateDishesProductsEndpoint = `${baseUrl}/UpdateDishesProducts/${dishesProductsId}/`;

  try {
    const refreshToken = await AsyncStorage.getItem('refreshToken');

    if (!refreshToken) {
      console.error('Brak refreshToken w AsyncStorage');
      // Obsłuż brak refreshToken, np. przekierowuj do ekranu logowania
      return;
    }

    const headers = {
      Cookie: `refreshToken=${refreshToken};`,
    };

    const response = await axios.patch(updateDishesProductsEndpoint, updatedData, { headers });

    console.log('Odpowiedź z Django po aktualizacji produktu dania:', response.data);

    // Tutaj możesz przechowywać dane w zmiennej lub przekazać je dalej, w zależności od potrzeb

    return response.data;
  } catch (error) {
    console.error('Błąd podczas aktualizacji produktu dania:', error);
    throw error;
  }
};

const updateDishesVariants = async (dishesVariantsId, updatedData) => {
  const updateDishesVariantsEndpoint = `${baseUrl}/UpdateDishesVariants/${dishesVariantsId}/`;

  try {
    const refreshToken = await AsyncStorage.getItem('refreshToken');

    if (!refreshToken) {
      console.error('Brak refreshToken w AsyncStorage');
      // Obsłuż brak refreshToken, np. przekierowuj do ekranu logowania
      return;
    }

    const headers = {
      Cookie: `refreshToken=${refreshToken};`,
    };

    const response = await axios.patch(updateDishesVariantsEndpoint, updatedData, { headers });

    console.log('Odpowiedź z Django po aktualizacji wariantu dania:', response.data);

    // Tutaj możesz przechowywać dane w zmiennej lub przekazać je dalej, w zależności od potrzeb

    return response.data;
  } catch (error) {
    console.error('Błąd podczas aktualizacji wariantu dania:', error);
    throw error;
  }
};