// ProfilClient.js
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { Image, StyleSheet, Text, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import avatar from "../../../assets/avatar.png";
import GradientButton from "../../../components/GradientButton";
import PurpleButton from "../../../components/PurpleButton";
import { logout } from "../../../reducers/client";
import globalStyles from "../../../styles/globalStyles";

export default function ProfilClient({ navigation }) {
  const dispatch = useDispatch();
  const prodURL = process.env.PROD_URL;
  const client = useSelector((state) => state.client.value);

  // 1️⃣ Initialisation comme objet, pas tableau
  const [infoClient, setInfoClient] = useState({});

  const handleEditProfile = () => {
    navigation.navigate("UpdateProfileClient", {
      data: infoClient,
    });
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  useFocusEffect(
    useCallback(() => {
      const token = client.token;
      fetch(`${prodURL}/clients/${token}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("dataClient:", data);
          if (data.client) {
            setInfoClient(data.client);
          } else {
            Alert.alert("Erreur", "Données du client introuvables");
          }
        })
        .catch((error) => {
          console.error("Erreur récupération profil :", error);
          Alert.alert("Erreur réseau", error.message);
        });
    }, [client.token])
  );

  // 2️⃣ Optional chaining + fallback
  const profileImage =
    infoClient.profilePicture?.length > 0
      ? { uri: infoClient.profilePicture }
      : avatar;

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
      <Text style={globalStyles.title}>Mon Profil</Text>

      <View style={styles.iconContainer}>
        <Image
          source={profileImage}
          style={styles.image}
          accessibilityLabel="Photo de profil"
        />
      </View>

      <View style={styles.infosContainer}>
        <View style={styles.infoContainer}>
          <Text>{infoClient.firstname ?? ""}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text>{infoClient.lastname ?? ""}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text>{infoClient.email ?? ""}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text>*******</Text>
        </View>
      </View>

      <GradientButton
        text="Modifier mon profil"
        onPress={handleEditProfile}
        style={styles.button}
      />

      <PurpleButton
        onPress={handleLogout}
        text="Se déconnecter"
        backgroundColor="#DB0000"
        icon="door-open"
        style={styles.button}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  iconContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: "#663ED9",
  },
  infosContainer: {
    marginBottom: 24,
  },
  infoContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#663ED9",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    // omet le fontSize ici, Text hérite de ses propres styles
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    marginTop: 12,
  },
});
