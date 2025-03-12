import { FontAwesome5 } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  Image,
  Linking,
  Modal,
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
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState([]);

  useFocusEffect(
    useCallback(() => {
      fetch(`${devUrl}/projects/chantier/${client.clientId}/${client.token}`)
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

  // Filtrer les étapes
  const stepsInComing = steps.filter((step) => step.status === "À venir");
  const stepsInProgress = steps.filter((step) => step.status === "En cours");
  const stepsFinished = steps.filter((step) => step.status === "Terminé");

  // Fonction pour ouvrir la modal avec les étapes correspondantes
  const openModal = (stepsList) => {
    const stepsNames = stepsList.reverse().map((step) => ({ name: step.name })); // Récupérer seulement le nom des étapes
    setModalContent(stepsNames); // Mettre à jour le contenu de la modal avec seulement les noms
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={globalStyles.header}>
        <Text style={globalStyles.title}>Mon dashboard</Text>
      </View>

      <View style={styles.section}>
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
      </View>

      {/* États des steps */}
      <View style={styles.sectionSteps}>
        <View style={styles.infosStep}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={styles.stepContainer}
              onPress={() => openModal(stepsInComing)}
            >
              <Text style={styles.stepText}>À venir</Text>
              <Text style={styles.stepNumberTextInComming}>
                {stepsInComing.length}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.stepContainer}
              onPress={() => openModal(stepsInProgress)}
            >
              <Text style={styles.stepText}>En cours</Text>
              <Text style={styles.stepNumberTextInProgress}>
                {stepsInProgress.length}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.stepContainer}
              onPress={() => openModal(stepsFinished)}
            >
              <Text style={styles.stepText}>Terminé</Text>
              <Text style={styles.stepNumberTextFinished}>
                {stepsFinished.length}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>

      {/* Container Constructor */}
      <View style={styles.section}>
        <Text style={styles.subTitle}>Mon constructeur</Text>
        <TouchableOpacity
          key={client.id}
          style={styles.infoConstructeurContainer}
          onPress={() => callConstructor(infoConstructor.phoneNumber)}
        >
          <View style={styles.infoLeftContainer}>
            <Image source={profileImage} style={styles.profilPicture} />
            <View style={styles.constructorInfo}>
              <Text style={styles.constructorName}>
                {infoConstructor.constructorName}
              </Text>
              <Text>{infoConstructor.address}</Text>
              <Text>
                {infoConstructor.zipCode} {infoConstructor.city}
              </Text>
            </View>
          </View>
          <FontAwesome5
            name="phone-alt"
            color="#FE5900"
            size={24}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Détails des étapes</Text>
            <ScrollView>
              {modalContent.length > 0 ? (
                modalContent.map((step, index) => (
                  <View key={index} style={styles.stepDetailContainer}>
                    <Text style={styles.stepName}>{step.name}</Text>
                    {step.content && (
                      <Text style={styles.stepContent}>{step.content}</Text>
                    )}
                  </View>
                ))
              ) : (
                <Text style={styles.noStepsText}>
                  Aucune étape pour le moment
                </Text>
              )}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeModalButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 40,
    marginBottom: 15,
    marginLeft: 20,
    textAlign: "left",
  },
  section: {
    paddingHorizontal: 20,
  },
  sectionSteps: {
    paddingLeft: 20,
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
  infoLeftContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  profilPicture: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  constructorInfo: {
    marginLeft: 15,
  },
  constructorName: {
    fontWeight: "700",
    color: "#663ED9",
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
  stepText: {
    fontSize: 16,
    marginVertical: 20,
    fontWeight: "700",
    color: "#663ED9",
  },
  stepNumberTextInComming: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FF0000",
  },
  stepNumberTextInProgress: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFA500",
  },
  stepNumberTextFinished: {
    fontSize: 18,
    fontWeight: "700",
    color: "#28DB52",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "85%",
    maxHeight: "85%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 15,
    marginBottom: 25,
    color: "#362173",
  },
  stepDetailContainer: {
    marginBottom: 15,
  },
  stepName: {
    fontSize: 16,
    fontWeight: "400",
  },
  closeModalButton: {
    marginTop: 20,
    backgroundColor: "#663ED9",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  closeModalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  noStepsText: {
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
    color: "#555",
    marginTop: 10,
  },
});
