import { FontAwesome5 } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import {
  Button,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";
import maison from "../../../assets/maison-test.jpg";
import PurpleButton from "../../../components/PurpleButton";
import ReturnButton from "../../../components/ReturnButton";
import StepItem from "../../../components/StepItem";
import { addDocument } from "../../../reducers/constructeur";
// import globalStyles if still needed for other screens

export default function ClientDetails({ route, navigation }) {
  const dispatch = useDispatch();
  const { data: routeData } = route.params; // Renamed to avoid conflict and clarify origin
  const insets = useSafeAreaInsets();

  // Local state to hold the data, updated when route params change
  const [currentData, setCurrentData] = useState(routeData);

  useEffect(() => {
    // This effect runs when routeData (from route.params.data) changes,
    // ensuring currentData is updated, which should trigger a re-render.
    console.log(
      "ClientDetails: route.params.data received at",
      new Date().toLocaleTimeString()
    );
    // For more detailed debugging, you can uncomment the line below:
    // console.log("New data in ClientDetails:", JSON.stringify(routeData, null, 2));
    setCurrentData(routeData);
  }, [routeData]); // Depend on routeData (the object reference from route.params.data)

  const projectId = currentData._id;
  const [isModalVisible, setIsModalVisible] = useState(false);

  const lastValidatedStep = currentData.steps
    .slice()
    .find((step) => step.status === "validée");

  const imageSrc =
    lastValidatedStep && lastValidatedStep.uri
      ? { uri: lastValidatedStep.uri }
      : maison;

  const handlePress = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);

  const prodURL = process.env.PROD_URL;
  const handleDelete = () => {
    fetch(`${prodURL}/projects/${projectId}`, { method: "DELETE" })
      .then((res) => res.json())
      .then((resData) => {
        // Close the modal first
        setIsModalVisible(false);

        if (resData.result)
          navigation.navigate("MainTabs", { screen: "Projet" });
        else
          console.error(
            "Erreur lors de la suppression du projet:",
            resData.error
          );
      })
      .catch((err) => {
        // Close the modal even on error
        setIsModalVisible(false);
        console.error("Erreur réseau ou serveur lors de la suppression:", err);
      });
  };

  const handleDocument = () => {
    navigation.navigate("Documents", { data: currentData }); // Pass currentData
    dispatch(addDocument(projectId));
  };

  return (
    <LinearGradient
      colors={["#8E44AD", "#372173"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      locations={[0, 0.1]}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <View style={styles.header}>
        <ReturnButton
          onPress={() => navigation.navigate("MainTabs", { screen: "Projet" })}
        />
        <Text style={styles.headerTitle}>
          {currentData.client.firstname} {currentData.client.lastname}
        </Text>
        <FontAwesome5
          name="trash-alt"
          size={25}
          color="#FF0000"
          style={styles.icon}
          onPress={handlePress}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image
            source={imageSrc}
            style={styles.image}
            resizeMode="contain"
            accessibilityLabel="Photo du projet de construction"
          />
        </View>

        <PurpleButton text="Documents" icon="folder" onPress={handleDocument} />

        <Text style={styles.stepText}>Les étapes de construction</Text>
        <ScrollView>
          <View style={styles.subContainer}>
            {currentData.steps
              .slice()

              .map((step) => {
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
                    key={step._id} // Use unique step ID as key
                    name={step.name}
                    iconName={iconName}
                    iconColor={iconColor}
                    iconOnPress="pencil-alt"
                    onPress={
                      () =>
                        navigation.navigate("UpdateDetails", {
                          data: currentData,
                          step,
                        }) // Pass currentData
                    }
                  />
                );
              })}
          </View>
        </ScrollView>
      </View>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              Êtes-vous sûr de supprimer ce chantier ?
            </Text>
            <PurpleButton
              onPress={handleDelete}
              text="Oui, supprimer"
              backgroundColor="#DB0000"
            />
            <Button title="Annuler" onPress={handleCloseModal} />
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 50,
  },
  headerTitle: {
    position: "absolute",
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  icon: {
    position: "absolute",
    top: 15,
    right: 16,
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
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    width: 340,
    height: 180,
    overflow: "hidden",
    borderRadius: 20,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  subContainer: {
    marginVertical: 20,
    alignItems: "flex-start",
  },
  stepText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "#362173",
    marginVertical: 3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "500",
    paddingTop: 10,
    paddingBottom: 30,
    textAlign: "center",
  },
});
