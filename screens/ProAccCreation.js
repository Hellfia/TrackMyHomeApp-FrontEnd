import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import PurpleButton from "../components/PurpleButton";
import Input from "../components/Input";
import GradientButton from "../components/GradientButton";

export default function SignupProfessionalScreen({ navigation }) {
  const [companyName, setCompanyName] = useState("");
  const [siret, setSiret] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {};

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={require("../assets/logo.webp")} style={styles.logo} />

        <Text style={styles.title}>TrackMyHome</Text>
        <Text style={styles.subtitle}>Créer un compte professionnel</Text>

        <Text style={styles.description}>
          Créer votre compte avec adresse mail
        </Text>

        <Input
          style={styles.input}
          placeholder="Nom de l'entreprise"
          value={companyName}
          onChangeText={setCompanyName}
        />
        <Input
          style={styles.input}
          placeholder="Siret de l'entreprise"
          value={siret}
          onChangeText={setSiret}
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
