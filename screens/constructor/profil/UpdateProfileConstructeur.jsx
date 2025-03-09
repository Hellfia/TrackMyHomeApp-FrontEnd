import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import GradientButton from "../../../components/GradientButton";
import Input from "../../../components/Input";
import ReturnButton from "../../../components/ReturnButton";
import globalStyles from "../../../styles/globalStyles";

export default function UpdateProfileConstructeur({ navigation }) {
  const dispatch = useDispatch();

  const constructeur = useSelector((state) => state.constructeur.value);

  const [constructorName, setConstructorName] = useState("");
  const [constructorSiret, setConstructorSiret] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const token = constructeur.token;

  const devUrl = process.env.DEV_URL;

  const handleUpdateProfile = () => {
    fetch(`${devUrl}/constructors/${token}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        constructorName: constructorName,
        constructorSiret: constructorSiret,
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
            placeholder="Nom de l'entreprise"
            value={constructorName}
            onChangeText={(value) => setConstructorName(value)}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Input
            style={styles.inputText}
            placeholder="Siret de l'entreprise"
            value={constructorSiret}
            onChangeText={(value) => setConstructorSiret(value)}
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
