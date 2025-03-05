import React, { useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import GradientButton from "../components/GradientButton";
import Input from "../components/Input";
import { login } from "../reducers/constructeur";

export default function ProAccCreationScreen({ navigation }) {
  const [constructorName, setConstructorName] = useState("");
  const [constructorSiret, setConstructorSiret] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleSignup = () => {
    fetch("https://track-my-home-backend.vercel.app/constructors/signup", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        constructorName: constructorName,
        constructorSiret: constructorSiret,
        email: email,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Réponse de l'API :", data);
        if (data.result === true) {
          console.log("lol");
          dispatch(login({ email: email, token: data.token }));
          setConstructorName("");
          setEmail("");
          setPassword("");
          setConstructorSiret("");
          navigation.replace("MainTabs");
          console.log("fini");
        }
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={require("../assets/logo.webp")} style={styles.logo} />

        <Text style={styles.title}>TrackMyHome</Text>
        <Text style={styles.subtitle}>Créer un compte professionnel</Text>

        <Input
          style={styles.input}
          placeholder="Nom de l'entreprise"
          value={constructorName}
          onChangeText={setConstructorName}
        />
        <Input
          style={styles.input}
          placeholder="Siret de l'entreprise"
          value={constructorSiret}
          onChangeText={setConstructorSiret}
        />
        <Input
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <Input
          style={styles.input}
          placeholder="Mot de passe"
          value={password}
          onChangeText={setPassword}
        />

        <GradientButton
          text="Créer votre compte"
          style={styles.button}
          onPress={handleSignup}
        ></GradientButton>

        <View style={styles.bottomTextContainer}>
          <Text style={styles.bottomText}>Vous avez déjà un compte? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Connexion")}>
            <Text style={styles.linkText}>Cliquez-ici</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  logo: {
    width: 80,
    height: 80,
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
  description: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 20,
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
});
