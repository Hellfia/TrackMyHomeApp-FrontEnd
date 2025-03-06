import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import CraftsmanContainer from "../components/CraftsmanContainer";
import PlusButton from "../components/PlusButton";
import { useFocusEffect } from "@react-navigation/native";
import ReturnButton from "../components/ReturnButton";

export default function IntervenantsScreen({ navigation }) {
  const constructeur = useSelector((state) => state.constructeur.value);
  const [craftsman, setCraftsman] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const token = constructeur.token;
      fetch(`http://192.168.1.191:4000/craftsmen/${token}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("dataFecthed", data);
          setCraftsman(data.data);
        })
        .catch((error) => console.error("Erreur lors du fetch:", error));
    }, [constructeur.token])
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Mes intervenants</Text>
        <View style={styles.returnButton}>
          <ReturnButton
            onPress={() => navigation.navigate("Profil")}
          ></ReturnButton>
        </View>
        <View style={styles.listContent}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {craftsman.map((craftsmanItem) => (
              <CraftsmanContainer
                key={craftsmanItem._id}
                craftsmanName={craftsmanItem.craftsmanName}
                craftsmanLogo={craftsmanItem.craftsmanLogo}
                craftsmanAddress={craftsmanItem.craftsmanAddress}
                craftsmanZip={craftsmanItem.craftsmanZip}
                craftsmanCity={craftsmanItem.craftsmanCity}
                phoneNumber={craftsmanItem.phoneNumber}
              />
            ))}
          </ScrollView>
        </View>
      </View>
      <PlusButton
        icon="plus"
        onPress={() => navigation.navigate("CreateCraftsman")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerContainer: {
    paddingTop: 80,
    paddingBottom: 20,
    alignItems: "center",
    backgroundColor: "#F7F7F7",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#663ED9",
  },
  listContent: {
    width: "100%",
  },
  scrollContainer: {
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  returnButton: {
    position: "absolute",
    left: 16,
    top: 50,
  },
});
