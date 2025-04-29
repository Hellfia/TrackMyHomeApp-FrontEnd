import React from "react";
import { useSelector } from "react-redux";
import Oups from "../components/Oups";
import MessageClient from "./client/message/MessageClient";
import ClientRoomsScreen from "./constructor/message/ClientRoomsScreen";

export default function MessageScreen({ navigation }) {
  const constructeur = useSelector((state) => state.constructeur.value);
  const client = useSelector((state) => state.client.value);

  if (constructeur.token && constructeur.role === "constructeur") {
    return <ClientRoomsScreen navigation={navigation} />;
  } else if (client.token && client.role === "client") {
    return <MessageClient navigation={navigation} />;
  }

  return <Oups />;
}
