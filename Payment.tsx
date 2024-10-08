import React from "react";
import { View, Text, Button, StyleSheet, FlatList } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const Payment: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const { isDarkMode, cart } = route.params;

  return (
    <LinearGradient
      colors={isDarkMode ? ["#333", "#354"] : ["white", "#924"]}
      style={styles.gradientBackground}
    >
      <View style={styles.container}>
        <Text style={[styles.resultText, { color: isDarkMode ? "white" : "#333" }]}>Payment Screen</Text>

        <View style={styles.menucontainer}>
          <Text style={[styles.NumberOfItems, { color: isDarkMode ? "white" : "#333" }]}>Menu</Text>
          <View style={styles.menuItems}>
            {cart.length === 0 ? (
              <Text style={[styles.noItemsText, { color: isDarkMode ? "white" : "#333" }]}>No items in the cart.</Text>
            ) : (
              <FlatList
                data={cart}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <Text style={styles.menuItem}>
                    {item.newDishName} - R {item.price}
                  </Text>
                )}
              />
            )}
          </View>
        </View>

        <Button title="Pay" color="#0F52BA" />

        <View style={styles.buttonContainer}>
          <View style={styles.ButtonInnerContainer}>
            <Button
              title="Account"
              onPress={() => navigation.navigate("Useraccount", { isDarkMode })}
              color="#0F52BA"
            />
          </View>
          <View style={styles.ButtonInnerContainer}>
            <Button
              title="Home"
              onPress={() => navigation.navigate("Userhome", { isDarkMode })}
              color="#0F52BA"
            />
          </View>
          <View style={styles.ButtonInnerContainer}>
            <Button
              title="Full Menu"
              onPress={() => navigation.navigate("SortMenu", { isDarkMode })}
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
  resultText: {
    marginBottom: 40,
    fontSize: 40,
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
  menucontainer: {
    flexDirection: "column",
    borderWidth: 3,
    borderColor: "#0F52BA",
    marginBottom: 20,
    borderRadius: 5,
  },
  menuItems: {
    flexDirection: "column",
    borderTopWidth: 3,
    borderTopColor: "#0F52BA",
  },
  NumberOfItems: {
    marginTop: 10,
    fontSize: 20,
    marginBottom: 5,
    fontWeight: "bold",
    textAlign: "center",

  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontSize: 18,
    textAlign: "center",
  },
  noItemsText: {
    fontSize: 18,
    textAlign: "center",
    margin: 20,
  },
});

export default Payment;
