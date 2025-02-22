import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ConnexionScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Logique d'authentification...
    navigation.replace("MainTabs");
  };

  const handleForgotPassword = () => {
    // Logique pour le mot de passe oublié
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Text style={styles.title}>Track My Home</Text>
      <Text style={styles.subtitle}>
        Suivez la construction de votre maison
      </Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Adresse e-mail"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Se connecter</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.linkText}>Mot de passe oublié ?</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
    marginBottom: 30,
    textAlign: "center",
    color: "#666",
  },
  form: {
    marginHorizontal: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#6C63FF",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  linkText: {
    color: "#6C63FF",
    textAlign: "center",
    marginTop: 10,
  },
});
