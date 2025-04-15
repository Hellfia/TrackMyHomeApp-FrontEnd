import React from "react";
import { useSelector } from "react-redux";
import { SafeAreaView, StyleSheet } from "react-native";
import ClientRoomsScreen from "./constructor/message/ClientRoomsScreen";
import MessageClient from "./client/message/MessageClient";
import Oups from "../components/Oups";

export default function MessageScreen() {
  const constructeur = useSelector((state) => state.constructeur.value);
  const client = useSelector((state) => state.client.value);

  console.log("Rendering MessageScreen");

  return (
    <SafeAreaView style={styles.container}>
      {constructeur.token && constructeur.role === "constructeur" ? (
        <ClientRoomsScreen />
      ) : client.token && client.role === "client" ? (
        <MessageClient />
      ) : (
        <Oups />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16, // Add padding to avoid the notch
    backgroundColor: "#FFF", // Optional background color
  },
});
