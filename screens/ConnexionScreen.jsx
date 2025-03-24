import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import logo from "../assets/logo.webp";
import GradientButton from "../components/GradientButton";
import Input from "../components/Input";
import { loginClient } from "../reducers/client";
import { loginConstructeur } from "../reducers/constructeur";

export default function ConnexionScreen({ navigation }) {
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  const dispatch = useDispatch();

  const devUrl = process.env.DEV_URL;

  const handlePressConnexion = () => {
    fetch(`https://track-my-home-backend.vercel.app/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: signInEmail,
        password: signInPassword,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          if (data.role === "client") {
            dispatch(
              loginClient({
                clientId: data.clientId,
                token: data.token,
                role: "client",
                projectId: data.projectId,
              })
            );
          } else if (data.role === "constructeur") {
            dispatch(
              loginConstructeur({
                constructorId: data.constructorId,
                token: data.token,
                role: "constructeur",
              })
            );
          }
          setSignInEmail("");
          setSignInPassword("");
          navigation.navigate("MainTabs");
        } else {
          alert("Identifiants incorrects, veuillez réessayer.");
        }
      });
  };

  const handleProAccCreation = () => {
    navigation.navigate("ProAccCreation");
  };

  return (
    <SafeAreaView style={styles.safeContainer} edges={["top", "left", "right"]}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={logo}
            style={{ width: 100, height: 100 }}
            accessibilityLabel="Logo de TrackMyHome"
          />
        </View>

        <Text style={styles.title}>TrackMyHome</Text>

        <Text style={styles.subtitle}>
          Suivez l'avancement de votre projet !
        </Text>

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
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Input
              placeholder="Mot de passe"
              onChangeText={(value) => setSignInPassword(value)}
              value={signInPassword}
              secureTextEntry={true}
              keyboardType="default"
            />
          </View>
          <GradientButton text="Se connecter" onPress={handlePressConnexion} />
        </KeyboardAvoidingView>

        <Text style={styles.text}>
          Vous êtes un professionnel et vous n'avez pas encore de compte ?{" "}
          <Text style={styles.link} onPress={handleProAccCreation}>
            Cliquez-ici !
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
  text: {
    fontSize: 14,
    color: "#000000",
    textAlign: "center",
  },
  link: {
    color: "#8A2BE2",
    textDecorationLine: "underline",
  },
});
