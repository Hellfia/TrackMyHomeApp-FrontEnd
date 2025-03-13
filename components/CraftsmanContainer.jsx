import { FontAwesome5 } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Button,
  Image,
  Linking,
  Modal,
  StyleSheet,
  Text,
  View,
} from "react-native";
import avatar from "../assets/avatar.png";
import PurpleButton from "./PurpleButton";

const CraftsmanContainer = ({
  craftsmanName,
  craftsmanAddress,
  craftsmanZip,
  craftsmanCity,
  craftsmanLogo,
  phoneNumber,
  navigation,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const profileImage = craftsmanLogo ? { uri: craftsmanLogo } : avatar;

  const handlePress = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleModify = () => {
    setIsModalVisible(false);
    navigation.navigate("UpdateCraftsman", {
      craftsman: {
        craftsmanName,
        craftsmanAddress,
        craftsmanZip,
        craftsmanCity,
        phoneNumber,
      },
    });
  };

  const devUrl = process.env.DEV_URL;

  const handleDelete = () => {
    fetch(`https://track-my-home-backend.vercel.app/craftsmen/${craftsmanName}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setIsModalVisible(false);
          navigation.reset({
            index: 0,
            routes: [{ name: "Artisans" }],
          });
        } else {
          console.error("Erreur lors de la suppression :", data.error);
        }
      })
      .catch((error) => {
        console.error("Erreur réseau ou serveur :", error);
      });
  };

  const handleCall = () => {
    const phoneUrl = `tel:${phoneNumber}`; // format du numéro pour l'appel
    Linking.openURL(phoneUrl).catch((err) =>
      console.error("Erreur lors de l'appel :", err)
    );
    setIsModalVisible(false); // Ferme la modale après l'appel
  };

  return (
    <View style={styles.generalContainer}>
      <Image source={profileImage} style={styles.avatar} />
      <View style={styles.infosContainer}>
        <View style={styles.modifContainer}>
          <Text style={styles.nameCraftsman}>{craftsmanName}</Text>
          <FontAwesome5
            name="ellipsis-h"
            size="22"
            color="#362173"
            onPress={handlePress}
          />
        </View>
        <Text>{craftsmanAddress}</Text>
        <Text>
          {craftsmanZip} {craftsmanCity}
        </Text>
      </View>

      {/* Modale */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Que voulez-vous faire ?</Text>
            <PurpleButton
              onPress={() => handleCall()}
              text="Appeller"
              backgroundColor="#FE5900"
              icon="phone-alt"
            />
            <PurpleButton onPress={() => handleModify()} text="Modifier" />
            <PurpleButton
              onPress={() => handleDelete()}
              text="Supprimer"
              backgroundColor="#DB0000"
            />
            <Button title="Annuler" onPress={handleCloseModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  generalContainer: {
    flexDirection: "row",
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
    padding: 12,
    marginVertical: 5,
    width: "100%",
  },
  infosContainer: {
    marginLeft: 15,
    flex: 1,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  modifContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nameCraftsman: {
    fontWeight: "500",
    color: "#663ED9",
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

export default CraftsmanContainer;
