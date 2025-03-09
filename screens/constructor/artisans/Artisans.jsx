import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import CraftsmanContainer from "../../../components/CraftsmanContainer";
import PlusButton from "../../../components/PlusButton";
import ReturnButton from "../../../components/ReturnButton";
import globalStyles from "../../../styles/globalStyles";

export default function Artisans({ navigation }) {
  const constructeur = useSelector((state) => state.constructeur.value);
  const [craftsman, setCraftsman] = useState([]);

  const devUrl = process.env.DEV_URL;

  useFocusEffect(
    useCallback(() => {
      const token = constructeur.token;
      fetch(`${devUrl}/craftsmen/${token}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("dataFecthed", data);
          setCraftsman(data.data);
        })
        .catch((error) => console.error("Erreur lors du fetch:", error));
    }, [constructeur.token])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={globalStyles.header}>
        <ReturnButton onPress={() => navigation.goBack()} />
        <Text style={globalStyles.title}>Mes artisans</Text>
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
    justifyContent: "flex-start",
    alignItems: "center",
    margin: 15,
  },
  listContent: {
    width: "100%",
    marginTop: 20,
  },
  scrollContainer: {
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
});
