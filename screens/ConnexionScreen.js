import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import logo from "../assets/icon.png";

import { LinearGradient } from "expo-linear-gradient";

export default function ConnexionScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={logo} style={{ width: 80, height: 80 }} />
      </View>

      <Text style={styles.title}>TrackMyHome</Text>

      <Text style={styles.subtitle}>
        Suivez la construction de votre maison
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          placeholderTextColor="#999"
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => navigation.navigate("MainTabs")}
      >
        <LinearGradient
          colors={["#8A2BE2", "#4B0082"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Se connecter</Text>
        </LinearGradient>
      </TouchableOpacity>

      <Text style={styles.profText}>
        Vous êtes un professionnel ?{" "}
        <Text style={styles.profLink}>Cliquez-ici</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 20,
    // Ajoutez éventuellement un style supplémentaire pour votre logo
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
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#8A2BE2",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
    // Pour ajouter une légère ombre (optionnel) :
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 2,
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 20,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    // Même principe si vous voulez une ombre autour du bouton
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.2,
    // shadowRadius: 4,
    // elevation: 2,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
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
