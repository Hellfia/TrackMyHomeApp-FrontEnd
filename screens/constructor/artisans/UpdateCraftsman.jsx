import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GradientButton from "../../../components/GradientButton";
import Input from "../../../components/Input";
import ReturnButton from "../../../components/ReturnButton";
import globalStyles from "../../../styles/globalStyles";

export default function UpdateCraftsman({ route, navigation }) {
  const { craftsman } = route.params;

  const [craftsmanCompagny, setCraftsmanCompagny] = useState(
    craftsman.craftsmanName || ""
  );
  const [craftsmanAddress, setCraftsmanAddress] = useState(
    craftsman.craftsmanAddress || ""
  );
  const [craftsmanZip, setCraftsmanZip] = useState(
    craftsman.craftsmanZip || ""
  );
  const [craftsmanCity, setCraftsmanCity] = useState(
    craftsman.craftsmanCity || ""
  );
  const [phoneNumber, setPhoneNumber] = useState(craftsman.phoneNumber || "");

  const devUrl = process.env.DEV_URL;

  const handleUpdateProfile = () => {
    fetch(`${devUrl}/craftsmen/${craftsman.craftsmanName}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        craftsmanName: craftsmanCompagny,
        craftsmanAddress: craftsmanAddress,
        craftsmanZip: craftsmanZip,
        craftsmanCity: craftsmanCity,
        phoneNumber: phoneNumber,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          navigation.goBack();
        }
      });
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={globalStyles.header}>
        <ReturnButton onPress={() => navigation.goBack()} />
        <Text style={globalStyles.title}>Modifier votre artisan</Text>
      </View>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.inputContainer}>
          <Input
            style={styles.inputText}
            placeholder="Nom de l'artisan"
            value={craftsmanCompagny}
            onChangeText={(value) => setCraftsmanCompagny(value)}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Input
            style={styles.inputText}
            placeholder="Adresse de l'artisan"
            value={craftsmanAddress}
            onChangeText={(value) => setCraftsmanAddress(value)}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Input
            style={styles.inputText}
            placeholder="Code postal de l'artisan"
            value={craftsmanZip}
            onChangeText={(value) => setCraftsmanZip(value)}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Input
            style={styles.inputText}
            placeholder="Ville de l'artisan"
            value={craftsmanCity}
            onChangeText={(value) => setCraftsmanCity(value)}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Input
            style={styles.inputText}
            placeholder="Téléphone de l'artisan"
            value={phoneNumber}
            onChangeText={(value) => setPhoneNumber(value)}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <GradientButton
          onPress={handleUpdateProfile}
          text="Mettre à jour"
        ></GradientButton>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  inputContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  inputText: {
    width: "100%",
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ddd",
    fontSize: 16,
  },
});
