import { FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Provider, useSelector } from "react-redux";
import { persistReducer, persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import client from "./reducers/client";
import constructeur from "./reducers/constructeur";

// Import des écrans
import AddProjectScreen from "./screens/AddProjectScreen";
import ClientDetails from "./screens/ClientDetails";
import ConnexionClientScreen from "./screens/ConnexionClientScreen";
import ConnexionScreen from "./screens/ConnexionScreen";
import CreatCraftsmanScreen from "./screens/CreatCraftsmanScreen";
import DashboardScreen from "./screens/DashboardScreen";
import DetailProjectScreen from "./screens/DetailProjectScreen";
import DocumentsScreen from "./screens/DocumentsScreen";
import IntervenantsScreen from "./screens/IntervenantsScreen";
import MessagesScreen from "./screens/MessagesScreen";
import ProAccCreation from "./screens/ProAccCreation";
import ProfilScreen from "./screens/ProfilScreen";
import ProjectsScreen from "./screens/ProjectsScreen";
import UpdateProfileScreen from "./screens/UpdateProfileScreen";
import UpdateDetails from "./screens/constructor/UpdateDetails";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const reducers = combineReducers({ client, constructeur });
const persistConfig = { key: "TrackMyHome2", storage: AsyncStorage };

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
          if (route.name === "Projet") {
            return <FontAwesome5 name="hard-hat" size={size} color={color} />;
          }
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

function RootNavigator() {
  const token = useSelector((state) => state.constructeur.value.token);
  return (
    <Stack.Navigator>
      {token ? (
        <>
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DetailProject"
            component={DetailProjectScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Intervenants"
            component={IntervenantsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddProject"
            component={AddProjectScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="UpdateProfile"
            component={UpdateProfileScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CreateCraftsman"
            component={CreatCraftsmanScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ClientDetails"
            component={ClientDetails}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="UpdateDetails"
            component={UpdateDetails}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Documents"
            component={DocumentsScreen}
            options={{ headerShown: false }}
          />
        </>
      ) : (
        <>
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
            name="ProAccCreation"
            component={ProAccCreation}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <SafeAreaProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}
