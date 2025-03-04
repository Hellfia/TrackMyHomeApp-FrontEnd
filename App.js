import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { FontAwesome5 } from "@expo/vector-icons";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore, persistReducer } from "redux-persist";
import { Provider } from "react-redux";
import constructor from "./reducers/constructor";

// Import des écrans
import ConnexionScreen from "./screens/ConnexionScreen";
import DashboardScreen from "./screens/DashboardScreen";
import ProjectsScreen from "./screens/ProjectsScreen";
import DetailProjectScreen from "./screens/DetailProjectScreen";
import MessagesScreen from "./screens/MessagesScreen";
import ProfilScreen from "./screens/ProfilScreen";
import ConnexionClientScreen from "./screens/ConnexionClientScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const reducers = combineReducers({ constructor });
const persistConfig = { key: "TrackMyHome", storage };

const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

const persistor = persistStore(store);

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
            case "Dashboard":
              iconName = "grid-outline";
              break;
            case "Messages":
              iconName = "chatbubbles";
              break;
            case "Profil":
              iconName = "person";
              break;
            default:
              iconName = "ellipse-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Projet" component={ProjectsScreen} />
      <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen name="Profil" component={ProfilScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <SafeAreaProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Connexion">
              <Stack.Screen
                name="Connexion"
                component={ConnexionScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ConnexionClient"
                component={ConnexionClientScreen}
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
      </PersistGate>
    </Provider>
  );
}
