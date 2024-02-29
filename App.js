import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Login from "./Login";
import Orders from "./Orders";
import Kitchen from "./Kitchen";
import Management from "./Management";
import Restaurant from "./Restaurant";
import Categories from "./Categories";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen
            name="Orders"
            component={Orders}
            options={{ headerLeft: () => null }}
          />
          <Stack.Screen name="Kitchen" component={Kitchen} />
          <Stack.Screen name="Management" component={Management} />
          <Stack.Screen name="Restaurant" component={Restaurant} />
          <Stack.Screen name="Categories" component={Categories} />
        </>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
