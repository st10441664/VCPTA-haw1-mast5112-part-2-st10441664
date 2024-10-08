import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { db } from "./firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

type MenuItem = {
  id: string;
  newDishName: string;
  description: string;
  price: number;
};

const UserHome: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<MenuItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

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
      } catch (error) {
        console.error("Error fetching menu items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const handleAddToCart = (item: MenuItem) => {
    setCart((prevCart) => [...prevCart, item]);
    console.log(`${item.newDishName} added to cart`);
  };

  const openDescriptionModal = (item: MenuItem) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
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
        <Text style={[styles.Text, { color: isDarkMode ? "white" : "#333" }]}>
          Welcome back
        </Text>
       
        <Text
          style={[
            styles.NumberOfItems,
            { color: isDarkMode ? "white" : "#333" },
          ]}
        >
          There are {menuItems.length} items on the menu today
        </Text>
        <Switch
          value={isDarkMode}
          onValueChange={toggleTheme}
          thumbColor={isDarkMode ? "#559" : "white"}
          trackColor={{ false: "#489", true: "#889" }}
        />

        <View style={styles.menucontainer}>
          <Text
            style={[
              styles.NumberOfItems,
              { color: isDarkMode ? "white" : "#333" },
            ]}
          >
            What's on the menu today
          </Text>
          <FlatList
            data={menuItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.menuItems}>
                <TouchableOpacity onPress={() => openDescriptionModal(item)}>
                  <Text
                    style={[
                      styles.NumberOfItems,
                      { color: isDarkMode ? "white" : "#333" },
                    ]}
                  >
                    {item.newDishName} - R {item.price}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => handleAddToCart(item)}
                >
                  <Text style={styles.addButtonText}>Add to Cart</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>

        <Text
          style={[styles.AvPrice, { color: isDarkMode ? "white" : "#333" }]}
        >
          The average price of our courses:{"\n"}
          Starter: R 63{"\n"}Main: R 31{"\n"}Dessert: R 46
        </Text>

        <View style={styles.buttonContainer}>
          <View style={styles.ButtonInnerContainer}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => navigation.navigate("Useraccount", { isDarkMode })}
            >
              <Text style={styles.navButtonText}>Account</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.ButtonInnerContainer}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => navigation.navigate("SortMenu", { isDarkMode })}
            >
              <Text style={styles.navButtonText}>Full Menu</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.ButtonInnerContainer}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() =>
                navigation.navigate("Payment", { isDarkMode, cart })
              }
            >
              <Text style={styles.navButtonText}>Payment Screen</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {selectedItem && (
                <>
                  <Text style={styles.modalTitle}>
                    {selectedItem.newDishName}
                  </Text>
                  <Text style={styles.modalDescription}>
                    {selectedItem.description}
                  </Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={closeModal}
                  >
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    alignContent: "center",
  },
  gradientBackground: {
    flex: 1,
  },

  Text: {
    marginTop: 20,
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
  },
  menucontainer: {
    flexDirection: "column",
    borderWidth: 3,
    marginTop: 20,
    height: 380,
  },
  menuContainer: {
    flexDirection: "column",

    marginVertical: 5,

    borderWidth: 3,
  },
  menuItems: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
  },
  NumberOfItems: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
  },
  addButton: {
    marginTop: 10,
    backgroundColor: "#0F52BA",
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: "white",
    textAlign: "center",
  },
  AvPrice: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    width: 170,
    marginTop: 20,
  },
  ButtonInnerContainer: {
    flexDirection: "column",
    width: 123,
  },
  navButton: {
    backgroundColor: "#0F52BA",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  navButtonText: {
    color: "white",
    textAlign: "center",
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
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: "#0F52BA",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    textAlign: "center",
  },
});

export default UserHome;
