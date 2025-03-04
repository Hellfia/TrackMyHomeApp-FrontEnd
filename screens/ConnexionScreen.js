import React from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import { login, logout } from "../reducers/user";
import { useDispatch, useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../assets/logo.webp";
import GradientButton from "../components/GradientButton";
import Input from "../components/Input";
import PurpleButton from "../components/PurpleButton";

export default function ConnexionScreen({ navigation }) {
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const dispatch = useDispatch();
  const constructor = useSelector((state) => state.constructor.value);

  const handlePressConnexion = () => {
    navigation.navigate("MainTabs");
  };

  const handlePressConnexionClient = () => {
    console.log("test");
  };

  const handletest = () => {
    navigation.navigate("ConnexionClient");
  };

  const handleConnexion = () => {
    fetch("http://localhost:4000/constructor/signin", {
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
          dispatch(login({ email: signInEmail, token: data.token }));
          setSignInEmail("");
          setSignInPassword("");
          setIsModalVisible(false);
        }
      });
  };
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
            <Input placeholder="Email" />
            <Input placeholder="Mot de passe" secureTextEntry />
          </View>
          <GradientButton text="Se connecter" onPress={handlePressConnexion} />
          <PurpleButton text="test" onPress={handletest} />
        </KeyboardAvoidingView>

        <Text style={styles.profText}>
          Vous êtes un client ?{" "}
          <Text style={styles.profLink} onPress={handlePressConnexionClient}>
            Cliquez-ici
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
