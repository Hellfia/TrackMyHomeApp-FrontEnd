import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import GradientButton from "../../../components/GradientButton";
import Input from "../../../components/Input";
import ReturnButton from "../../../components/ReturnButton";
import globalStyles from "../../../styles/globalStyles";
import Joi from "joi"; // Import Joi

export default function AddProjects({ navigation }) {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [constructionAdress, setConstructionAdress] = useState("");
  const [constructionZipCode, setConstructionZipCode] = useState("");
  const [constructionCity, setConstructionCity] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState({}); // Pour stocker les erreurs de validation

  const constructeur = useSelector((state) => state.constructeur.value);
  const constructorId = constructeur.constructorId;

  const devUrl = process.env.DEV_URL;

  // Schéma de validation avec Joi
  const schema = Joi.object({
    firstname: Joi.string().min(1).required().messages({
      "string.empty": "Le prénom est obligatoire.",
      "string.min": "Le prénom doit comporter au moins 1 caractères.",
    }),
    lastname: Joi.string().min(1).required().messages({
      "string.empty": "Le nom est obligatoire.",
      "string.min": "Le nom doit comporter au moins 1 caractères.",
    }),
    phoneNumber: Joi.string().length(10).pattern(/^\d+$/).required().messages({
      "string.empty": "Le numéro de téléphone est obligatoire.",
      "string.length": "Le numéro de téléphone doit comporter 10 chiffres.",
      "string.pattern.base":
        "Le numéro de téléphone doit être composé uniquement de chiffres.",
    }),
    constructionAdress: Joi.string().min(1).required().messages({
      "string.empty": "L'adresse du chantier est obligatoire.",
      "string.min":
        "L'adresse du chantier doit comporter au moins 1 caractères.",
    }),
    constructionZipCode: Joi.string()
      .length(5)
      .pattern(/^\d+$/)
      .required()
      .messages({
        "string.empty": "Le code postal est obligatoire.",
        "string.length": "Le code postal doit comporter 5 chiffres.",
        "string.pattern.base":
          "Le code postal doit être composé uniquement de chiffres.",
      }),
    constructionCity: Joi.string().min(3).required().messages({
      "string.empty": "La ville du chantier est obligatoire.",
      "string.min":
        "La ville du chantier doit comporter au moins 3 caractères.",
    }),
    email: Joi.string()
      .email({ tlds: { allow: false } }) // Allowing/disallowing specific TLDs (optional)
      .required()
      .messages({
        "string.empty": "L'email est obligatoire.",
        "string.email": "Veuillez entrer un email valide.",
      }),
    password: Joi.string().min(6).required().messages({
      "string.empty": "Le mot de passe est obligatoire.",
      "string.min": "Le mot de passe doit comporter au moins 6 caractères.",
    }),
  });

  const handlePress = () => {
    const { error } = schema.validate({
      firstname,
      lastname,
      phoneNumber,
      constructionAdress,
      constructionZipCode,
      constructionCity,
      email,
      password,
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
    fetch(`${devUrl}/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstname: firstname,
        lastname: lastname,
        phoneNumber: phoneNumber,
        constructionAdress: constructionAdress,
        constructionZipCode: constructionZipCode,
        constructionCity: constructionCity,
        email: email,
        password: password,
        constructeurId: constructorId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setFirstname(""),
          setLastname(""),
          setConstructionAdress(""),
          setConstructionZipCode(""),
          setConstructionCity(""),
          setEmail(""),
          setPassword(""),
          setPhoneNumber("");
        navigation.navigate("MainTabs");
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={globalStyles.header}>
        <ReturnButton onPress={() => navigation.goBack()} />
        <Text style={globalStyles.title}>Créer un nouveau chantier</Text>
      </View>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView style={styles.form}>
          <Input
            placeholder="Nom du client"
            value={firstname}
            onChangeText={(value) => setFirstname(value)}
          />
          {errors.firstname && (
            <Text style={styles.errorText}>{errors.firstname}</Text>
          )}

          <Input
            placeholder="Prénom du client"
            value={lastname}
            onChangeText={(value) => setLastname(value)}
          />
          {errors.lastname && (
            <Text style={styles.errorText}>{errors.lastname}</Text>
          )}

          <Input
            placeholder="Numero de téléphone"
            value={phoneNumber}
            onChangeText={(value) => setPhoneNumber(value)}
          />
          {errors.phoneNumber && (
            <Text style={styles.errorText}>{errors.phoneNumber}</Text>
          )}

          <Input
            placeholder="Adresse du chantier"
            value={constructionAdress}
            onChangeText={(value) => setConstructionAdress(value)}
          />
          {errors.constructionAdress && (
            <Text style={styles.errorText}>{errors.constructionAdress}</Text>
          )}

          <Input
            placeholder="Code postal du chantier"
            value={constructionZipCode}
            onChangeText={(value) => setConstructionZipCode(value)}
          />
          {errors.constructionZipCode && (
            <Text style={styles.errorText}>{errors.constructionZipCode}</Text>
          )}

          <Input
            placeholder="Ville du chantier"
            value={constructionCity}
            onChangeText={(value) => setConstructionCity(value)}
          />
          {errors.constructionCity && (
            <Text style={styles.errorText}>{errors.constructionCity}</Text>
          )}

          <Input
            placeholder="Adresse email du client"
            value={email}
            onChangeText={(value) => setEmail(value)}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <Input
            placeholder="Mot de passe provisoire"
            value={password}
            onChangeText={(value) => setPassword(value)}
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
        </ScrollView>

        <GradientButton text="Valider" onPress={handlePress} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  keyboardContainer: {
    width: "100%",
  },
  form: {
    width: "100%",
    marginTop: 40,
    marginBottom: 10,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
  },
});
