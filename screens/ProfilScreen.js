import React from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Input from "../components/Input";
import PurpleButton from "../components/PurpleButton";
import icon from "../assets/icon.png";
import { FontAwesomeIcon5 } from "@expo/vector-icons";

export default function MonCompteScreen({ navigation }) {
  const handleEditProfile = () => {
    // pour édite le profil
  };

  const handleLogout = () => {
    //pour se déconnecter
  };

  const handleCredits = () => {
    navigation.navigate("Credits");
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
        <PurpleButton text="Mes Intervenants" />
        <PurpleButton text="Modifer" />

        <TouchableOpacity style={styles.buttonLogout} onPress={handleLogout}>
          <Text style={styles.buttonText}>Se déconnecter</Text>
          <FontAwesomeIcon5
            size={22}
            //style={styles.icon}
            name="fa-light fa-arrow-right-from-bracket"
          />
        </TouchableOpacity>
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
  /* safeContainer: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  
  
  
  label: {
    width: 80,
    fontWeight: "600",
  },
  value: {
    fontWeight: "400",
  },
  buttonContainer: {
    marginTop: 24,
    alignItems: "center",
  },
  buttonEdit: {
    backgroundColor: "#6C63FF",
    borderRadius: 8,
    padding: 12,
    width: "80%",
    marginBottom: 12,
    alignItems: "center",
  },
  
  buttonSecondary: {
    backgroundColor: "#FFF",
    borderColor: "#6C63FF",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    width: "80%",
    marginTop: 8,
    alignItems: "center",
  },
  
  buttonTextSecondary: {
    color: "#6C63FF",
    fontWeight: "600",
  },*/
});
