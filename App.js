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
import DashboardScreen from "./screens//DashboardScreen";
import DocumentsClient from "./screens/client/documents/DocumentsClient";
import UpdateProfileClient from "./screens/client/profil/UpdateProfileClient";
import UpdateDetailsClient from "./screens/client/project/UpdateDetailsClient";
import ConnexionScreen from "./screens/ConnexionScreen";
import Artisans from "./screens/constructor//artisans/Artisans";
import CreatCraftsman from "./screens/constructor/artisans/CreatCraftsman";
import UpdateCraftsman from "./screens/constructor/artisans/UpdateCraftsman";
import CreatAccount from "./screens/constructor/CreatAccount";
import UpdateProfileConstructeur from "./screens/constructor/profil/UpdateProfileConstructeur";
import AddProject from "./screens/constructor/project/AddProject";
import ClientDetails from "./screens/constructor/project/ClientDetails";
import DocumentsConstruteur from "./screens/constructor/project/documents/DocumentsConstruteur";
import UpdateDetails from "./screens/constructor/project/UpdateDetails";
import ProfilScreen from "./screens/ProfilScreen";
import ProjectsScreen from "./screens/ProjectScreen";
import MessageConstructeurScreen from "./screens/constructor/MessageConstructeurScreen";
import MessageClientScreen from "./screens/client/MessageClientScreen";

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
// AsyncStorage.clear().then();
// persistor.purge().then();

function MainTabs() {
  const constructeurToken = useSelector(
    (state) => state.constructeur.value.token
  );
  // Détermine le rôle en fonction du token (true si constructeur, false sinon)
  const isConstructeur = !!constructeurToken;

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
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Projet" component={ProjectsScreen} />
      <Tab.Screen
        name="Message"
        component={
          isConstructeur ? MessageConstructeurScreen : MessageClientScreen
        }
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

function RootNavigator() {
  const constructeurToken = useSelector(
    (state) => state.constructeur.value.token
  );
  const clientToken = useSelector((state) => state.client.value.token);
  const isAuthenticated = constructeurToken || clientToken;
  return (
    <Stack.Navigator>
      {isAuthenticated ? (
        <>
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Intervenants"
            component={Artisans}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddProject"
            component={AddProject}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="UpdateProfileConstructeur"
            component={UpdateProfileConstructeur}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="UpdateCraftsman"
            component={UpdateCraftsman}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="UpdateProfileClient"
            component={UpdateProfileClient}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CreateCraftsman"
            component={CreatCraftsman}
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
            component={DocumentsConstruteur}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="UpdateDetailsClient"
            component={UpdateDetailsClient}
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
            name="ProAccCreation"
            component={CreatAccount}
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
