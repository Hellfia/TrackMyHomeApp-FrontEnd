import Joi from "joi"; // Import Joi
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
  const [logo, setLogo] = useState(null);
  const [errors, setErrors] = useState({}); // State to hold validation errors

  const token = useSelector((state) => state.constructeur.value.token);

  const scrollViewRef = useRef(null);

  // Schéma de validation avec Joi
  const schema = Joi.object({
    craftsmanName: Joi.string().min(1).required().messages({
      "string.empty": "Le nom de l'entreprise est obligatoire.",
      "string.min":
        "Le nom de l'entreprise doit comporter au moins 1 caractères.",
    }),
    craftsmanAddress: Joi.string().min(1).required().messages({
      "string.empty": "L'adresse est obligatoire.",
      "string.min": "L'adresse doit comporter au moins 1 caractères.",
    }),
    craftsmanZip: Joi.string().length(5).pattern(/^\d+$/).required().messages({
      "string.empty": "Le code postal est obligatoire.",
      "string.length": "Le code postal doit comporter 5 chiffres.",
      "string.pattern.base":
        "Le code postal doit être composé uniquement de chiffres.",
    }),
    craftsmanCity: Joi.string().min(1).required().messages({
      "string.empty": "La ville est obligatoire.",
      "string.min": "La ville doit comporter au moins 1 caractères.",
    }),
    phoneNumber: Joi.string().length(10).pattern(/^\d+$/).required().messages({
      "string.empty": "Le numéro de téléphone est obligatoire.",
      "string.length": "Le numéro de téléphone doit comporter 10 chiffres.",
      "string.pattern.base":
        "Le numéro de téléphone doit être composé uniquement de chiffres.",
    }),
    logo: Joi.optional(), // Le logo peut être une option
  });

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }
    );

    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleValidate = () => {
    const { error } = schema.validate({
      craftsmanName,
      craftsmanAddress,
      craftsmanZip,
      craftsmanCity,
      phoneNumber,
      logo,
    });

    if (error) {
      // Si une erreur de validation est trouvée, on met à jour l'état des erreurs
      const errorDetails = error.details.reduce((acc, curr) => {
        acc[curr.path[0]] = curr.message;
        return acc;
      }, {});

      setErrors(errorDetails);
      return;
    }

    // Si la validation est correcte, on envoie les données
    const payload = {
      craftsmanName,
      craftsmanLogo: logo ? logo : "",
      craftsmanAddress,
      craftsmanZip,
      craftsmanCity,
      phoneNumber,
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
          setErrors({});
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
          {errors.craftsmanName && (
            <Text style={styles.errorText}>{errors.craftsmanName}</Text>
          )}

          <Input
            placeholder="Adresse de l'artisan"
            value={craftsmanAddress}
            onChangeText={(value) => setCraftsmanAddress(value)}
          />
          {errors.craftsmanAddress && (
            <Text style={styles.errorText}>{errors.craftsmanAddress}</Text>
          )}

          <Input
            placeholder="Code postal de l'entreprise"
            value={craftsmanZip}
            onChangeText={(value) => setCraftsmanZip(value)}
          />
          {errors.craftsmanZip && (
            <Text style={styles.errorText}>{errors.craftsmanZip}</Text>
          )}

          <Input
            placeholder="Ville de l'artisan"
            value={craftsmanCity}
            onChangeText={(value) => setCraftsmanCity(value)}
          />
          {errors.craftsmanCity && (
            <Text style={styles.errorText}>{errors.craftsmanCity}</Text>
          )}

          <Input
            placeholder="Téléphone de l'entreprise"
            value={phoneNumber}
            onChangeText={(value) => setPhoneNumber(value)}
          />
          {errors.phoneNumber && (
            <Text style={styles.errorText}>{errors.phoneNumber}</Text>
          )}

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
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
    width: "100%",
    marginLeft: 10,
  },
});
