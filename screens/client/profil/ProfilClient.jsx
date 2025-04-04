import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import avatar from "../../../assets/avatar.png";
import GradientButton from "../../../components/GradientButton";
import PurpleButton from "../../../components/PurpleButton";
import { logout } from "../../../reducers/client";
import globalStyles from "../../../styles/globalStyles";

export default function ProfilClient({ navigation }) {
  const dispatch = useDispatch();

  const client = useSelector((state) => state.client.value);

  const [infoClient, setInfoClient] = useState([]);

  const handleEditProfile = () => {
    navigation.navigate("UpdateProfileClient", {
      data: infoClient,
    });
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const devUrl = process.env.DEV_URL;

  useFocusEffect(
    useCallback(() => {
      const token = client.token;
      fetch(`https://track-my-home-backend.vercel.app/clients/${token}`)
        .then((res) => res.json())
        .then((data) => {
          setInfoClient(data.client);
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des données :", error);
        });
    }, [client.token])
  );

  const profileImage =
    infoClient && infoClient.profilePicture
      ? { uri: infoClient.profilePicture }
      : avatar;

  return (
    <SafeAreaView edges={["top", "left", "right"]}>
      <View style={styles.container}>
        <Text style={globalStyles.title}>Mon Profil</Text>
        <View style={styles.iconContainer}>
          <Image
            source={profileImage}
            style={styles.image}
            accessibilityLabel="Photo de profil de l'utilisateur"
          />
        </View>
        <View style={styles.infosContainer}>
          <View style={styles.infoContainer}>
            <Text>{infoClient.firstname}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text>{infoClient.lastname}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text>{infoClient.email}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text>*******</Text>
          </View>
        </View>

        <GradientButton
          text="Modifier mon profil"
          onPress={() => handleEditProfile()}
        />
        <PurpleButton
          onPress={() => handleLogout()}
          text="Se déconnecter"
          backgroundColor="#DB0000"
          icon="door-open"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  iconContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: "#663ED9",
  },
  infosContainer: {
    flexDirection: "column",
    marginBottom: 8,
  },
  infoContainer: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#663ED9",
    borderRadius: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
  },
});
