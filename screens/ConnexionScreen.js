import React from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../assets/logo.webp";
import GradientButton from "../components/GradientButton";
import Input from "../components/Input";

export default function ConnexionScreen({ navigation }) {
  const handlePressConnexion = () => {
    navigation.navigate("MainTabs");
  };

  const handlePressConnexionClient = () => {
    navigation.navigate("ConnexionClient");
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
          <GradientButton text="Se connecter" onPress={handlePress} />
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
