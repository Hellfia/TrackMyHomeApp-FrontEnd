import React from "react";
import { useSelector } from "react-redux";
import Oups from "../components/Oups";
import DashboardClient from "./client/dashboard/DashboardClient";
import DashboardConstructeur from "./constructor/dashbaord/DashboardConstructeur";

export default function DashboardScreen({ navigation }) {
  const constructeur = useSelector((state) => state.constructeur.value);
  const client = useSelector((state) => state.client.value);

  if (constructeur.token && constructeur.role === "constructeur") {
    return <DashboardConstructeur navigation={navigation} />;
  } else if (client.token && client.role === "client") {
    return <DashboardClient navigation={navigation} />;
  }

  return <Oups />;
}
