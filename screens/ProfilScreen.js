import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Input from "../components/Input";
import PurpleButton from "../components/PurpleButton";
import icon from "../assets/icon.png";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../reducers/constructeur";
import { useState, useEffect } from "react";

export default function MonCompteScreen({ navigation }) {
  const dispatch = useDispatch();
  const constructeur = useSelector((state) => state.constructeur.value);
  const [infoConstructor, setInfoConstructor] = useState([]);

  // pour édite le profil
  const handleEditProfile = () => {
    navigation.navigate("UpdateProfile");
  };
  //pour se déconnecter
  const handleLogout = () => {
    dispatch(logout());
  };
  const handlePress = () => {
    navigation.navigate("Intervenants");
  };

  useEffect(() => {
    const token = constructeur.token;
    fetch(`http://192.168.1.191:4000/projects/clients/${token}`)
      .then((res) => res.json())
      .then((data) => {
        setInfoConstructor(data);
      });
  }, []);
  return (
    <SafeAreaView style={styles.safeContainer} edges={["top", "left", "right"]}>
      <View style={styles.container}>
        <Text style={styles.title}>Mon Profil</Text>
        <View style={styles.iconContainer}>
          <Image source={icon} style={{ width: 90, height: 90 }} />
        </View>
        <View style={styles.infosContainer}>
          <View style={styles.infoContainer}>
            <Text>constructeur Name</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text>constructeur Siret</Text>
          </View>{" "}
          <View style={styles.infoContainer}>
            <Text>constructeur Email</Text>
          </View>{" "}
          <View style={styles.infoContainer}>
            <Text>constructeur Password</Text>
          </View>
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
  infoContainer: {
    width: "100%",
    borderWidth: 2,
    borderColor: "#663ED9",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },

  buttonLogout: {
    backgroundColor: "#FE5900",
    borderRadius: 8,
    padding: 12,
    width: "100%",
    //marginTop: 6,
    alignItems: "center",
    paddingVertical: 14,
  },
  infosContainer: {
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
