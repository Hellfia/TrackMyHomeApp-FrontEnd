import React from "react";
import { useSelector } from "react-redux";
import Oups from "../components/Oups";
import MessagesClient from "./client/messages/MessagesClient";
import MessagesConstructeur from "./constructor/messages/MessagesConstructeur";

export default function MessagesScreen({ navigation }) {
  const constructeur = useSelector((state) => state.constructeur.value);
  const client = useSelector((state) => state.client.value);

  if (constructeur.token && constructeur.role === "constructeur") {
    return <MessagesConstructeur navigation={navigation} />;
  } else if (client.token && client.role === "client") {
    return <MessagesClient navigation={navigation} />;
  }

  return <Oups />;
}
