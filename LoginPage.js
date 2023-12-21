// LoginPage.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Импортируем useNavigation

const LoginPage = () => {
  const navigation = useNavigation(); // Используем useNavigation для доступа к объекту навигации

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Здесь вы можете добавить логику для обработки входа
    console.log('Email:', email);
    console.log('Password:', password);
    navigation.navigate('KuchniaPage');
  };

  return (
    <View style={styles.container}>
      {/* Фоновая картинка */}
      <Image
        source={require('./assets/background-image.png')} // Путь к вашей фоновой картинке
        style={styles.backgroundImage}
      />

      {/* Контейнер для формы входа */}
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

        <View style={styles.buttonContainer}>
          <Button title="Login" onPress={handleLogin} color="#000" />
        </View>
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    width: width,
    height: height,
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
  buttonContainer: {
    width: 230,
    marginTop: 10,
    borderRadius: 50, // Закругление углов кнопки
    overflow: 'hidden', // Обрезаем фон за пределами радиуса кнопки
  },
  button: {
    borderRadius: 50,
  },
});

export default LoginPage;
