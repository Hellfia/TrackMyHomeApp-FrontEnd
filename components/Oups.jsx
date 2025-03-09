import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function Oups() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centeredView}>
        <Text style={styles.text}>Oups, un problème est survenu !</Text>
      </View>
    </SafeAreaView>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#362173",
    fontSize: 24,
    fontWeight: 600,
    textAlign: "center",
  },
});
