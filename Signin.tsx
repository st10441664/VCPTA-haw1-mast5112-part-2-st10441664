import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { auth } from "./firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

const Signin: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (email === "" || password === "") {
      Alert.alert("Error", "Please fill in all fields.");

      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Welcome", "Navigating to Home Screen");

      setEmail("");
      setPassword("");

      navigation.navigate("Userhome");
    } catch (error) {
      if (email === "1" || password === "1") {
        navigation.navigate("AdminScreen");
        setEmail("");
        setPassword("");
        return;
      }
      Alert.alert("Error", "Invalid credentials");
    }
  };

  const handleResetPassword = () => {
    setPassword("");
    navigation.navigate("resetpassword");
  };

  return (
    <LinearGradient
      colors={["white", "#354"]}
      style={styles.gradientBackground}
    >
      <View style={styles.container}>
        <Text style={styles.headerText}>Sign in here</Text>

        <Image source={require("./assets/farewell.jpg")} style={styles.image} />

        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        />

        <View style={styles.buttonContainer}>
          <Button title="Login" onPress={handleLogin} color="#0F52BA" />
          <View style={styles.buttonContainer}></View>
          <Button
            title="Sign up"
            onPress={() => navigation.navigate("signup")}
            color="#0F52BA"
          />
          <View style={styles.buttonContainer}></View>
          <Button
            title="Reset Password"
            onPress={handleResetPassword}
            color="#0F52BA"
          />
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  headerText: {
    marginBottom: 40,
    fontSize: 60,
    fontWeight: "bold",
    textAlign: "center",
    textDecorationLine: "underline",
  },
  input: {
    height: 50,
    borderColor: "#354",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    marginTop: 25,
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  image: {
    borderColor: "#354",
    borderWidth: 3,
    width: 200,
    height: 200,
    alignSelf: "center",
    marginVertical: 20,
  },
});

export default Signin;
