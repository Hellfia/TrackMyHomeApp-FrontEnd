// UpdateProfileConstructeur.js
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";

import ReturnButton from "../../../components/ReturnButton";
import InputProfil from "../../../components/InputProfil";
import Input from "../../../components/Input";
import GradientButton from "../../../components/GradientButton";
import updateProfileConstructorSchema from "../../../schemas/UpdateProfilConstructorSchema";
import { scale, rfs } from "../../../utils/scale";

const HEADER_HEIGHT = scale(110);
const AVATAR_SIZE = scale(120);

export default function UpdateProfileConstructeur({ route, navigation }) {
  const { data } = route.params;
  const insets = useSafeAreaInsets();
  const token = useSelector((s) => s.constructeur.value.token);

  const [constructorName, setConstructorName] = useState(
    data.constructorName || ""
  );
  const [constructorSiret, setConstructorSiret] = useState(
    data.constructorSiret || ""
  );
  const [email, setEmail] = useState(data.email || "");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(data.phoneNumber || "");
  const [address, setAddress] = useState(data.address || "");
  const [zipCode, setZipCode] = useState(data.zipCode || "");
  const [city, setCity] = useState(data.city || "");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const { error } = updateProfileConstructorSchema.validate(
      {
        constructorName,
        constructorSiret,
        email,
        password,
        zipCode,
        address,
        city,
        phoneNumber,
      },
      { abortEarly: false }
    );
    if (error) {
      const err = error.details.reduce((acc, cur) => {
        acc[cur.path[0]] = cur.message;
        return acc;
      }, {});
      setErrors(err);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleUpdateProfile = () => {
    if (!validate()) return;
    fetch(`${process.env.PROD_URL}/constructors/${token}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        constructorName,
        constructorSiret,
        email,
        password,
        city,
        zipCode,
        address,
        phoneNumber,
      }),
    })
      .then(() => navigation.goBack())
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
                placeholder="Nom de l'entreprise"
                value={constructorName}
                onChangeText={setConstructorName}
              />
              {errors.constructorName && (
                <Text style={styles.errorText}>{errors.constructorName}</Text>
              )}

              <TextInput
                style={styles.inputText}
                placeholder="Siret de l'entreprise"
                value={constructorSiret}
                onChangeText={setConstructorSiret}
                keyboardType="phone-pad"
              />
              {errors.constructorSiret && (
                <Text style={styles.errorText}>{errors.constructorSiret}</Text>
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
                placeholder="Numéro de téléphone"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
              {errors.phoneNumber && (
                <Text style={styles.errorText}>{errors.phoneNumber}</Text>
              )}

              <TextInput
                style={styles.inputText}
                placeholder="Adresse"
                value={address}
                onChangeText={setAddress}
              />
              {errors.address && (
                <Text style={styles.errorText}>{errors.address}</Text>
              )}

              <TextInput
                style={styles.inputText}
                placeholder="Code Postal"
                value={zipCode}
                onChangeText={setZipCode}
                keyboardType="number-pad"
              />
              {errors.zipCode && (
                <Text style={styles.errorText}>{errors.zipCode}</Text>
              )}

              <TextInput
                style={styles.inputText}
                placeholder="Ville"
                value={city}
                onChangeText={setCity}
              />
              {errors.city && (
                <Text style={styles.errorText}>{errors.city}</Text>
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

            {/* Bouton */}
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
    height: HEADER_HEIGHT, // même hauteur que le gradient
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
    paddingTop: AVATAR_SIZE / 2 + scale(16), // commence juste sous l'avatar
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
