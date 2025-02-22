import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MonCompteScreen({ navigation }) {
  const handleEditProfile = () => {
    // Logique pour modifier le profil
  };

  const handleLogout = () => {
    // Logique de déconnexion (ex. navigation.replace('Connexion'))
  };

  const handleCredits = () => {
    navigation.navigate("Credits");
  };

  return (
    <SafeAreaView style={styles.safeContainer} edges={["top", "left", "right"]}>
      <View style={styles.container}>
        <Text style={styles.title}>Mon Compte</Text>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Nom :</Text>
          <Text style={styles.value}>Dupont</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Prénom :</Text>
          <Text style={styles.value}>Jean</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Email :</Text>
          <Text style={styles.value}>jean.dupont@example.com</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.buttonEdit}
            onPress={handleEditProfile}
          >
            <Text style={styles.buttonText}>Modifier le profil</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonSecondary}
            onPress={handleCredits}
          >
            <Text style={styles.buttonTextSecondary}>Crédits</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonLogout} onPress={handleLogout}>
            <Text style={styles.buttonText}>Se déconnecter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  infoContainer: {
    flexDirection: "row",
    marginBottom: 8,
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
  buttonLogout: {
    backgroundColor: "#FF6B6B",
    borderRadius: 8,
    padding: 12,
    width: "80%",
    marginTop: 12,
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
  buttonText: {
    color: "#FFF",
    fontWeight: "600",
  },
  buttonTextSecondary: {
    color: "#6C63FF",
    fontWeight: "600",
  },
});
