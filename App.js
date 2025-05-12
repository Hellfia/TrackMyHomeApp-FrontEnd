import React from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { Provider, useSelector } from "react-redux";
import { persistReducer, persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar, ActivityIndicator, View, Text } from "react-native";

// reducers
import client from "./reducers/client";
import constructeur from "./reducers/constructeur";

// écrans
import DashboardScreen from "./screens/DashboardScreen";
import ProjectsScreen from "./screens/ProjectScreen";
import ClientRoomsScreen from "./screens/constructor/message/ClientRoomsScreen";
import MessageClient from "./screens/client/message/MessageClient";
import MessageConstructeur from "./screens/constructor/message/MessageConstructeur";
import Artisans from "./screens/constructor/artisans/Artisans";
import DocumentsClient from "./screens/client/documents/DocumentsClient";
import UpdateProfileClient from "./screens/client/profil/UpdateProfileClient";
import UpdateDetailsClient from "./screens/client/project/UpdateDetailsClient";
import UpdateProfileConstructeur from "./screens/constructor/profil/UpdateProfileConstructeur";
import AddProject from "./screens/constructor/project/AddProject";
import ClientDetails from "./screens/constructor/project/ClientDetails";
import DocumentsConstruteur from "./screens/constructor/project/documents/DocumentsConstruteur";
import UpdateDetails from "./screens/constructor/project/UpdateDetails";
import CreatCraftsman from "./screens/constructor/artisans/CreatCraftsman";
import UpdateCraftsman from "./screens/constructor/artisans/UpdateCraftsman";
import ConnexionScreen from "./screens/ConnexionScreen";
import ProjectConstructeur from "./screens/constructor/project/ProjectConstructeur";
import CreatAccount from "./screens/constructor/CreatAccount";
import ProfilScreen from "./screens/ProfilScreen";

const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();
const ChatStack = createNativeStackNavigator();

// Stack dédié au chat (client OU constructeur)
function MessageStackNavigator() {
  const isConstructeur = !!useSelector(
    (state) => state.constructeur.value.token
  );

  return (
    <ChatStack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={isConstructeur ? "Rooms" : "MessageClient"}
    >
      {isConstructeur && (
        <ChatStack.Screen name="Rooms" component={ClientRoomsScreen} />
      )}
      <ChatStack.Screen name="MessageClient" component={MessageClient} />
      <ChatStack.Screen
        name="MessageConstructeur"
        component={MessageConstructeur}
      />
    </ChatStack.Navigator>
  );
}

// Tabs principales
function MainTabs() {
  const isConstructeur = !!useSelector(
    (state) => state.constructeur.value.token
  );

  const defaultTabBarStyle = {
    position: "absolute",
    height: 80,
    backgroundColor: "#fff",
    borderRadius: 24,
    borderTopWidth: 0,
    elevation: 8,
    shadowColor: "#673ED9",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    paddingHorizontal: 10,
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case "Dashboard":
              iconName = "grid-outline";
              break;
            case "Message":
              iconName = "chatbubble-outline";
              break;
            case "Artisans":
              iconName = "book";
              break;
            case "Documents":
              iconName = "folder";
              break;
            case "Profil":
              iconName = "person";
              break;
            case "Projet":
              return <FontAwesome5 name="hard-hat" size={size} color={color} />;
            default:
              iconName = "ellipse-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#FE5900",
        tabBarInactiveTintColor: "#663ED9",
        headerShown: false,
        tabBarStyle: defaultTabBarStyle,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Projet" component={ProjectsScreen} />

      <Tab.Screen
        name="Message"
        component={MessageStackNavigator}
        options={({ route }) => {
          let focused = getFocusedRouteNameFromRoute(route);
          if (!focused) {
            focused = isConstructeur ? "Rooms" : "MessageClient";
          }
          if (
            focused === "MessageClient" ||
            focused === "MessageConstructeur"
          ) {
            return { tabBarStyle: { display: "none" } };
          }
          return { tabBarStyle: defaultTabBarStyle };
        }}
      />

      {isConstructeur ? (
        <Tab.Screen name="Artisans" component={Artisans} />
      ) : (
        <Tab.Screen name="Documents" component={DocumentsClient} />
      )}

      <Tab.Screen name="Profil" component={ProfilScreen} />
    </Tab.Navigator>
  );
}

// Navigator racine (auth vs app)
function RootNavigator() {
  const constructeurToken = useSelector(
    (state) => state.constructeur.value.token
  );
  const clientToken = useSelector((state) => state.client.value.token);
  const isAuthenticated = constructeurToken || clientToken;

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          <RootStack.Screen name="MainTabs" component={MainTabs} />

          <RootStack.Screen name="AddProject" component={AddProject} />
          <RootStack.Screen
            name="UpdateProfileConstructeur"
            component={UpdateProfileConstructeur}
          />
          <RootStack.Screen
            name="UpdateCraftsman"
            component={UpdateCraftsman}
          />
          <RootStack.Screen
            name="UpdateProfileClient"
            component={UpdateProfileClient}
          />
          <RootStack.Screen name="CreateCraftsman" component={CreatCraftsman} />
          <RootStack.Screen name="ClientDetails" component={ClientDetails} />
          <RootStack.Screen name="UpdateDetails" component={UpdateDetails} />
          <RootStack.Screen name="Documents" component={DocumentsConstruteur} />
          <RootStack.Screen
            name="UpdateDetailsClient"
            component={UpdateDetailsClient}
          />
        </>
      ) : (
        <>
          <RootStack.Screen name="Connexion" component={ConnexionScreen} />
          <RootStack.Screen name="ProAccCreation" component={CreatAccount} />
        </>
      )}
    </RootStack.Navigator>
  );
}

// Écran de chargement simple
const LoadingScreen = () => (
  <View
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#fff",
    }}
  >
    <ActivityIndicator size="large" color="#663ED9" />
    <Text style={{ marginTop: 15, color: "#663ED9" }}>Chargement...</Text>
  </View>
);

// Configuration Redux Persist + Store
const reducers = combineReducers({ client, constructeur });
const persistConfig = {
  key: "TrackMyHome2",
  storage: AsyncStorage,
  // Expiration courte pour éviter les problèmes de persistence
  timeout: 10000,
};

const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

const persistor = persistStore(store);

// Point d'entrée de l'app
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={<LoadingScreen />} persistor={persistor}>
          <SafeAreaProvider>
            <StatusBar hidden />
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}
