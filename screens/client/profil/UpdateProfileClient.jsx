import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import GradientButton from "../../../components/GradientButton";
import Input from "../../../components/Input";
import ReturnButton from "../../../components/ReturnButton";
import globalStyles from "../../../styles/globalStyles";

export default function UpdateProfileClient({ navigation }) {
  const client = useSelector((state) => state.client.value);

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const token = client.token;

  const devUrl = process.env.DEV_URL;

  const handleUpdateProfile = () => {
    fetch(`${devUrl}/clients/${token}`, {
      method: "PUT",
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
        if (data.result) {
          navigation.navigate("Profil");
        }
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
        <View style={styles.inputContainer}>
          <Input
            style={styles.inputText}
            placeholder="Nom"
            value={firstname}
            onChangeText={(value) => setFirstname(value)}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Input
            style={styles.inputText}
            placeholder="Prénom"
            value={lastname}
            onChangeText={(value) => setLastname(value)}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Input
            style={styles.inputText}
            placeholder="Email"
            value={email}
            onChangeText={(value) => setEmail(value)}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Input
            style={styles.inputText}
            placeholder="Mot de passe"
            value={password}
            onChangeText={(value) => setPassword(value)}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

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
  inputContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
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
});
