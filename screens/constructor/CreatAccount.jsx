import Joi from "joi";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import GradientButton from "../../components/GradientButton";
import Input from "../../components/Input";
import { loginConstructeur } from "../../reducers/constructeur";

export default function CreatAccount({ navigation }) {
  const [constructorName, setConstructorName] = useState("");
  const [constructorSiret, setConstructorSiret] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [errors, setErrors] = useState({}); // Error state to hold validation errors
  const dispatch = useDispatch();

  const devUrl = process.env.DEV_URL;

  // Joi validation schema
  const schema = Joi.object({
    constructorName: Joi.string().min(1).max(50).required().messages({
      "string.empty": "Le nom de l'entreprise est obligatoire.",
      "string.min":
        "Le nom de l'entreprise doit contenir au moins 1 caractères.",
      "string.max":
        "Le nom de l'entreprise ne doit pas dépasser 50 caractères.",
    }),
    constructorSiret: Joi.string()
      .length(14)
      .pattern(/^\d+$/)
      .required()
      .messages({
        "string.empty": "Le numéro SIRET est obligatoire.",
        "string.length": "Le numéro SIRET doit comporter 14 chiffres.",
        "string.pattern.base":
          "Le numéro SIRET doit être composé uniquement de chiffres.",
      }),
    email: Joi.string()
      .email({ tlds: { allow: false } }) // Allowing/disallowing specific TLDs (optional)
      .required()
      .messages({
        "string.empty": "L'email est obligatoire.",
        "string.email": "Veuillez entrer un email valide.",
      }),

    password: Joi.string().min(3).required().messages({
      "string.empty": "Le mot de passe est obligatoire.",
      "string.min": "Le mot de passe doit contenir au moins 6 caractères.",
    }),
    phoneNumber: Joi.string().length(10).pattern(/^\d+$/).required().messages({
      "string.empty": "Le numéro de téléphone est obligatoire.",
      "string.length": "Le numéro de téléphone doit comporter 10 chiffres.",
      "string.pattern.base":
        "Le numéro de téléphone doit être composé uniquement de chiffres.",
    }),
    city: Joi.string().min(3).required().messages({
      "string.empty": "La ville est obligatoire.",
      "string.min": "Le ville doit contenir au moins 3 caractères.",
    }),
    address: Joi.string().required().messages({
      "string.empty": "L'adresse est obligatoire.",
    }),
    zipCode: Joi.string().length(5).pattern(/^\d+$/).required().messages({
      "string.empty": "Le code postal est obligatoire.",
      "string.length": "Le code postal doit comporter 5 chiffres.",
      "string.pattern.base":
        "Le code postal doit être composé uniquement de chiffres.",
    }),
  });

  // Function to validate form data
  const validate = () => {
    const { error } = schema.validate(
      {
        constructorName,
        constructorSiret,
        email,
        password,
        city,
        zipCode,
        address,
        phoneNumber,
      },
      { abortEarly: false }
    );
    if (error) {
      const errorDetails = error.details.reduce((acc, curr) => {
        acc[curr.path[0]] = curr.message;
        return acc;
      }, {});
      setErrors(errorDetails); // Set validation errors
      return false;
    }
    setErrors({}); // Clear errors if validation passes
    return true;
  };

  const handleSignup = () => {
    if (!validate()) {
      return; // Stop further execution if validation fails
    }

    fetch(`${devUrl}/constructors/signup`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        constructorName: constructorName,
        constructorSiret: constructorSiret,
        email: email,
        password: password,
        city: city,
        address: address,
        zipCode: zipCode,
        phoneNumber: phoneNumber,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          dispatch(
            loginConstructeur({
              constructorId: data.constructorId,
              token: data.token,
              role: "constructeur",
            })
          );
          setConstructorName("");
          setEmail("");
          setPassword("");
          setConstructorSiret("");
          setCity("");
          setPhoneNumber("");
          setZipCode("");
          setAddress("");
          navigation.navigate("MainTabs");
        }
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require("../../assets/logo.webp")} style={styles.logo} />

      <Text style={styles.title}>TrackMyHome</Text>
      <Text style={styles.subtitle}>Créer un compte professionnel</Text>

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView style={styles.form}>
          <Input
            style={styles.input}
            placeholder="Nom de l'entreprise"
            value={constructorName}
            onChangeText={setConstructorName}
          />
          {errors.constructorName && (
            <Text style={styles.errorText}>{errors.constructorName}</Text>
          )}

          <Input
            style={styles.input}
            placeholder="Siret de l'entreprise"
            value={constructorSiret}
            onChangeText={setConstructorSiret}
          />
          {errors.constructorSiret && (
            <Text style={styles.errorText}>{errors.constructorSiret}</Text>
          )}

          <Input
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          <Input
            style={styles.input}
            placeholder="Numéro de téléphone"
            keyboardType="numeric"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
          {errors.phoneNumber && (
            <Text style={styles.errorText}>{errors.phoneNumber}</Text>
          )}
          <Input
            style={styles.input}
            placeholder="Adresse"
            value={address}
            onChangeText={setAddress}
          />
          {errors.address && (
            <Text style={styles.errorText}>{errors.address}</Text>
          )}
          <Input
            style={styles.input}
            placeholder="Code Postal"
            keyboardType="numeric"
            value={zipCode}
            onChangeText={setZipCode}
          />
          {errors.zipCode && (
            <Text style={styles.errorText}>{errors.zipCode}</Text>
          )}
          <Input
            style={styles.input}
            placeholder="Ville"
            value={city}
            onChangeText={setCity}
          />
          {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}

          <Input
            style={styles.input}
            placeholder="Mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
          <GradientButton
            text="Créer votre compte"
            style={styles.button}
            onPress={handleSignup}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.bottomTextContainer}>
        <Text style={styles.bottomText}>Vous avez déjà un compte? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Connexion")}>
          <Text style={styles.linkText}>Cliquez-ici</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    resizeMode: "contain",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#000000",
  },
  subtitle: {
    fontSize: 16,
    color: "#555555",
    marginTop: 5,
    marginBottom: 20,
  },
  keyboardContainer: {
    width: "100%",
  },
  form: {
    width: "100%",
    marginTop: 25,
    marginBottom: 10,
  },
  bottomTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 40,
  },
  bottomText: {
    fontSize: 14,
    color: "#000000",
  },
  linkText: {
    fontSize: 14,
    color: "#8A2BE2",
    textDecorationLine: "underline",
  },
  errorText: {
    fontSize: 12,
    color: "red",
    marginTop: -14,
    paddingBottom: 12,
  },
});
