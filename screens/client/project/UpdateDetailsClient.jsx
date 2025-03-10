import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import globalStyles from "../../../styles/globalStyles";

export default function UpdateDetailsClient({ route, navigation }) {
    const { data } = route.params;
    console.log(data)
    
  return (
    <SafeAreaView style={styles.container}>
      <View style={globalStyles.header}>
        <Text style={globalStyles.title}>Mon Projet Test</Text>
      </View>
      // Ajouter le reste du composant ici
    </SafeAreaView>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 20,
    paddingHorizontal: 20,
  },
});