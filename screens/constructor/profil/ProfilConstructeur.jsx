import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import avatar from "../../../assets/avatar.png";
import GradientButton from "../../../components/GradientButton";
import PurpleButton from "../../../components/PurpleButton";
import { logout } from "../../../reducers/constructeur";
import globalStyles from "../../../styles/globalStyles";

export default function ProfilConstructeur({ navigation }) {
  const dispatch = useDispatch();

  const constructeur = useSelector((state) => state.constructeur.value);

  const [infoConstructor, setInfoConstructor] = useState([]);

  const handleEditProfile = () => {
    navigation.navigate("UpdateProfileConstructeur", {
      data: infoConstructor,
    });
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const devUrl = process.env.DEV_URL;

  useFocusEffect(
    useCallback(() => {
      const token = constructeur.token;
      fetch(`https://track-my-home-backend.vercel.app/constructors/${token}`)
        .then((res) => res.json())
        .then((data) => {
          setInfoConstructor(data.constructor);
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des données :", error);
        });
    }, [constructeur.token])
  );

  const profileImage =
    infoConstructor && infoConstructor.profilePicture
      ? { uri: infoConstructor.profilePicture }
      : avatar;

  return (
    <SafeAreaView edges={["top", "left", "right"]}>
      <ScrollView>
        <View style={styles.container}>
          <Text style={globalStyles.title}>Mon Profil</Text>
          <View style={styles.iconContainer}>
            <Image source={profileImage} style={styles.image} />
          </View>

          <View style={styles.infosContainer}>
            <View style={styles.infoContainer}>
              <Text>{infoConstructor.constructorName}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text>{infoConstructor.constructorSiret}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text>{infoConstructor.email}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text>{infoConstructor.phoneNumber}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text>{infoConstructor.address}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text>{infoConstructor.zipCode}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text>{infoConstructor.city}</Text>
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  iconContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
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
