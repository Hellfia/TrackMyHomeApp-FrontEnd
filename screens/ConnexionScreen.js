import React from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useState, useEffect } from "react";
import { login } from "../reducers/constructeur";
import { useDispatch, useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../assets/logo.webp";
import GradientButton from "../components/GradientButton";
import Input from "../components/Input";

export default function ConnexionScreen({ navigation }) {
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const dispatch = useDispatch();

  const handlePressConnexion = () => {
    fetch("https://192.168.1.191/constructors/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: signInEmail,
        password: signInPassword,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Réponse de l'API :", data);
        if (data.result === true) {
          console.log("lol");
          dispatch(
            login({ email: signInEmail, token: data.token, role: data.role })
          );

          setSignInEmail("");
          setSignInPassword("");

          navigation.navigate("ProTabs");
        } else {
          alert("Identifiants incorrects, veuillez réessayer.");
        }
      });
  };

  const handlePressConnexionClient = () => {
    navigation.navigate("ConnexionClient");
  };

  const handleProAccCreation = () => {
    navigation.navigate("ProAccCreation");
  };

  return (
    <SafeAreaView style={styles.safeContainer} edges={["top", "left", "right"]}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={logo} style={{ width: 90, height: 90 }} />
        </View>

        <Text style={styles.title}>TrackMyHome</Text>

        <Text style={styles.subtitle}>Espace Professionnel</Text>

        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={80}
        >
          <View style={styles.inputContainer}>
            <Input
              placeholder="Email"
              onChangeText={(value) => setSignInEmail(value)}
              value={signInEmail}
            />
            <Input
              placeholder="Mot de passe"
              onChangeText={(value) => setSignInPassword(value)}
              value={signInPassword}
            />
          </View>
          <GradientButton text="Se connecter" onPress={handlePressConnexion} />
        </KeyboardAvoidingView>

        <Text style={styles.profText}>
          Vous êtes un client ?{" "}
          <Text style={styles.profLink} onPress={handlePressConnexionClient}>
            Cliquez-ici
          </Text>
        </Text>
        <Text style={styles.profText}>
          Vous n'avez pas de compte ?{" "}
          <Text style={styles.profLink} onPress={handleProAccCreation}>
            Créez-en un ici
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  keyboardContainer: {
    width: "100%",
  },
  logoContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 40,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 0,
  },
  profText: {
    fontSize: 14,
    color: "#000000",
  },
  profLink: {
    color: "#8A2BE2",
    textDecorationLine: "underline",
  },
});
