import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { updateProfile } from "../reducers/constructeur";
import Input from "../components/Input";
import GradientButton from "../components/GradientButton";

export default function UpdateProfileScreen() {
  const dispatch = useDispatch();

  const constructeur = useSelector((state) => state.constructeur.value);

  const [constructorName, setConstructorName] = useState("");
  const [constructorSiret, setConstructorSiret] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleUpdateProfile = () => {
    dispatch(
      updateProfile({
        constructorName: constructorName,
        constructorSiret: constructorSiret,
        email: email,
        password: password,
      })
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modifier Profil</Text>

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
        placeholder="Password : *******"
        value={password}
        onChangeText={(value) => setPassword(value)}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <GradientButton
        onPress={handleUpdateProfile}
        text="Mettre à jour"
      ></GradientButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ddd",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#663ED9",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
