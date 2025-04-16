import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import Oups from "../components/Oups";
import MessageClient from "./client/message/MessageClient";
import ClientRoomsScreen from "./constructor/message/ClientRoomsScreen";

export default function MessageScreen() {
  const constructeur = useSelector((state) => state.constructeur.value);
  const client = useSelector((state) => state.client.value);

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
    paddingTop: 16,
    backgroundColor: "#FFF",
  },
});
