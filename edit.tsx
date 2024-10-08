import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { db } from "./firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

type Course = {
  id: number;
  name: string;
};

const Edit: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [DishName, setDishName] = useState("");
  const [NewDishName, setNewDishName] = useState("");
  const [Description, setDescription] = useState("");
  const [Price, setPrice] = useState("");
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const [dishId, setDishId] = useState("");
  const [isEditable, setIsEditable] = useState(false);

  const courses: Course[] = [
    { id: 1, name: "Starter" },
    { id: 2, name: "Main" },
    { id: 3, name: "Dessert" },
    { id: 4, name: "Drink" },
  ];

  const handleSearchDish = async () => {
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
        setIsEditable(false);
        return;
      }

      querySnapshot.forEach((document) => {
        const dishData = document.data();
        setDishId(document.id);
        setNewDishName(dishData.newDishName);
        setDescription(dishData.description);
        setPrice(dishData.price);
        setSelectedCourses(dishData.selectedCourses || []);
        setIsEditable(true);
      });
    } catch (error) {
      console.error("Error searching for dish: ", error);
      Alert.alert("Error", "Failed to search for dish.");
    }
  };

  const handleSaveChanges = async () => {
    if (!NewDishName || !Description || !Price) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      const dishRef = doc(db, "dishes", dishId);

      await updateDoc(dishRef, {
        newDishName: NewDishName,
        description: Description,
        price: Price,
        selectedCourses: selectedCourses,
      });

      Alert.alert("Success", "Dish updated successfully.");
      navigation.goBack();
    } catch (error) {
      console.error("Error saving changes: ", error);
      Alert.alert("Error", "Failed to save changes.");
    }
  };

  function handleCourseSelection(id: number) {
    setSelectedCourses([id]);
    console.log("Updated Selected Courses:", [id]);
  }

  return (
    <LinearGradient
      colors={["white", "#354"]}
      style={styles.gradientBackground}
    >
      <View style={styles.container}>
        <Text style={styles.headerText}>
          What would you like to edit today?
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter dish name"
          onChangeText={setDishName}
          value={DishName}
        />

        <Button title="Search" onPress={handleSearchDish} />

        {isEditable && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Edit Dish Name"
              onChangeText={setNewDishName}
              value={NewDishName}
            />
            <TextInput
              style={styles.input}
              placeholder="Edit Dish description"
              onChangeText={setDescription}
              value={Description}
            />
            <TextInput
              style={styles.input}
              placeholder="Edit Dish price"
              onChangeText={setPrice}
              value={Price}
              keyboardType="numeric"
            />

            <Text style={[styles.subtitle]}>Edit Courses</Text>

            {courses.map((course) => (
              <TouchableOpacity
                key={course.id}
                style={styles.checkboxContainer}
                onPress={() => handleCourseSelection(course.id)}
              >
                <View
                  style={[
                    styles.checkbox,
                    selectedCourses.includes(course.id) &&
                      styles.checkboxChecked,
                  ]}
                />
                <Text style={styles.checkboxLabel}>
                  {selectedCourses.includes(course.id)
                    ? "Selected"
                    : course.name}
                </Text>
              </TouchableOpacity>
            ))}

            <Button title="Save Changes" onPress={handleSaveChanges} />
          </>
        )}
        <View style={styles.ButtonContainer}></View>
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
  ButtonContainer: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  headerText: {
    marginBottom: 30,
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    textDecorationLine: "underline",
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
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
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderColor: "#333",
    borderWidth: 2,
    borderRadius: 5,
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: "#383",
  },
  checkboxLabel: {
    fontSize: 16,
  },
});

export default Edit;
