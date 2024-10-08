import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CartProvider } from "./cart";
import signup from "./signup";
import Signin from "./Signin";
import ResetPassword from "./resetpassword";
import UserHome from "./Userhome";
import UserAcc from "./UserAcc";
import SortMenu from "./SortMenu";
import Payment from "./Payment";
import Editmenu from "./edit";
import Additem from "./additem";
import AdminScreen from "./Admin";
import Delt from "./Delete";

const Stack = createNativeStackNavigator();

const App: React.FC = () => {
  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Signin">
          <Stack.Screen
            name="Signin"
            component={Signin}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="signup"
            component={signup}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="resetpassword"
            component={ResetPassword}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Userhome"
            component={UserHome}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Useraccount"
            component={UserAcc}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SortMenu"
            component={SortMenu}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Payment"
            component={Payment}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Editmenu"
            component={Editmenu}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Additem"
            component={Additem}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AdminScreen"
            component={AdminScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Delete"
            component={Delt}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
};

export default App;
