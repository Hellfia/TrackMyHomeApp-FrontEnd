import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import CraftsmanContainer from "../../../components/CraftsmanContainer";
import PlusButton from "../../../components/PlusButton";
import ReturnButton from "../../../components/ReturnButton";
import globalStyles from "../../../styles/globalStyles";

export default function Artisans({ route, navigation }) {
  const constructeur = useSelector((state) => state.constructeur.value);
  const [craftsman, setCraftsman] = useState([]);

  const devUrl = process.env.DEV_URL;

  useFocusEffect(
    useCallback(() => {
      const token = constructeur.token;
      fetch(`${devUrl}/craftsmen/${token}`)
        .then((res) => res.json())
        .then((data) => {
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
          {craftsman.length > 0 ? (
            craftsman.map((craftsmanItem) => (
              <CraftsmanContainer
                key={craftsmanItem._id}
                craftsmanName={craftsmanItem.craftsmanName}
                craftsmanLogo={craftsmanItem.craftsmanLogo}
                craftsmanAddress={craftsmanItem.craftsmanAddress}
                craftsmanZip={craftsmanItem.craftsmanZip}
                craftsmanCity={craftsmanItem.craftsmanCity}
                phoneNumber={craftsmanItem.phoneNumber}
                navigation={navigation}
                route={craftsman}
              />
            ))
          ) : (
            <View style={styles.craftsmanNotFound}>
              <Text style={styles.craftsmanNotFoundText}>
                Ajoutez votre premier artisan !
              </Text>
            </View>
          )}
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
  craftsmanNotFound: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
    marginHorizontal: 40,
    padding: 50,
    width: "80%",
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#663ED9",
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  craftsmanNotFoundText: {
    fontSize: 18,
    textAlign: "center",
    color: "#362173",
  },
});
