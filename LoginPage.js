import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {loginUser} from './ApiComponent';  // Импортируем функцию loginUser

const LoginPage = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const responseData = await loginUser(email, password);
      navigation.navigate('KuchniaPage');
      
    } catch (error) {
      console.error('Error during login:', error);
      // Handle login error, show error message, etc.
    }
  };

 

  return (
    <View style={styles.container}>
      <Image
        source={require('./assets/background-image.png')}
        style={styles.backgroundImage}
      />

      <View style={styles.formContainer}>
        <Text style={styles.title}>Zaloguj się</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View style={styles.buttonContainers}>
          <View style={styles.buttonContainerLog}>
            <Button title="Login" onPress={handleLogin} color="#FA8E4D" />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width:'100%',
    height:'100%',
  },
  backgroundImage: {
    position: 'absolute',
    width:'100%',
    height:'100%',
  },
  formContainer: {
    flex: 1,
    
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 300, // Отступы слева и справа
    backgroundColor: 'rgba(64, 35, 35, 0.7)', // Прозрачный фон с вашими параметрами
    padding: 20,
    height: '100%',
  
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFF',
    textAlign: 'center',
  },
  inputContainer: {
    width: 250,
    marginBottom: 15,
    backgroundColor: '#FFF', // Белый фон для полей ввода
    borderRadius: 50, // Закругление углов
  },
  input: {
    height: 30,
    paddingHorizontal: 20,
    borderRadius: 10,
    color: '#7E7E7E', // Черный цвет текста
  },
  buttonContainers:{
    flexDirection:'row',
    gap:10,
  },
  buttonContainerLog: {
    marginTop: 10,
    borderRadius: 50, // Закругление углов кнопки
    overflow: 'hidden', // Обрезаем фон за пределами радиуса кнопки
  },
  buttonContainerReg: {
    marginTop: 10,
    borderRadius: 50, // Закругление углов кнопки
    overflow: 'hidden', // Обрезаем фон за пределами радиуса кнопки
  },
  button: {
    borderRadius: 50,
  },
});

export default LoginPage;
