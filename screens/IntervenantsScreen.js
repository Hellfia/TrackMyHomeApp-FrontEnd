// MesIntervenants.js
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import CraftsmanContainer from "../components/CraftsmanContainer";
import PlusButton from "../components/PlusButton";
import ReturnButton from "../components/ReturnButton";
import globalStyles from "../styles/globalStyles";

export default function MesIntervenants({ navigation }) {
  const constructeur = useSelector((state) => state.constructeur.value);
  const [craftsman, setCraftsman] = useState([]);

  useEffect(() => {
    const token = constructeur.token;
    fetch(`http://192.168.1.146:4000/craftsmen/${token}`)
      .then((res) => res.json())
      .then((data) => {
        setCraftsman(data.data);
      })
      .catch((error) => console.error("Erreur lors du fetch:", error));
  }, [constructeur.token]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={globalStyles.header}>
        <ReturnButton onPress={() => navigation.navigate("Profil")} />
        <Text style={globalStyles.title}>Mes intervenants</Text>
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
      <PlusButton
        icon="plus"
        onPress={() => navigation.navigate("CreateCraftsman")}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
});
