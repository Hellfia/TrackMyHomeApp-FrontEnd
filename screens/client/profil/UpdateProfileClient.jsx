import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import GradientButton from "../../../components/GradientButton";
import Input from "../../../components/Input";
import InputProfil from "../../../components/InputProfil";
import ReturnButton from "../../../components/ReturnButton";
import globalStyles from "../../../styles/globalStyles";

import updateProfileClientSchema from "../../../schemas/UpdateProfilClientSchema";

export default function UpdateProfileClient({ route, navigation }) {
  const { data } = route.params;

  const client = useSelector((state) => state.client.value);

  const [firstname, setFirstname] = useState(data.firstname || "");
  const [lastname, setLastname] = useState(data.lastname || "");
  const [email, setEmail] = useState(data.email || "");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});

  const token = client.token;

  const devUrl = process.env.DEV_URL;

  // Validation des données
  const validate = () => {
    const { error } = updateProfileClientSchema.validate(
      { firstname, lastname, email, password },
      { abortEarly: false }
    );
    if (error) {
      const errorDetails = error.details.reduce((acc, curr) => {
        acc[curr.path[0]] = curr.message;
        return acc;
      }, {});
      setErrors(errorDetails); // Assignation des erreurs
      return false;
    }
    setErrors({}); // Aucun problème
    return true;
  };

  const handleUpdateProfile = () => {
    // Validation des données avant l'appel API
    if (!validate()) {
      return;
    }

    fetch(`${devUrl}/clients/${token}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
          navigation.navigate("Profil");
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={globalStyles.header}>
        <ReturnButton onPress={() => navigation.goBack()} />
        <Text style={globalStyles.title}>Modifier votre Profil</Text>
      </View>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView>
          <View style={styles.inputProfilContainer}>
            <InputProfil />
          </View>
          <View style={styles.inputContainer}>
            <Input
              style={styles.inputText}
              placeholder="Nom"
              value={firstname}
              onChangeText={(value) => setFirstname(value)}
              autoCapitalize="sentences"
              autoCorrect={false}
              keyboardType="default"
            />
            {errors.firstname && (
              <Text style={styles.errorText}>{errors.firstname}</Text>
            )}

            <Input
              style={styles.inputText}
              placeholder="Prénom"
              value={lastname}
              onChangeText={(value) => setLastname(value)}
              autoCapitalize="sentences"
              autoCorrect={false}
              keyboardType="default"
            />
            {errors.lastname && (
              <Text style={styles.errorText}>{errors.lastname}</Text>
            )}

            <Input
              style={styles.inputText}
              placeholder="Email"
              value={email}
              onChangeText={(value) => setEmail(value)}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}

            <Input
              style={styles.inputText}
              placeholder="Mot de passe"
              value={password}
              onChangeText={(value) => setPassword(value)}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry={true}
              keyboardType="default"
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
          </View>
        </ScrollView>
        <GradientButton
          onPress={handleUpdateProfile}
          text="Mettre à jour"
        ></GradientButton>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  inputProfilContainer: {
    marginTop: 40,
  },
  inputContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    marginTop: 40,
  },
  inputText: {
    width: "100%",
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ddd",
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    color: "red",
    marginTop: -10,
    marginBottom: 10,
    width: "100%",
    marginLeft: 15,
  },
});
