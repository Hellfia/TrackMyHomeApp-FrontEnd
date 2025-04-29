import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";

import GradientButton from "../../../components/GradientButton";
import InputProfil from "../../../components/InputProfil";
import ReturnButton from "../../../components/ReturnButton";
import updateProfileClientSchema from "../../../schemas/UpdateProfilClientSchema";
import { scale, rfs } from "../../../utils/scale";

const HEADER_HEIGHT = scale(110);
const AVATAR_SIZE = scale(120);

export default function UpdateProfileClient({ route, navigation }) {
  const { data } = route.params;
  const insets = useSafeAreaInsets();
  const client = useSelector((state) => state.client.value);
  const token = client.token;
  const prodURL = process.env.PROD_URL;

  const [firstname, setFirstname] = useState(data.firstname || "");
  const [lastname, setLastname] = useState(data.lastname || "");
  const [email, setEmail] = useState(data.email || "");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});

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
      setErrors(errorDetails);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleUpdateProfile = () => {
    if (!validate()) return;

    fetch(`${prodURL}/clients/${token}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        firstname,
        lastname,
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then(() => navigation.navigate("Profil"))
      .catch(console.error);
  };

  return (
    <LinearGradient
      colors={["#8E44AD", "#372173"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      locations={[0, 0.1]}
      style={[styles.pageContainer, { paddingTop: insets.top }]}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <ReturnButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Modifier votre Profil</Text>
      </View>

      {/* AVATAR qui chevauche le header */}
      <View
        style={[
          styles.iconContainer,
          { top: insets.top + HEADER_HEIGHT - AVATAR_SIZE / 2 },
        ]}
      >
        <InputProfil
          style={{
            width: AVATAR_SIZE,
            height: AVATAR_SIZE,
            borderRadius: AVATAR_SIZE / 2,
          }}
        />
      </View>

      {/* CONTENU BLANC ARRONDI */}
      <View style={styles.contentWrapper}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.sectionWrapper}
            showsVerticalScrollIndicator={false}
          >
            {/* Inputs */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputText}
                placeholder="Nom"
                value={firstname}
                onChangeText={setFirstname}
              />
              {errors.firstname && (
                <Text style={styles.errorText}>{errors.firstname}</Text>
              )}

              <TextInput
                style={styles.inputText}
                placeholder="Prénom"
                value={lastname}
                onChangeText={setLastname}
              />
              {errors.lastname && (
                <Text style={styles.errorText}>{errors.lastname}</Text>
              )}

              <TextInput
                style={styles.inputText}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}

              <TextInput
                style={styles.inputText}
                placeholder="Mot de passe"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>

            <GradientButton
              text="Mettre à jour"
              onPress={handleUpdateProfile}
              style={styles.button}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    height: HEADER_HEIGHT,
    justifyContent: "flex-end",
    paddingBottom: scale(16),
  },
  headerTitle: {
    position: "absolute",
    top: scale(16),
    alignSelf: "center",
    fontSize: rfs(24),
    color: "#fff",
    fontWeight: "bold",
    zIndex: 3,
  },
  iconContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 2,
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: scale(28),
    borderTopRightRadius: scale(28),
    overflow: "hidden",
  },
  content: {
    flex: 1,
    paddingTop: AVATAR_SIZE / 2 + scale(16),
    paddingHorizontal: scale(24),
  },
  sectionWrapper: {
    paddingBottom: scale(30),
  },
  inputContainer: {
    alignItems: "center",
  },
  inputText: {
    width: "100%",
    padding: scale(12),
    marginBottom: scale(10),
    borderWidth: 1,
    borderRadius: scale(8),
    borderColor: "#663ED9",
    fontSize: rfs(14),
  },
  errorText: {
    width: "100%",
    fontSize: rfs(12),
    color: "red",
    marginTop: -scale(8),
    marginBottom: scale(12),
    paddingLeft: scale(12),
  },
  button: {
    marginTop: scale(24),
    width: "100%",
  },
});
