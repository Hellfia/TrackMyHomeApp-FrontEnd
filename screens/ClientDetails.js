import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ReturnButton from "../components/ReturnButton";
import globalStyles from "../styles/globalStyles";

export default function ClientDetails({ route, navigation }) {
  const { client } = route.params;

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={globalStyles.header}>
        <ReturnButton onPress={() => navigation.navigate("Projet")} />
        <Text style={globalStyles.title}>Mes intervenants</Text>
      </View>
      <Text style={styles.nameClient}>{client.firstname}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
  },

  nameClient: {
    fontWeight: "700",
    fontSize: 20,
    color: "#362173",
    marginBottom: 10,
  },
});
