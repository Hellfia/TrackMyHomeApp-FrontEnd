// UpdateProfileConstructeur.js
import React, { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";

import ReturnButton from "../../../components/ReturnButton";
import InputProfil from "../../../components/InputProfil";
import Input from "../../../components/Input";
import GradientButton from "../../../components/GradientButton";
import { logout } from "../../../reducers/constructeur";
import updateProfileConstructorSchema from "../../../schemas/UpdateProfilConstructorSchema";
import { scale, rfs } from "../../../utils/scale";

export default function UpdateProfileConstructeur({ route, navigation }) {
  const { data } = route.params;
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const prodURL = process.env.PROD_URL;
  const token = useSelector((s) => s.constructeur.value.token);

  const [constructorName, setConstructorName] = useState(
    data.constructorName || ""
  );
  const [phoneNumber, setPhoneNumber] = useState(data.phoneNumber || "");
  const [email, setEmail] = useState(data.email || "");
  const [address, setAddress] = useState(data.address || "");
  const [zipCode, setZipCode] = useState(data.zipCode || "");
  const [city, setCity] = useState(data.city || "");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const { error } = updateProfileConstructorSchema.validate(
      { constructorName, phoneNumber, email, address, zipCode, city },
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

  useFocusEffect(
    useCallback(() => {
      fetch(`${prodURL}/constructors/${token}`)
        .then((res) => res.json())
        .then((d) => {
          if (d.data) {
            setConstructorName(d.data.constructorName || "");
            setPhoneNumber(d.data.phoneNumber || "");
            setEmail(d.data.email || "");
            setAddress(d.data.address || "");
            setZipCode(d.data.zipCode || "");
            setCity(d.data.city || "");
          }
        })
        .catch(console.error);
    }, [token])
  );

  const handleUpdate = async () => {
    if (!validate()) return;
    try {
      const res = await fetch(`${prodURL}/constructors/${token}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          constructorName,
          phoneNumber,
          email,
          address,
          zipCode,
          city,
        }),
      });
      const json = await res.json();
      if (json.result) navigation.navigate("ProfilConstructeur");
      else console.error(json.error);
    } catch (e) {
      console.error(e);
    }
  };

  const profileImage = data.profilePicture
    ? { uri: data.profilePicture }
    : require("../../../assets/avatar.png");

  return (
    <View style={styles.pageContainer}>
      {/* HEADER */}
      <LinearGradient
        colors={["#8E44AD", "#372173"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.headerGradient, { paddingTop: insets.top }]}
      >
        <View style={styles.headerContent}>
          <ReturnButton onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>Modifier votre profil</Text>
          <View style={styles.headerPlaceholder} />
        </View>
      </LinearGradient>

      {/* AVATAR */}
      <View style={styles.iconContainer}>
        <InputProfil source={profileImage} />
      </View>

      {/* FORM */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.sectionWrapper}
        showsVerticalScrollIndicator={false}
      >
        <Input
          placeholder="Nom de l'entreprise"
          value={constructorName}
          onChangeText={setConstructorName}
          style={styles.input}
        />
        {errors.constructorName && (
          <Text style={styles.errorText}>{errors.constructorName}</Text>
        )}

        <Input
          placeholder="Numéro de téléphone"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          style={styles.input}
        />
        {errors.phoneNumber && (
          <Text style={styles.errorText}>{errors.phoneNumber}</Text>
        )}

        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          style={styles.input}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        <Input
          placeholder="Adresse"
          value={address}
          onChangeText={setAddress}
          style={styles.input}
        />
        {errors.address && (
          <Text style={styles.errorText}>{errors.address}</Text>
        )}

        <Input
          placeholder="Code Postal"
          value={zipCode}
          onChangeText={setZipCode}
          keyboardType="number-pad"
          style={styles.input}
        />
        {errors.zipCode && (
          <Text style={styles.errorText}>{errors.zipCode}</Text>
        )}

        <Input
          placeholder="Ville"
          value={city}
          onChangeText={setCity}
          style={styles.input}
        />
        {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}

        <GradientButton
          text="Valider"
          onPress={handleUpdate}
          style={styles.button}
        />
        <GradientButton
          text="Se déconnecter"
          onPress={() => dispatch(logout())}
          colors={["#FE5900", "#FAC778"]}
          style={[styles.button, { marginTop: scale(12) }]}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerGradient: {
    height: scale(200), // réduit la hauteur
    borderBottomLeftRadius: scale(28),
    borderBottomRightRadius: scale(28),
    justifyContent: "flex-end",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(16),
    paddingBottom: scale(8),
  },
  headerTitle: {
    flex: 1,
    textAlign: "center", // titre parfaitement centré
    fontSize: rfs(22),
    color: "#fff",
    fontWeight: "bold",
  },
  headerPlaceholder: {
    width: scale(32), // même largeur que ReturnButton
  },
  iconContainer: {
    alignItems: "center",
    marginTop: -scale(60), // avatar chevauche le bas du header
    zIndex: 2,
  },
  content: {
    flex: 1,
    marginTop: scale(10), // juste en dessous de l’avatar
    backgroundColor: "#fff",
    borderTopLeftRadius: scale(28),
    borderTopRightRadius: scale(28),
    overflow: "hidden",
  },
  sectionWrapper: {
    paddingHorizontal: scale(24),
    paddingTop: scale(20),
    paddingBottom: scale(30),
  },
  input: {
    marginBottom: scale(12),
  },
  button: {
    marginTop: scale(24),
    width: "100%",
  },
  errorText: {
    fontSize: rfs(12),
    color: "red",
    marginTop: -scale(8),
    marginBottom: scale(8),
  },
});
