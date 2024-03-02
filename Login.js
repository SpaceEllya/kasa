import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { loginUser, refreshAccessToken } from "./ApiComponent";

const Login = ({ route }) => {
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tokenData = await refreshAccessToken();
        // Jeśli token zostanie odebrany, oznacza to, że użytkownik jest już autoryzowany
        if (tokenData && tokenData.token) {
          navigation.navigate("Orders");
        } else {
          console.error("User not login:", error);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (route.params && route.params.username) {
      setUsername(route.params.username);
    }
  }, [route.params]);

  const handleLogin = async () => {
    try {
      const user = username ? username : email;
      await loginUser(user, password);
      navigation.navigate("Orders");
    } catch (error) {
      console.error("Error during login:", error);
      setError("Invalid username or password. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("./assets/background-image.png")}
        style={styles.backgroundImage}
      />
      <View style={styles.formContainer}>
        <Text style={styles.title}>Sign in</Text>
        {!username && (
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, error && styles.inputError]}
              placeholderTextColor="#7E7E7E"
              placeholder="Username"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>
        )}
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, error && styles.inputError]}
            placeholderTextColor="#7E7E7E"
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        {error && (
          <View>
            <Text style={[styles.errorMessage]}>
              Incorrect login or password
            </Text>
          </View>
        )}
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
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },

  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },

  formContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 300,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 20,
    height: "100%",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#FFF",
    textAlign: "center",
  },

  inputContainer: {
    width: 250,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 50,
  },

  input: {
    height: 30,
    paddingHorizontal: 20,
    borderRadius: 10,
    color: "#fff",
  },

  buttonContainers: {
    flexDirection: "row",
    gap: 10,
  },

  buttonContainerLog: {
    marginTop: 10,
    borderRadius: 50,
    overflow: "hidden",
  },

  inputError: {
    borderColor: "red",
    borderWidth: 2,
  },

  errorMessage: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
    fontSize: 16,
  },
});

export default Login;
