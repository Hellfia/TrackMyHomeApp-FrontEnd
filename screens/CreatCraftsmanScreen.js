import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import Input from "../components/Input";
import GradientButton from "../components/GradientButton";

export default function CreatCraftsmanScreen() {
  const [craftsmanName, setCraftsmanName] = useState("");
  const [craftsmanAddress, setCraftsmanAddress] = useState("");
  const [craftsmanZip, setCraftsmanZip] = useState("");
  const [craftsmanCity, setCraftsmanCity] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const token = useSelector((state) => state.constructeur.value.token);
  const [logo, setLogo] = useState(null);

  const handleImagePicker = () => {};

  const handleValidate = () => {
    if (
      !craftsmanName ||
      !craftsmanAddress ||
      !craftsmanZip ||
      !craftsmanCity ||
      !phoneNumber
    ) {
      alert("Veuillez remplir tous les champs requis !");
      return;
    }

    const payload = {
      craftsmanName: craftsmanName,
      craftsmanLogo: logo ? logo : "default_logo",
      craftsmanAddress: craftsmanAddress,
      craftsmanZip: craftsmanZip,
      craftsmanCity: craftsmanCity,
      phoneNumber: phoneNumber,
      constructeurToken: token,
    };

    console.log("Payload envoyé :", payload);

    fetch("http://192.168.1.191:4000/craftsmen", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result === true) {
          setCraftsmanName("");
          setCraftsmanAddress("");
          setCraftsmanZip("");
          setCraftsmanCity("");
          setPhoneNumber("");
          setLogo(null);
          navigation.navigate("MesIntervenants");
        }
      });
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Créez un nouvel artisan</Text>

        <Input
          placeholder="Nom de l'entreprise"
          value={craftsmanName}
          onChangeText={(value) => setCraftsmanName(value)}
        />
        <Input
          placeholder="Adresse de l'artisan"
          value={craftsmanAddress}
          onChangeText={(value) => setCraftsmanAddress(value)}
        />
        <Input
          placeholder="Code postal de l'entreprise"
          value={craftsmanZip}
          onChangeText={(value) => setCraftsmanZip(value)}
        />
        <Input
          placeholder="Ville de l'artisan"
          value={craftsmanCity}
          onChangeText={(value) => setCraftsmanCity(value)}
        />
        <Input
          placeholder="Téléphone de l'entreprise"
          value={phoneNumber}
          onChangeText={(value) => setPhoneNumber(value)}
        />

        <Text style={styles.labelLogo}>Ajoutez le logo de l'artisan :</Text>

        <TouchableOpacity
          style={styles.imageContainer}
          onPress={handleImagePicker}
        >
          <Ionicons
            name="add"
            size={24}
            color="#663ED9"
            style={styles.plusIcon}
          />
          <Text style={styles.importText}>Importez une image</Text>
          <Text style={styles.formatText}>
            Format accepté : JPEG, HEIC, PNG
          </Text>
        </TouchableOpacity>

        <GradientButton text="Valider" onPress={handleValidate} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#663ED9",
    marginBottom: 30,
    textAlign: "center",
  },
  labelLogo: {
    width: "100%",
    fontSize: 16,
    fontWeight: "600",
    color: "#663ED9",
    marginTop: 10,
    marginBottom: 10,
  },
  imageContainer: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#663ED9",
    borderStyle: "dashed",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
    marginBottom: 30,
  },
  plusIcon: {
    marginBottom: 10,
  },
  importText: {
    fontSize: 16,
    color: "#663ED9",
    marginBottom: 5,
  },
  formatText: {
    fontSize: 12,
    color: "#999",
  },
});
