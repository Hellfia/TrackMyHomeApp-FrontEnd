import React from "react";
import { useSelector } from "react-redux";
import Oups from "../components/Oups";
import ProjectClient from "./client/project/ProjectClient";
import ProjectConstructeur from "./constructor/project/ProjectConstructeur";

export default function ProjectScreen({ navigation }) {
  const constructeur = useSelector((state) => state.constructeur.value);
  const client = useSelector((state) => state.client.value);

  if (constructeur.token && constructeur.role === "constructeur") {
    return <ProjectConstructeur navigation={navigation} />;
  } else if (client.token && client.role === "client") {
    return <ProjectClient navigation={navigation} />;
  }

  return <Oups />;
}
