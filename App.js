import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { FontAwesome5 } from "@expo/vector-icons";

// Import des écrans
import ConnexionScreen from "./screens/ConnexionScreen";
import HomeScreen from "./screens/HomeScreen";
import ProjectsScreen from "./screens/ProjectsScreen";
import DetailProjectScreen from "./screens/DetailProjectScreen";
import MessagesScreen from "./screens/MessagesScreen";
import MonCompteScreen from "./screens/MonCompteScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          // pour mettre le casque car pas dans ionicons
          if (route.name === "Projet") {
            return <FontAwesome5 name="hard-hat" size={size} color={color} />;
          }
          // pour les autres onglets ionicons
          let iconName;
          switch (route.name) {
            case "DashBoard":
              iconName = "grid-outline";
              break;
            case "Messages":
              iconName = "chatbubbles";
              break;
            case "MonCompte":
              iconName = "person";
              break;
            default:
              iconName = "ellipse-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="DashBoard" component={HomeScreen} />
      <Tab.Screen name="Projet" component={ProjectsScreen} />
      <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen name="MonCompte" component={MonCompteScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Connexion">
          <Stack.Screen
            name="Connexion"
            component={ConnexionScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DetailProject"
            component={DetailProjectScreen}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
