import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { db } from "./firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

const Delt: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [DishName, setDishName] = useState("");

  const handleDeleteDish = async () => {
    if (DishName === "") {
      Alert.alert("Error", "Please enter a dish name.");
      return;
    }

    try {
      const dishesRef = collection(db, "dishes");
      const dishQuery = query(dishesRef, where("newDishName", "==", DishName));

      const querySnapshot = await getDocs(dishQuery);

      if (querySnapshot.empty) {
        Alert.alert("Error", "Dish not found.");
        return;
      }

      querySnapshot.forEach(async (document) => {
        await deleteDoc(doc(db, "dishes", document.id));
      });

      Alert.alert("Success", "Dish deleted successfully.");
      setDishName("");
    } catch (error) {
      console.error("Error deleting dish: ", error);
      Alert.alert("Error", "Failed to delete dish. Please try again.");
    }
  };

  return (
    <LinearGradient
      colors={["white", "#354"]}
      style={styles.gradientBackground}
    >
      <View style={styles.container}>
        <Text style={styles.headerText}>
          What would you like to delete today?
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter dish name"
          onChangeText={setDishName}
          value={DishName}
        />

        <Button title="Delete" onPress={handleDeleteDish} />

        <View style={styles.EditImg}></View>

        <Button
          title="Go Back"
          onPress={() => navigation.goBack()}
          color="#922"
        />
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
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  EditImg: {
    marginTop: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    marginRight: 80,
  },
});

export default Delt;
