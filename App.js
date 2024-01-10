import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from './LoginPage'; 
import KuchniaPage from './KuchniaPage';
import ZarzadzaniePage from './ZarzadzaniePage';
import Restauracja from './Restauracja';
import Kategorie from './Kategorie';

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginPage} />
            <Stack.Screen name="KuchniaPage" component={KuchniaPage} />
            <Stack.Screen name="ZarzadzaniePage" component={ZarzadzaniePage} />
            <Stack.Screen name="Restauracja" component={Restauracja} />  
            <Stack.Screen name="Kategorie" component={Kategorie} />  
          </Stack.Navigator>
        </NavigationContainer>
      );
    };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
