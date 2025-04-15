import { FontAwesome5 } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Button,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import maison from "../../../assets/maison-test.jpg";
import PurpleButton from "../../../components/PurpleButton";
import ReturnButton from "../../../components/ReturnButton";
import StepItem from "../../../components/StepItem";
import { addDocument } from "../../../reducers/constructeur";
import globalStyles from "../../../styles/globalStyles";

export default function ClientDetails({ route, navigation }) {
  const dispatch = useDispatch();
  const { data } = route.params;

  const projectId = data._id;

  const [isModalVisible, setIsModalVisible] = useState(false);

  // Trouver la dernière étape validée dans steps qui a le statut validée
  const lastValidatedStep = data.steps
    .reverse()
    .find((step) => step.status === "validée");

  const handlePress = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const prodURL = process.env.PROD_URL

  const handleDelete = () => {
    fetch(`${prodURL}/projects/${data._id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          navigation.navigate("Projet");
        } else {
          console.error("Erreur lors de la suppression :", data.error);
        }
      })
      .catch((error) => {
        console.error("Erreur réseau ou serveur :", error);
      });
  };

  const handleDocument = () => {
    navigation.navigate("Documents", {
      data: data,
    });
    dispatch(addDocument(projectId));
  };

  // Si on a une étape validée , on prend l'URI de la derniere, sinon on prend le logo par défaut
  const image =
    lastValidatedStep && lastValidatedStep.uri
      ? { uri: lastValidatedStep.uri }
      : maison;

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={globalStyles.header}>
        <ReturnButton onPress={() => navigation.goBack()} />
        <Text style={globalStyles.title}>{data.client.firstname}</Text>
        <FontAwesome5
          name="trash-alt"
          size="25"
          color="#FF0000"
          style={styles.icon}
          onPress={handlePress}
        />
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={image}
          style={styles.image}
          resizeMode="contain"
          accessibilityLabel="Photo du projet de construction"
        />
      </View>
      <PurpleButton text="Documents" icon="folder" onPress={handleDocument} />
      <Text style={styles.stepText}>Les étapes de construction</Text>
      <ScrollView>
        <View style={styles.subContainer}>
          {data.steps
            .reverse() //Inverse le tableau
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
                  iconOnPress="pencil-alt"
                  onPress={() =>
                    navigation.navigate("UpdateDetails", {
                      data: data,
                      step: step,
                    })
                  }
                />
              );
            })}
        </View>
      </ScrollView>

      {/* Modale */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              Êtes-vous sûr de supprimer ce chantier ?
            </Text>
            <PurpleButton
              onPress={() => handleDelete()}
              text="Oui, supprimer"
              backgroundColor="#DB0000"
            />
            <Button title="Annuler" onPress={handleCloseModal} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  icon: {
    position: "absolute",
    top: 15,
    right: 8,
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
    display: "flex",
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
