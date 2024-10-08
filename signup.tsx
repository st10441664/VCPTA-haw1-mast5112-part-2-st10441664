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
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { db } from "./firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

const Signup: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    if (name === "" || email === "" || password === "") {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    const auth = getAuth();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await sendEmailVerification(user);

      Alert.alert(
        "Verification Email Sent",
        "Please verify your email before proceeding."
      );

      const checkEmailVerification = async () => {
        await user.reload();

        if (user.emailVerified) {
          await setDoc(doc(db, "users", user.uid), {
            name,
            email,
          });
          Alert.alert("Sign Up Successful", `Welcome, ${name}!`);
          navigation.navigate("Home");
        } else {
          Alert.alert(
            "Email not verified",
            "Please verify your email to complete the sign-up process."
          );
        }
      };

      setTimeout(checkEmailVerification, 5000);
    } catch (error: any) {
      Alert.alert(
        "Sign Up Error",
        error.message || "An error occurred during sign up."
      );
    }
  };

  return (
    <LinearGradient
      colors={["white", "#354"]}
      style={styles.gradientBackground}
    >
      <View style={styles.container}>
        <Text style={styles.headerText}>Sign Up</Text>

        <Image source={require("./assets/farewell.jpg")} style={styles.image} />

        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <View style={styles.buttonContainer}>
          <Button title="Sign Up" onPress={handleSignup} color="#0F52BA" />
          <View style={styles.buttonContainer}></View>
          <Button
            title="Forgot Password?"
            onPress={() => navigation.navigate("resetpassword")}
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
  gradientBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  headerText: {
    marginBottom: 30,
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

export default Signup;
