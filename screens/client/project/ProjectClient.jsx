import React, { useEffect, useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, StyleSheet, Text, View, Image } from "react-native";
import { useSelector } from "react-redux";
import globalStyles from "../../../styles/globalStyles";
import maison from "../../../assets/maison-test.jpg";
import PurpleButton from "../../../components/PurpleButton";
import { FontAwesome5 } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import StepItem from "../../../components/StepItem"

export default function ProjectClient({ navigation }) {
  const [steps, setSteps] = useState([]);
  const devUrl = process.env.DEV_URL;
  const client = useSelector((state) => state.client.value);

  useFocusEffect(
    useCallback(() => {
      fetch(`${devUrl}/projects/chantier/${client.clientId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.result) {
            setSteps(data.data.steps);
          }
        })
        .catch(console.error);
    }, [client.clientId])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={globalStyles.header}>
        <Text style={globalStyles.title}>Mon projet</Text>
      </View>

      <View style={styles.imageContainer}>
        <Image source={maison} style={styles.image} resizeMode="cover" />
      </View>

     

      <Text style={styles.stepText}>Les étapes de construction</Text>
      <ScrollView>
        <View style={styles.subContainer}>
          {steps
            .map((step, index) => {
              let iconName = "";
              let iconColor = "";

              // Déterminer l'icône et la couleur en fonction du statut
              if (step.status === "À venir") {
                iconName = "ban";
                iconColor = "#FF0000";
              } else if (step.status === "Terminé") {
                iconName = "check";
                iconColor = "#28DB52";
              } else if (step.status === "En cours") {
                iconName = "spinner";
                iconColor = "#FFA500";
              }

              return (
                <StepItem
                  key={index}
                  name={step.name}
                  iconName={iconName}
                  iconColor={iconColor}
                  iconOnPress='eye'
                  onPress={() =>
                    navigation.navigate("UpdateDetailsClient", {
                      data: step,
                    })
                  }
                />
              );
            })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  imageContainer: {
    width: "100%",
    height: 180,
    borderRadius: 20,
    overflow: "hidden",
    marginVertical: 20,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  purpleButton: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 15,
  },
  stepText: {
    fontSize: 18,
    color: "#663ED9",
    marginBottom: 15,
    textAlign: "center",
  },
  stepsContainer: {
    flex: 1,
    width: "100%",
  },
  stepItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  purpleButton: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginVertical: 15,
  },
});