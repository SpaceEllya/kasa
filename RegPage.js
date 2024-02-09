import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerUser } from './ApiComponent';

const RegPage = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegistration = async () => {
    try {
      const responseData = await registerUser(email, password);

      // Navigate to the desired page if login is successful
      navigation.navigate('LoginPage');
    } catch (error) {
      console.error('Błąd podczas logowania:', error);
      // Handle login error, show error message, etc.
    }
  };


  return (
    <View style={styles.container}>
      {/* Background image */}
      <Image
        source={require('./assets/background-image.png')}
        style={styles.backgroundImage}
      />

      {/* Container for the registration form */}
      <View style={styles.formContainer}>
        <Text style={styles.title}>Rejestracja</Text>

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
          <View style={styles.buttonContainerReg}>
            <Button title="Register" onPress={handleRegistration} color="#FA8E4D" />
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
    paddingHorizontal: 300,
    backgroundColor: 'rgba(64, 35, 35, 0.7)',
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
    backgroundColor: '#FFF',
    borderRadius: 50,
  },
  input: {
    height: 30,
    paddingHorizontal: 20,
    borderRadius: 10,
    color: '#7E7E7E',
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

export default RegPage;
