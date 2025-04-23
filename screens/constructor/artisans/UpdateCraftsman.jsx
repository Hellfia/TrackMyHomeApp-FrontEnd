import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GradientButton from "../../../components/GradientButton";
import Input from "../../../components/Input";
import InputLogo from "../../../components/InputLogo";
import ReturnButton from "../../../components/ReturnButton";
import updateCraftsman from "../../../schemas/UpdateCraftsmanSchema";
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
  const [errors, setErrors] = useState({}); // Pour stocker les erreurs de validation

  const prodURL = process.env.PROD_URL



  const handleUpdateProfile = () => {
    const { error } = updateCraftsman.validate({
      craftsmanCompagny,
      craftsmanAddress,
      craftsmanZip,
      craftsmanCity,
      phoneNumber,
    });

    if (error) {
      
      const errorDetails = error.details.reduce((acc, curr) => {
        acc[curr.path[0]] = curr.message;
        return acc;
      }, {});
      setErrors(errorDetails);
      return;
    }

    fetch(`${prodURL}/craftsmen/${craftsman.craftsmanName}`, {
      method: "PATCH",
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

  const handlePressDelete = () => {
    
  }

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
        <ScrollView>
          <View style={styles.inputLogoContainer}>
            <InputLogo craftsman={craftsman} />
          </View>
          <View style={styles.inputContainer}>
            <Input
              style={styles.inputText}
              placeholder="Nom de l'artisan"
              value={craftsmanCompagny}
              onChangeText={(value) => setCraftsmanCompagny(value)}
              autoCapitalize="sentences"
              autoCorrect={false}
              keyboardType="default"
            />
            {errors.craftsmanCompagny && (
              <Text style={styles.errorText}>{errors.craftsmanCompagny}</Text>
            )}

            <Input
              style={styles.inputText}
              placeholder="Adresse de l'artisan"
              value={craftsmanAddress}
              onChangeText={(value) => setCraftsmanAddress(value)}
              autoCapitalize="sentences"
              autoCorrect={false}
              keyboardType="default"
            />
            {errors.craftsmanAddress && (
              <Text style={styles.errorText}>{errors.craftsmanAddress}</Text>
            )}

            <Input
              style={styles.inputText}
              placeholder="Code postal de l'artisan"
              value={craftsmanZip}
              onChangeText={(value) => setCraftsmanZip(value)}
              autoCorrect={false}
              keyboardType="phone-pad"
            />
            {errors.craftsmanZip && (
              <Text style={styles.errorText}>{errors.craftsmanZip}</Text>
            )}

            <Input
              style={styles.inputText}
              placeholder="Ville de l'artisan"
              value={craftsmanCity}
              onChangeText={(value) => setCraftsmanCity(value)}
              autoCapitalize="sentences"
              autoCorrect={false}
              keyboardType="default"
            />
            {errors.craftsmanCity && (
              <Text style={styles.errorText}>{errors.craftsmanCity}</Text>
            )}

            <Input
              style={styles.inputText}
              placeholder="Téléphone de l'artisan"
              value={phoneNumber}
              onChangeText={(value) => setPhoneNumber(value)}
              keyboardType="phone-pad"
              autoCorrect={false}
            />
            {errors.phoneNumber && (
              <Text style={styles.errorText}>{errors.phoneNumber}</Text>
            )}
          </View>
        </ScrollView>

        <GradientButton onPress={handleUpdateProfile} text="Mettre à jour" />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  inputLogoContainer: {
    marginVertical: 20,
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
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 15,
    width: "100%",
  },
});
