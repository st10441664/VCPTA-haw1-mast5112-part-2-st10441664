import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { db } from "./firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

type Course = {
  id: number;
  name: string;
};

type MenuItem = {
  id: string;
  newDishName: string;
  description: string;
  price: number;
  selectedCourses: number[];
};

const SortMenu: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const { isDarkMode } = route.params;

  const courses: Course[] = [
    { id: 1, name: "Starter" },
    { id: 2, name: "Main" },
    { id: 3, name: "Dessert" },
    { id: 4, name: "Drink" },
  ];

  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [sortBy, setSortBy] = useState<string>("");
  const [cart, setCart] = useState<MenuItem[]>([]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const menuRef = collection(db, "dishes");
        const querySnapshot = await getDocs(menuRef);
        const items: MenuItem[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as MenuItem[];

        setMenuItems(items);
        setFilteredItems(items);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const handleCourseSelection = (id: number) => {
    setSelectedCourses((prev) =>
      prev.includes(id)
        ? prev.filter((courseId) => courseId !== id)
        : [...prev, id]
    );
  };

  useEffect(() => {
    let filtered = menuItems;

    if (selectedCourses.length > 0) {
      filtered = menuItems.filter((item) =>
        item.selectedCourses.some((courseId) =>
          selectedCourses.includes(courseId)
        )
      );
    }

    if (sortBy === "priceAsc") {
      filtered = filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "priceDesc") {
      filtered = filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      filtered = filtered.sort((a, b) =>
        a.newDishName.localeCompare(b.newDishName)
      );
    }

    setFilteredItems(filtered);
  }, [selectedCourses, menuItems, sortBy]);

  const handleItemPress = (item: MenuItem) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleAddToCart = (item: MenuItem) => {
    setCart((prevCart) => [...prevCart, item]);
    console.log(`${item.newDishName} added to cart`);
  };

  const handleGoToPayment = () => {
    navigation.navigate("Payment", { isDarkMode, cart });
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading menu items...</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={isDarkMode ? ["#333", "#354"] : ["white", "#354"]}
      style={styles.gradientBackground}
    >
      <View style={styles.container}>
        <Text
          style={[styles.subtitle, { color: isDarkMode ? "white" : "#333" }]}
        >
          On the menu we have
        </Text>
        <Text style={[styles.text, { color: isDarkMode ? "white" : "#333" }]}>
          Find what you're looking for faster, Try a filter or sort.
        </Text>

        {courses.map((course) => (
          <TouchableOpacity
            key={course.id}
            style={styles.checkboxContainer}
            onPress={() => handleCourseSelection(course.id)}
          >
            <View
              style={[
                styles.checkbox,
                selectedCourses.includes(course.id) && styles.checkboxChecked,
              ]}
            />
            <Text
              style={[
                styles.checkboxLabel,
                { color: isDarkMode ? "white" : "#333" },
                , { color: isDarkMode ? "white" : "#333" }]}
            >
              {selectedCourses.includes(course.id) ? "Selected" : course.name}
            </Text>
          </TouchableOpacity>
        ))}

        <View style={styles.sortButtons}>
          <Button
            title="Sort by Price Asc"
            onPress={() => setSortBy("priceAsc")}
          />
          <Button
            title="Sort by Price Desc"
            onPress={() => setSortBy("priceDesc")}
          />
          <Button title="Sort by Name" onPress={() => setSortBy("name")} />
        </View>

        <View style={styles.menuContainer}>
          <Text style={[styles.numberOfItems, { color: isDarkMode ? "white" : "#333" }]}>What's on the menu today</Text>
          {filteredItems.length === 0 ? (
            <Text>No menu items found.</Text>
          ) : (
            <FlatList
              data={filteredItems}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.menuItems}>
                  <TouchableOpacity onPress={() => handleItemPress(item)}>
                    <Text style={[styles.menuItemText, { color: isDarkMode ? "white" : "#333" }]}>
                      {item.newDishName} - R {item.price}
                    </Text>
                  </TouchableOpacity>
                  <Button
                    title="Add to Cart"
                    onPress={() => handleAddToCart(item)}
                  />
                </View>
              )}
            />
          )}
        </View>

        {selectedItem && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={[styles.modalTitle, { color: isDarkMode ? "white" : "#333" }]}>
                  {selectedItem.newDishName}
                </Text>
                <Text style={styles.modalText}>
                  Description: {selectedItem.description}
                </Text>
                <Text style={[styles.modalText, { color: isDarkMode ? "white" : "#333" }]}>
                  Price: R {selectedItem.price}
                </Text>
                <Button title="Close" onPress={() => setModalVisible(false)} />
              </View>
            </View>
          </Modal>
        )}

        <View style={styles.buttonContainer}>
          <View style={styles.buttonInnerContainer}>
            <Button
              title="Account"
              onPress={() => navigation.navigate("Useraccount", { isDarkMode })}
              color="#0F52BA"
            />
          </View>
          <View style={styles.buttonInnerContainer}>
            <Button
              title="Home"
              onPress={() => navigation.navigate("Userhome", { isDarkMode })}
              color="#0F52BA"
            />
          </View>
          <View style={styles.buttonInnerContainer}>
            <Button
              title="Payment Screen"
              onPress={handleGoToPayment}
              color="#0F52BA"
            />
          </View>
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
  text: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  menuContainer: {
    flexDirection: "column",

    marginVertical: 5,

    borderWidth: 3,
  },
  menuItemText: {
    fontSize: 18,
    textAlign: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#000",
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: "#0F52BA",
  },
  checkboxLabel: {
    fontSize: 16,
  },
  sortButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  menuItems: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
  },
  subtitle: {
    fontSize: 50,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
    textDecorationLine: "underline",
  },
  numberOfItems: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  buttonInnerContainer: {
    width: "30%",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  modalText: {
    fontSize: 18,
    marginVertical: 10,
  },
});

export default SortMenu;
