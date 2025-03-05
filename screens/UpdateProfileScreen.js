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

export default function UpdateProfileScreen() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.constructeur.value);

  const [constructorName, setConstructorName] = useState("");
  const [constructorSiret, setConstructorSiret] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (constructeur.constructorName) {
      setConstructorName(constructeur.constructorName);
      setConstructorSiret(constructeur.constructorSiret);
      setEmail(constructeur.email);
      setPassword(constructeur.password);
    }
  }, [user]);

  const handleUpdateProfile = () => {
    dispatch(
      updateProfile({
        constructorName,
        constructorSiret,
        email,
        password,
      })
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modifier Profil</Text>

      <TextInput
        style={styles.input}
        placeholder="Nom de l'entreprise"
        value={constructorName}
        onChangeText={setConstructorName}
      />

      <TextInput
        style={styles.input}
        placeholder="Numéro de SIRET"
        value={constructorSiret}
        onChangeText={setConstructorSiret}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
        <Text style={styles.buttonText}>Mettre à jour</Text>
      </TouchableOpacity>
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
