import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const ResetPassword: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [email, setEmail] = useState("");

  const handleSendEmail = async () => {
    const auth = getAuth();

    if (email === "") {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        "Verification Email Sent",
        `A verification email has been sent to ${email}`
      );
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to send reset email.");
    }
  };

  return (
    <LinearGradient
      colors={["white", "#354"]}
      style={styles.gradientBackground}
    >
      <View style={styles.container}>
        <Text style={styles.headerText}>Password Recovery</Text>

        <Image source={require("./assets/farewell.jpg")} style={styles.image} />

        <Text style={styles.instructionsText}>
          Please enter your email address to receive an Email with your reset
          link.
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <View style={styles.buttonContainer}>
          <Button
            title="Send Email"
            onPress={handleSendEmail}
            color="#0F52BA"
          />
          <View style={styles.buttonContainer}></View>
          <Button
            title="Need an account? Sign Up"
            onPress={() => navigation.navigate("signup")}
            color="#0F52BA"
          />
          <View style={styles.buttonContainer}></View>
          <Button
            title="Already have an account? Sign In"
            onPress={() => navigation.navigate("Signin")}
            color="#0F52BA"
          />
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  gradientBackground: {
    flex: 1,
  },
  headerText: {
    marginTop: -70,
    marginBottom: 30,
    fontSize: 50,
    fontWeight: "bold",
    textAlign: "center",
    textDecorationLine: "underline",
  },
  instructionsText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
  },
  input: {
    height: 50,
    borderColor: "#354",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  buttonContainer: {
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

export default ResetPassword;
