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
import GradientButton from "../components/GradientButton";
import Input from "../components/Input";
import ReturnButton from "../components/ReturnButton";
import globalStyles from "../styles/globalStyles";

export default function AddProjectsScreen({ navigation }) {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [constructionAdress, setConstructionAdress] = useState("");
  const [constructionZipCode, setConstructionZipCode] = useState("");
  const [constructionCity, setConstructionCity] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const constructorId = "67c5906967201a0f704367dc";

  const handlePress = () => {
    fetch("http://192.168.1.146:4000/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstname: firstname,
        lastname: lastname,
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
          setConstructionCity(""),
          setEmail(""),
          setPassword(""),
          navigation.navigate("MainTabs");
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={globalStyles.header}>
        <ReturnButton onPress={() => navigation.navigate("Projet")} />
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
          <Input
            placeholder="Prénom du client"
            value={lastname}
            onChangeText={(value) => setLastname(value)}
          />
          <Input
            placeholder="Adresse du chantier"
            value={constructionAdress}
            onChangeText={(value) => setConstructionAdress(value)}
          />
          <Input
            placeholder="Code postal du chantier"
            value={constructionZipCode}
            onChangeText={(value) => setConstructionZipCode(value)}
          />
          <Input
            placeholder="Ville du chantier"
            value={constructionCity}
            onChangeText={(value) => setConstructionCity(value)}
          />
          <Input
            placeholder="Adresse email du client"
            value={email}
            onChangeText={(value) => setEmail(value)}
          />
          <Input
            placeholder="Mot de passe provisoire"
            value={password}
            onChangeText={(value) => setPassword(value)}
          />
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
    marginTop: 40,
    width: "100%",
  },
});
