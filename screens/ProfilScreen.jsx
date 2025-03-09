import React from "react";
import { useSelector } from "react-redux";
import Oups from "../components/Oups";
import ProfilClient from "./client/profil/ProfilClient";
import ProfilConstructeur from "./constructor/profil/ProfilConstructeur";

export default function ProfilScreen({ navigation }) {
  const constructeur = useSelector((state) => state.constructeur.value);
  const client = useSelector((state) => state.client.value);

  if (constructeur.token && constructeur.role === "constructeur") {
    return <ProfilConstructeur navigation={navigation} />;
  } else if (client.token && client.role === "client") {
    return <ProfilClient navigation={navigation} />;
  }

  return <Oups />;
}
