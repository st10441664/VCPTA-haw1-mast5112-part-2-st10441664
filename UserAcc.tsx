import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getAuth, signOut, updateEmail } from "firebase/auth";
import { db, storage } from "./firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";

const UserAcc: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const { isDarkMode } = route.params;
  const [userData, setUserData] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [originalName, setOriginalName] = useState<string>("");
  const [originalEmail, setOriginalEmail] = useState<string>("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [originalImageUri, setOriginalImageUri] = useState<string | null>(null);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDoc = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDoc);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData(data);
          setName(data.name || "");
          setOriginalName(data.name || "");
          setEmail(user.email || "");
          setOriginalEmail(user.email || "");
          setImageUri(data.profilePicture || null);
          setOriginalImageUri(data.profilePicture || null);
        } else {
          Alert.alert("Error", "User data not found!");
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleSelectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "You need to grant permission to access your photos."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0];
      setImageUri(selectedImage.uri);
    }
  };

  const handleSaveChanges = async () => {
    if (!user) return;

    try {
      let imageUrl = userData?.profilePicture;

      if (imageUri && imageUri !== userData?.profilePicture) {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const imageRef = ref(storage, `profilePictures/${user.uid}`);
        await uploadBytes(imageRef, blob);
        imageUrl = await getDownloadURL(imageRef);
      }

      const userDoc = doc(db, "users", user.uid);
      await setDoc(
        userDoc,
        { name, profilePicture: imageUrl },
        { merge: true }
      );

      if (user.email !== email) {
        await updateEmail(user, email);
      }

      Alert.alert("Success", "Profile updated successfully.");
      setEditing(false);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update profile.");
    }
  };

  const handleCancelChanges = () => {
    setName(originalName);
    setEmail(originalEmail);
    setImageUri(originalImageUri);
    setEditing(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate("Signin");
    } catch (error: any) {
      Alert.alert("Logout Error", error.message || "Failed to log out.");
    }
  };

  return (
    <LinearGradient
      colors={isDarkMode ? ["#333", "#354"] : ["white", "#354"]}
      style={styles.gradientBackground}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text
          style={[styles.heading, { color: isDarkMode ? "white" : "#000" }]}
        >
          Account Details
        </Text>
        <View style={styles.profileSection}>
          <Image
            source={{ uri: imageUri || "https://via.placeholder.com/120" }}
            style={styles.profilePic}
          />
        </View>

        {editing ? (
          <View style={styles.form}>
            <TextInput
              style={[styles.input, { color: isDarkMode ? "white" : "#000" }]}
              placeholder="Name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={[styles.input, { color: isDarkMode ? "white" : "#000" }]}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <View style={styles.actionButtons}>
              <Button title="Save Changes" onPress={handleSaveChanges} />
            </View>
            <View style={styles.actionButtons}>
              <Button title="Change Picture" onPress={handleSelectImage} />
            </View>
            <View style={styles.actionButtons}>
              <Button
                title="Cancel Changes"
                onPress={handleCancelChanges}
                color="gray"
              />
            </View>
          </View>
        ) : (
          <View style={styles.details}>
            <Text
              style={[
                styles.username,
                { color: isDarkMode ? "white" : "#000" },
              ]}
            >
              {userData?.name || "Loading..."}
            </Text>
            <Text
              style={[styles.email, { color: isDarkMode ? "white" : "#000" }]}
            >
              {user?.email || "Loading..."}
            </Text>
          </View>
        )}

        <View style={styles.actionButtons}>
          <Button title="Edit Profile" onPress={() => setEditing(true)} />
        </View>
        <View style={styles.actionButtons}>
          <Button title="Logout" onPress={handleLogout} color="red" />
        </View>
        <View style={styles.actionButtons}>
          <Button title="Go Back" onPress={() => navigation.goBack()} />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
  },
  heading: {
    fontSize: 32,
    fontWeight: "bold",
    marginVertical: 20,
  },
  profileSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  form: {
    width: "100%",
    alignItems: "center",
    marginVertical: 20,
  },
  input: {
    width: "80%",
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  details: {
    alignItems: "center",
    marginVertical: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
  },
  email: {
    fontSize: 16,
    color: "#666",
  },
  actionButtons: {
    width: "100%",
    marginTop: 30,
  },
});

export default UserAcc;
