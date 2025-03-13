import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import maison from "../../../assets/maison-test.jpg";
import StepItem from "../../../components/StepItem";
import globalStyles from "../../../styles/globalStyles";

export default function ProjectClient({ navigation }) {
  const [steps, setSteps] = useState([]);
  const devUrl = process.env.DEV_URL;
  const client = useSelector((state) => state.client.value);

  useFocusEffect(
    useCallback(() => {
      fetch(`https://track-my-home-backend.vercel.app/projects/chantier/${client.clientId}/${client.token}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.result) {
            setSteps(data.data.steps);
          }
        })
        .catch(console.error);
    }, [client.clientId])
  );

  // Trouver la dernière étape validée dans steps qui a le statut validée
  const lastValidatedStep = steps
    .reverse()
    .find((step) => step.status === "Terminé");

  // Si on a une étape validée , on prend l'URI de la derniere, sinon on prend le logo par défaut
  const image =
    lastValidatedStep && lastValidatedStep.uri
      ? { uri: lastValidatedStep.uri }
      : maison;

  return (
    <SafeAreaView style={styles.container}>
      <View style={globalStyles.header}>
        <Text style={globalStyles.title}>Mon projet</Text>
      </View>

      <View style={styles.imageContainer}>
        <Image source={image} style={styles.image} resizeMode="cover" />
      </View>

      <Text style={styles.stepText}>Les étapes de construction</Text>
      <ScrollView>
        <View style={styles.subContainer}>
          {steps.reverse().map((step, index) => {
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
                iconOnPress="eye"
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
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "#362173",
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
