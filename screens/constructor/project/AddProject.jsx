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
import addProject from "../../../schemas/AddProjectSchema";

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

  const prodURL = process.env.PROD_URL

  const handlePress = () => {
    const { error } = addProject.validate({
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
    fetch(`${prodURL}/projects`, {
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
        token: constructeur.token,
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
            keyboardType="default"
            autoCapitalize="sentences"
          />
          {errors.firstname && (
            <Text style={styles.errorText}>{errors.firstname}</Text>
          )}

          <Input
            placeholder="Prénom du client"
            value={lastname}
            onChangeText={(value) => setLastname(value)}
            keyboardType="default"
            autoCapitalize="sentences"
          />
          {errors.lastname && (
            <Text style={styles.errorText}>{errors.lastname}</Text>
          )}

          <Input
            placeholder="Numero de téléphone"
            value={phoneNumber}
            onChangeText={(value) => setPhoneNumber(value)}
            keyboardType="phone-pad"
          />
          {errors.phoneNumber && (
            <Text style={styles.errorText}>{errors.phoneNumber}</Text>
          )}

          <Input
            placeholder="Adresse du chantier"
            value={constructionAdress}
            onChangeText={(value) => setConstructionAdress(value)}
            keyboardType="default"
            autoCapitalize="sentences"
          />
          {errors.constructionAdress && (
            <Text style={styles.errorText}>{errors.constructionAdress}</Text>
          )}

          <Input
            placeholder="Code postal du chantier"
            value={constructionZipCode}
            onChangeText={(value) => setConstructionZipCode(value)}
            keyboardType="phone-pad"
          />
          {errors.constructionZipCode && (
            <Text style={styles.errorText}>{errors.constructionZipCode}</Text>
          )}

          <Input
            placeholder="Ville du chantier"
            value={constructionCity}
            onChangeText={(value) => setConstructionCity(value)}
            keyboardType="default"
            autoCapitalize="sentences"
          />
          {errors.constructionCity && (
            <Text style={styles.errorText}>{errors.constructionCity}</Text>
          )}

          <Input
            placeholder="Adresse email du client"
            value={email}
            onChangeText={(value) => setEmail(value)}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <Input
            placeholder="Mot de passe provisoire"
            value={password}
            onChangeText={(value) => setPassword(value)}
            keyboardType="default"
            secureTextEntry={true}
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
    width: "100%",
    color: "red",
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 10,
  },
});
