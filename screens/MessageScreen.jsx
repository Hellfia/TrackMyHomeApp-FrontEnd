import React from "react";
import { useSelector } from "react-redux";
import Oups from "../components/Oups";
import MessageConstructeur from "./constructor/message/MessageConstructeur"
import MessageClient from "./client/message/MessageClient";

export default function MessageScreen({ navigation }) {
  const constructeur = useSelector((state) => state.constructeur.value);
  const client = useSelector((state) => state.client.value);

  if (constructeur.token && constructeur.role === "constructeur") {
    return <MessageConstructeur navigation={navigation} />;
  } else if (client.token && client.role === "client") {
    return <MessageClient navigation={navigation} />;
  }

  return <Oups />;
}
