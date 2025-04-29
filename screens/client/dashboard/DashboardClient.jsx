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
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import avatar from "../../../assets/avatar.png";
import maison from "../../../assets/maison-test.jpg";

export default function DashboardClient() {
  const insets = useSafeAreaInsets();
  const [infoConstructor, setInfoConstructor] = useState([]);
  const [steps, setSteps] = useState([]);
  const client = useSelector((state) => state.client.value);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState([]);
  const prodURL = process.env.PROD_URL;

  useFocusEffect(
    useCallback(() => {
      fetch(`${prodURL}/projects/chantier/${client.clientId}/${client.token}`)
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

  const completedSteps = steps.filter((s) => s.status === "Terminé").length;
  const totalSteps = steps.length;
  const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  const lastStep = steps
    .slice()
    .reverse()
    .find((s) => s.status === "Terminé");
  const image = lastStep?.uri ? { uri: lastStep.uri } : maison;
  const profileImage = infoConstructor.profilePicture
    ? { uri: infoConstructor.profilePicture }
    : avatar;

  const stepsInComing = steps.filter((s) => s.status === "À venir");
  const stepsInProgress = steps.filter((s) => s.status === "En cours");
  const stepsFinished = steps.filter((s) => s.status === "Terminé");

  const openModal = (list) => {
    setModalContent(
      list
        .slice()
        .reverse()
        .map((s) => ({ name: s.name }))
    );
    setModalVisible(true);
  };

  const callConstructor = (phone) =>
    phone && phone !== "Non renseigné"
      ? Linking.openURL(`tel:${phone}`)
      : alert("Numéro de téléphone non renseigné");

  return (
    <LinearGradient
      colors={["#8E44AD", "#372173"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      locations={[0, 0.1]}
      style={[styles.pageContainer, { paddingTop: insets.top }]}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mon tableau de bord</Text>
      </View>

      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Mon projet Section */}
          <Text style={styles.subTitle}>Mon projet</Text>
          <View style={styles.imageContainer}>
            <Image source={image} style={styles.image} resizeMode="cover" />
          </View>
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {completedSteps} étapes terminées sur {totalSteps}
          </Text>

          {/* Steps Status */}
          <View style={styles.sectionSteps}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.ScrollView}
            >
              <TouchableOpacity
                style={styles.clientCard}
                onPress={() => openModal(stepsInComing)}
              >
                <Text style={styles.stepText}>À venir</Text>
                <Text style={styles.stepNumberTextInComming}>
                  {stepsInComing.length}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.clientCard}
                onPress={() => openModal(stepsInProgress)}
              >
                <Text style={styles.stepText}>En cours</Text>
                <Text style={styles.stepNumberTextInProgress}>
                  {stepsInProgress.length}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.clientCard}
                onPress={() => openModal(stepsFinished)}
              >
                <Text style={styles.stepText}>Terminé</Text>
                <Text style={styles.stepNumberTextFinished}>
                  {stepsFinished.length}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Mon constructeur Section */}
          <Text style={styles.subTitle}>Mon constructeur</Text>
          <TouchableOpacity
            style={styles.infoConstructeurContainer}
            onPress={() => callConstructor(infoConstructor.phoneNumber)}
          >
            <View style={styles.infoLeftContainer}>
              <Image
                source={profileImage}
                style={styles.profilPicture}
                accessibilityLabel="Photo du constructeur"
              />
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
            <FontAwesome5 name="phone-alt" color="#FE5900" size={24} />
          </TouchableOpacity>

          {/* Modal for steps details */}
          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Détails des étapes</Text>
                <ScrollView>
                  {modalContent.length > 0 ? (
                    modalContent.map((step, idx) => (
                      <View key={idx} style={styles.stepDetailContainer}>
                        <Text style={styles.stepName}>{step.name}</Text>
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
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  pageContainer: { flex: 1 },
  header: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 5,
  },
  headerTitle: {
    marginTop: 5,
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 20,
    paddingBottom: 30,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 15,
    marginLeft: 20,
  },
  imageContainer: {
    width: "90%",
    height: 180,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
    marginLeft: 20,
  },
  image: { width: "100%", height: "100%" },
  progressContainer: {
    height: 20,
    width: "90%",
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 10,
    marginHorizontal: 20,
  },
  progressBar: { height: "100%", backgroundColor: "#4caf50" },
  progressText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  sectionSteps: { paddingLeft: 10 },
  ScrollView: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  clientCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#FE5900",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginRight: 12,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    width: 120,
    height: 120,
  },
  stepText: { fontSize: 16, fontWeight: "700", color: "#663ED9" },
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
  stepNumberTextFinished: { fontSize: 18, fontWeight: "700", color: "#28DB52" },
  infoConstructeurContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowOffset: { width: 2, height: 4 },
    shadowColor: "#673ED9",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    padding: 12,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  infoLeftContainer: {
    flexDirection: "row",
    alignItems: "center",
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
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
    color: "#362173",
  },
  stepDetailContainer: { marginBottom: 15 },
  stepName: { fontSize: 16, fontWeight: "400" },
  closeModalButton: {
    marginTop: 20,
    backgroundColor: "#663ED9",
    padding: 10,
    borderRadius: 5,
  },
  closeModalButtonText: { color: "#fff", fontSize: 16 },
  noStepsText: {
    fontSize: 16,
    fontWeight: "400",
    color: "#555",
    marginTop: 10,
  },
});
