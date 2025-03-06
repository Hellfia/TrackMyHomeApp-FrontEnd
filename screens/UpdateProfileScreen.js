import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { updateProfile } from "../reducers/constructeur";
import Input from "../components/Input";
import GradientButton from "../components/GradientButton";
import ReturnButton from "../components/ReturnButton";
import globalStyles from "../styles/globalStyles";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UpdateProfileScreen({ navigation }) {
  const dispatch = useDispatch();

  const constructeur = useSelector((state) => state.constructeur.value);
  // console.log(constructeur);
  // const token = "RpXgY_HBiAWaWokmkmy1scU5-EdZwZeu";
  const [constructorName, setConstructorName] = useState("");
  const [constructorSiret, setConstructorSiret] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const token = constructeur.token;

  const handleUpdateProfile = () => {
    fetch(`http://192.168.1.191:4000/constructors/${token}`, {
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
        if (data.result === true)
          dispatch(
            updateProfile({
              constructorName: constructorName,
              constructorSiret: constructorSiret,
              email: email,
              password: password,
            })
          );
      });
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ReturnButton onPress={() => navigation.navigate("Profil")} />
        <Text style={globalStyles.title}>Modifier votre Profil</Text>
      </View>
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
          placeholder="Password : *******"
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row", // Alignement horizontal des éléments
    justifyContent: "center", // Espace entre le bouton et le titre
    alignItems: "center", // Centrage vertical

    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
    flex: 1, // Cela force le titre à prendre toute la largeur disponible pour le centrer
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
