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

          {/* <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => navigation.navigate("MainTabs")}
          >
            <View style={styles.shadowContainer}>
              <LinearGradient
                colors={["#8A2BE2", "#4B0082"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Se connecter</Text>
              </LinearGradient>
            </View>
          </TouchableOpacity> */}
          <GradientButton text="Se connecter" onPress={handlePressConnexion} />
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
  // buttonContainer: {
  //   width: "100%",
  //   marginBottom: 20,
  // },
  // shadowContainer: {
  //   borderRadius: 8,
  //   shadowColor: "#000",
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.5,
  //   shadowRadius: 4,
  // },
  // button: {
  //   borderRadius: 8,
  //   paddingVertical: 14,
  //   alignItems: "center",
  // },
  // buttonText: {
  //   color: "#FFFFFF",
  //   fontSize: 16,
  //   fontWeight: "bold",
  // },
  profText: {
    fontSize: 14,
    color: "#000000",
  },
  profLink: {
    color: "#8A2BE2",
    textDecorationLine: "underline",
  },
});
