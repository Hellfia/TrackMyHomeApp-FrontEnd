import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector } from "react-redux";
import maison from "../../../assets/maison-test.jpg";
import StepItem from "../../../components/StepItem";

export default function ProjectClient({ navigation }) {
  const insets = useSafeAreaInsets();
  const [steps, setSteps] = useState([]);
  const prodURL = process.env.PROD_URL;
  const client = useSelector((state) => state.client.value);

  useFocusEffect(
    useCallback(() => {
      fetch(`${prodURL}/projects/chantier/${client.clientId}/${client.token}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.result) {
            setSteps(data.data.steps);
          }
        })
        .catch(console.error);
    }, [client.clientId])
  );

  // Dernière étape validée
  const lastValidatedStep = steps
    .slice()
    .reverse()
    .find((step) => step.status === "Terminé");
  const image = lastValidatedStep?.uri
    ? { uri: lastValidatedStep.uri }
    : maison;

  return (
    <LinearGradient
      colors={["#8E44AD", "#372173"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      locations={[0, 0.1]}
      style={styles.pageContainer}
    >
      {/* Header Gradient */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={styles.headerTitle}>Mon projet</Text>
      </View>

      {/* Contenu blanc arrondi */}
      <View style={styles.content}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 50 }}
        >
          <View style={styles.imageContainer}>
            <Image
              source={image}
              style={styles.image}
              resizeMode="cover"
              accessibilityLabel="Photo du chantier en cours"
            />
          </View>

          <Text style={styles.stepText}>Les étapes de construction</Text>
          <View style={styles.subContainer}>
            {steps
              .slice()
              .reverse()
              .map((step, index) => {
                let iconName = "";
                let iconColor = "";

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
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    marginTop: 5,
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 5,
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 20,
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
  stepText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "#362173",
  },
});
