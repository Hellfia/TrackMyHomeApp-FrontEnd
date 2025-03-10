import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GradientButton from "../../../components/GradientButton";
import Input from "../../../components/Input";
import ReturnButton from "../../../components/ReturnButton";
import globalStyles from "../../../styles/globalStyles";
import Joi from "joi"; // Import Joi

export default function UpdateCraftsman({ route, navigation }) {
  const { craftsman } = route.params;

  const [craftsmanCompagny, setCraftsmanCompagny] = useState(
    craftsman.craftsmanName || ""
  );
  const [craftsmanAddress, setCraftsmanAddress] = useState(
    craftsman.craftsmanAddress || ""
  );
  const [craftsmanZip, setCraftsmanZip] = useState(
    craftsman.craftsmanZip || ""
  );
  const [craftsmanCity, setCraftsmanCity] = useState(
    craftsman.craftsmanCity || ""
  );
  const [phoneNumber, setPhoneNumber] = useState(craftsman.phoneNumber || "");
  const [errors, setErrors] = useState({}); // Pour stocker les erreurs de validation

  const devUrl = process.env.DEV_URL;

  // Schéma de validation avec Joi
  const schema = Joi.object({
    craftsmanCompagny: Joi.string().min(1).optional().messages({
      "string.empty": "Le nom de l'artisan est obligatoire.",
      "string.min": "Le nom de l'artisan doit comporter au moins 1 caractères.",
    }),
    craftsmanAddress: Joi.string().min(1).optional().messages({
      "string.empty": "L'adresse de l'artisan est obligatoire.",
      "string.min": "L'adresse doit comporter au moins 1 caractères.",
    }),
    craftsmanZip: Joi.string().length(5).pattern(/^\d+$/).optional().messages({
      "string.empty": "Le code postal est obligatoire.",
      "string.length": "Le code postal doit comporter 5 chiffres.",
      "string.pattern.base":
        "Le code postal doit être composé uniquement de chiffres.",
    }),
    craftsmanCity: Joi.string().min(1).optional().messages({
      "string.empty": "La ville est obligatoire.",
      "string.min": "La ville doit comporter au moins 1 caractères.",
    }),
    phoneNumber: Joi.string().optional().length(10).pattern(/^\d+$/).messages({
      "string.empty": "Le numéro de téléphone est obligatoire.",
      "string.length": "Le numéro de téléphone doit comporter 10 chiffres.",
      "string.pattern.base":
        "Le numéro de téléphone doit être composé uniquement de chiffres.",
    }),
  });

  const handleUpdateProfile = () => {
    const { error } = schema.validate({
      craftsmanCompagny,
      craftsmanAddress,
      craftsmanZip,
      craftsmanCity,
      phoneNumber,
    });

    if (error) {
      // Si une erreur est trouvée, on les ajoute dans l'état errors
      const errorDetails = error.details.reduce((acc, curr) => {
        acc[curr.path[0]] = curr.message;
        return acc;
      }, {});
      setErrors(errorDetails);
      return;
    }

    // Si la validation est réussie, on envoie les données
    fetch(`${devUrl}/craftsmen/${craftsman.craftsmanName}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        craftsmanName: craftsmanCompagny,
        craftsmanAddress: craftsmanAddress,
        craftsmanZip: craftsmanZip,
        craftsmanCity: craftsmanCity,
        phoneNumber: phoneNumber,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          navigation.goBack();
        }
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={globalStyles.header}>
        <ReturnButton onPress={() => navigation.goBack()} />
        <Text style={globalStyles.title}>Modifier votre artisan</Text>
      </View>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.inputContainer}>
          <Input
            style={styles.inputText}
            placeholder="Nom de l'artisan"
            value={craftsmanCompagny}
            onChangeText={(value) => setCraftsmanCompagny(value)}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {errors.craftsmanCompagny && (
            <Text style={styles.errorText}>{errors.craftsmanCompagny}</Text>
          )}

          <Input
            style={styles.inputText}
            placeholder="Adresse de l'artisan"
            value={craftsmanAddress}
            onChangeText={(value) => setCraftsmanAddress(value)}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {errors.craftsmanAddress && (
            <Text style={styles.errorText}>{errors.craftsmanAddress}</Text>
          )}

          <Input
            style={styles.inputText}
            placeholder="Code postal de l'artisan"
            value={craftsmanZip}
            onChangeText={(value) => setCraftsmanZip(value)}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {errors.craftsmanZip && (
            <Text style={styles.errorText}>{errors.craftsmanZip}</Text>
          )}

          <Input
            style={styles.inputText}
            placeholder="Ville de l'artisan"
            value={craftsmanCity}
            onChangeText={(value) => setCraftsmanCity(value)}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {errors.craftsmanCity && (
            <Text style={styles.errorText}>{errors.craftsmanCity}</Text>
          )}

          <Input
            style={styles.inputText}
            placeholder="Téléphone de l'artisan"
            value={phoneNumber}
            onChangeText={(value) => setPhoneNumber(value)}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {errors.phoneNumber && (
            <Text style={styles.errorText}>{errors.phoneNumber}</Text>
          )}
        </View>

        <GradientButton onPress={handleUpdateProfile} text="Mettre à jour" />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  inputContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  inputText: {
    width: "100%",
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ddd",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
  },
});
