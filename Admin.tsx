import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const Admin: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <LinearGradient
      colors={["white", "#354"]}
      style={styles.gradientBackground}
    >
      <View style={styles.container}>
        <Text style={styles.Header}>
          Welcome Back Chef{"\n"}Select What you would like to do today.
        </Text>
        <View style={styles.buttonContainer}>
          
          <View style={styles.buttonContainer}>
            <Button
              title="Add Items"
              onPress={() => navigation.navigate("Additem")}
            />

          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="Edit Menu"
              onPress={() => navigation.navigate("Editmenu")}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="Delete items"
              onPress={() => navigation.navigate("Delete")}
            />
          </View>
          <View style={styles.btnlogout}>
            <Button title="Log Out" onPress={() => navigation.goBack()}
            color="#922" />
          </View>
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
  Header: {
    marginTop: 20,
    fontSize: 35,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 90,
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  btnlogout: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginTop: 120,
  },
});
export default Admin;
