import React, { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import GradientButton from "../../../components/GradientButton";
import Input from "../../../components/Input";
import InputFiles from "../../../components/InputFiles";
import ReturnButton from "../../../components/ReturnButton";
import globalStyles from "../../../styles/globalStyles";

export default function CreatCraftsman({ navigation }) {
  const [craftsmanName, setCraftsmanName] = useState("");
  const [craftsmanAddress, setCraftsmanAddress] = useState("");
  const [craftsmanZip, setCraftsmanZip] = useState("");
  const [craftsmanCity, setCraftsmanCity] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const token = useSelector((state) => state.constructeur.value.token);
  const [logo, setLogo] = useState(null);

  const scrollViewRef = useRef(null);

  useEffect(() => {
    // Crée un écouteur d'événement pour l'apparition du clavier
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow", // Le type d'événement à écouter (lorsque le clavier devient visible)
      () => {
        // Lorsque le clavier apparaît, on fait défiler la vue jusqu'à la fin
        // Cela garantit que le contenu du bas de l'écran soit visible quand le clavier est affiché
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }
    );

    // Fonction de nettoyage qui se déclenche lorsque le clavier se ferme
    return () => {
      // Enlève l'écouteur d'événement créé pour 'keyboardDidShow' afin d'éviter les fuites de mémoire
      keyboardDidShowListener.remove();
    };
  }, []); // Le tableau vide [] signifie que cet effet s'exécute uniquement à l'apparaition du clavier

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
      craftsmanLogo: logo ? logo : "",
      craftsmanAddress: craftsmanAddress,
      craftsmanZip: craftsmanZip,
      craftsmanCity: craftsmanCity,
      phoneNumber: phoneNumber,
      constructeurToken: token,
    };

    const devUrl = process.env.DEV_URL;

    fetch(`${devUrl}/craftsmen`, {
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
          navigation.navigate("Artisans");
        }
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={globalStyles.header}>
        <ReturnButton onPress={() => navigation.goBack()} />

        <Text style={globalStyles.title}>Créer un nouvel artisan</Text>
      </View>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView style={styles.inputContainer} ref={scrollViewRef}>
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
          <View style={styles.inputFilesContainer}>
            <InputFiles />
          </View>
        </ScrollView>
        <GradientButton text="Valider" onPress={handleValidate} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  inputContainer: {
    marginTop: 40,
  },
  labelLogo: {
    fontSize: 16,
    fontWeight: "500",
    color: "#663ED9",
    marginTop: 10,
    marginBottom: 10,
  },
  inputFilesContainer: {
    height: 140,
    marginBottom: 30,
  },
});
