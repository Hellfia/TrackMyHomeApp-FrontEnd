import { FontAwesome5 } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import avatar from "../../../assets/avatar.png";
import maison from "../../../assets/maison-test.jpg";
import globalStyles from "../../../styles/globalStyles";

export default function DashboardClient({ navigation }) {
  const [infoConstructor, setInfoConstructor] = useState([]);
  const [steps, setSteps] = useState([]);
  const devUrl = process.env.DEV_URL;
  const client = useSelector((state) => state.client.value);

  console.log("data", steps);

  useFocusEffect(
    useCallback(() => {
      fetch(`${devUrl}/projects/chantier/${client.clientId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.result) {
            setSteps(data.data.steps);
            setInfoConstructor(data.data.constructeur);
          }
        })
        .catch(console.error);
    }, [client.clientId])
  );

  // Calculer le pourcentage des étapes terminées
  const completedSteps = steps.filter(
    (step) => step.status === "Terminé"
  ).length;
  const totalSteps = steps.length;
  const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  // Trouver l'URI de la dernière étape validée
  const lastValidatedStep = steps // Cloner pour éviter de modifier l'ordre d'origine
    .reverse()
    .find((step) => step.status === "validée");

  const callConstructor = (phoneNumber) => {
    if (phoneNumber && phoneNumber !== "Non renseigné") {
      Linking.openURL(`tel:${phoneNumber}`);
    } else {
      alert("Numéro de téléphone non renseigné");
    }
  };

  const image =
    lastValidatedStep && lastValidatedStep.uri
      ? { uri: lastValidatedStep.uri }
      : maison;

  const profileImage = infoConstructor.profilePicture
    ? { uri: profilePicture }
    : avatar;

  return (
    <SafeAreaView style={styles.container}>
      <View style={globalStyles.header}>
        <Text style={globalStyles.title}>Mon dashboard</Text>
      </View>

      <Text style={styles.subTitle}>Mon projet</Text>

      <View style={styles.imageContainer}>
        <Image source={image} style={styles.image} resizeMode="cover" />
      </View>
      {/* Barre de progression */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.progressText}>
        {completedSteps} étapes terminées sur {totalSteps}
      </Text>

      {/* États des steps */}
      <View style={styles.infosStep}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.stepContainer}>
            <Text>À venir</Text>
            <Text>0</Text>
          </View>
          <View style={styles.stepContainer}>
            <Text>En cours</Text>
            <Text>0</Text>
          </View>
          <View style={styles.stepContainer}>
            <Text>Terminé</Text>
            <Text>0</Text>
          </View>
        </ScrollView>
      </View>

      {/* Info Constructeur */}
      <Text style={styles.subTitle}>Mon constructeur</Text>
      <TouchableOpacity
        key={client.id}
        style={styles.infoConstructeurContainer}
        onPress={() => callConstructor(infoConstructor.phoneNumber)}
      >
        <Image source={profileImage} style={styles.profilPicture} />
        <Text style={styles.constructorName}>
          {infoConstructor.constructorName}
        </Text>
        <FontAwesome5
          name="phone-alt"
          color="#FE5900"
          size={22}
          style={styles.icon}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 40,
    marginBottom: 15,
    marginLeft: 20,
    textAlign: "left",
  },
  imageContainer: {
    width: "100%",
    height: 180,
    borderRadius: 20,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  progressContainer: {
    height: 20,
    width: "100%",
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    marginTop: 20,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#4caf50",
  },
  progressText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  infoConstructeurContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#663ED9",
    borderRadius: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    padding: 12,
    marginVertical: 5,
  },
  profilPicture: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  constructorName: {
    marginLeft: 20,
    fontWeight: "700",
    color: "#663ED9",
    flex: 1,
  },
  icon: {
    marginVertical: 10,
  },
  infosStep: {
    display: "flex",
    flexDirection: "row",
    marginTop: 20,
    marginBottom: -20,
  },
  stepContainer: {
    display: "flex",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#663ED9",
    borderRadius: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: 150,
    height: 130,
    marginRight: 15,
  },
});
