import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Input from "../components/Input";
import PurpleButton from "../components/PurpleButton";
import icon from "../assets/icon.png";
import { useDispatch } from "react-redux";
import { logout, updateProfile } from "../reducers/constructeur";

export default function MonCompteScreen({ navigation }) {
  const dispatch = useDispatch();

  // pour édite le profil
  const handleEditProfile = () => {
    navigation.navigate("UpdateProfile");
  };
  //pour se déconnecter
  const handleLogout = () => {
    dispatch(logout());
    navigation.navigate("Connexion");
  };
  const handlePress = () => {
    navigation.navigate("Intervenants");
  };

  return (
    <SafeAreaView style={styles.safeContainer} edges={["top", "left", "right"]}>
      <View style={styles.container}>
        <Text style={styles.title}>Mon Profil</Text>
        <View style={styles.iconContainer}>
          <Image source={icon} style={{ width: 90, height: 90 }} />
        </View>
        <View style={styles.infoContainer}>
          <Input placeholder="Nom de l'entreprise : " />
          <Input placeholder="Siret de l'entreprise :" />

          <Input placeholder="Email :" />
          <Input placeholder="Mot de pass : *******" />
        </View>
        <PurpleButton
          text="Mes Intervenants"
          icon="user"
          onPress={handlePress}
        />
        <PurpleButton text="Modifier" onPress={() => handleEditProfile()} />
        <PurpleButton
          onPress={() => handleLogout()}
          text="Se déconnecter"
          backgroundColor="#fe5900"
          icon="door-open"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  buttonLogout: {
    backgroundColor: "#FE5900",
    borderRadius: 8,
    padding: 12,
    width: "100%",
    //marginTop: 6,
    alignItems: "center",
    paddingVertical: 14,
  },
  infoContainer: {
    flexDirection: "column",
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  container: {
    padding: 16,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 14,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "600",
  },
});
