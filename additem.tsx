import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { db } from "./firebaseConfig";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

type Course = {
  id: number;
  name: string;
};

const Additem: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [NewDishName, setNewDishName] = useState("");
  const [Description, setDescription] = useState("");
  const [Price, setPrice] = useState("");
  const courses: Course[] = [
    { id: 1, name: "Starter" },
    { id: 2, name: "Main" },
    { id: 3, name: "Desert" },
    { id: 4, name: "Drink" },
  ];
  const [selectedCourses, setSelectedCourses] = useState<{ id: number }[]>([]);

  const handleAddDish = async () => {
    if (NewDishName === "" || Description === "" || Price === "") {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    const existingDishQuery = query(
      collection(db, "dishes"),
      where("newDishName", "==", NewDishName)
    );

    const existingDishSnapshot = await getDocs(existingDishQuery);

    if (!existingDishSnapshot.empty) {
      Alert.alert("Error", "This dish already exists.");
      return;
    }

    try {
      await addDoc(collection(db, "dishes"), {
        newDishName: NewDishName,
        description: Description,
        price: Price,
        selectedCourses: selectedCourses,
      });

      Alert.alert("Success", "Dish added successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error adding dish: ", error);
      Alert.alert("Error", "Could not add dish. Try again.");
    }
  };

  function handleCourseSelection(id: number) {
    const course = courses.find((course) => course.id === id);
    if (course) {
      setSelectedCourses([
        {
          id: course.id,
        },
      ]);
    }
  }

  return (
    <LinearGradient
      colors={["white", "#354"]}
      style={styles.gradientBackground}
    >
      <View style={styles.container}>
        <Text style={styles.headerText}>What would you like to Add today</Text>

        <View style={styles.EditImg}>
          <View style={styles.buttonContainer}>
            <Button title="Add Dish Image" onPress={() => {}} />
          </View>
          <Image source={require("./assets/icon.png")} style={styles.image} />
        </View>

        <TextInput
          style={styles.input}
          placeholder="New Dish Name"
          onChangeText={setNewDishName}
          value={NewDishName}
        />
        <TextInput
          style={styles.input}
          placeholder="Dish description"
          onChangeText={setDescription}
          value={Description}
        />
        <TextInput
          style={styles.input}
          placeholder="Dish price"
          onChangeText={setPrice}
          value={Price}
          keyboardType="numeric"
        />

        <Text style={styles.subtitle}>Select Courses</Text>
        {courses.map((course) => (
          <TouchableOpacity
            key={course.id}
            style={styles.checkboxContainer}
            onPress={() => handleCourseSelection(course.id)}
          >
            <View
              style={[
                styles.checkbox,
                selectedCourses.some((sc) => sc.id === course.id) &&
                  styles.checkboxChecked,
              ]}
            />
            <Text style={styles.checkboxLabel}>
              {selectedCourses.some((sc) => sc.id === course.id)
                ? "Selected"
                : course.name}
            </Text>
          </TouchableOpacity>
        ))}

        <Button title="Add" onPress={handleAddDish} />

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
    marginBottom: 30,
    fontSize: 50,
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
  subtitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
    textDecorationLine: "underline",
  },
  buttonContainer: {
    marginTop: 90,
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: 12,
    width: 70,
    marginLeft: 80,
  },
  EditImg: {
    marginTop: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    marginRight: 80,
  },
  image: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginVertical: 20,
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

export default Additem;
