import React, { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import GradientButton from "../../../components/GradientButton";
import Input from "../../../components/Input";
import ReturnButton from "../../../components/ReturnButton";
import creatCraftsman from "../../../schemas/CreatCraftsmanSchema";
import globalStyles from "../../../styles/globalStyles";

export default function CreatCraftsman({ navigation }) {
  const [craftsmanName, setCraftsmanName] = useState("");
  const [craftsmanAddress, setCraftsmanAddress] = useState("");
  const [craftsmanZip, setCraftsmanZip] = useState("");
  const [craftsmanCity, setCraftsmanCity] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [logo, setLogo] = useState(null);
  const [errors, setErrors] = useState({}); // State to hold validation errors

  const token = useSelector((state) => state.constructeur.value.token);

  const scrollViewRef = useRef(null);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }
    );

    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleValidate = () => {
    const { error } = creatCraftsman.validate({
      craftsmanName,
      craftsmanAddress,
      craftsmanZip,
      craftsmanCity,
      phoneNumber,
      logo,
    });

    if (error) {
      // Si une erreur de validation est trouvée, on met à jour l'état des erreurs
      const errorDetails = error.details.reduce((acc, curr) => {
        acc[curr.path[0]] = curr.message;
        return acc;
      }, {});

      setErrors(errorDetails);
      return;
    }

    // Si la validation est correcte, on envoie les données
    const payload = {
      craftsmanName,
      craftsmanLogo: logo ? logo : "",
      craftsmanAddress,
      craftsmanZip,
      craftsmanCity,
      phoneNumber,
      constructeurToken: token,
    };

    const devUrl = process.env.DEV_URL;

    fetch(`https://track-my-home-backend.vercel.app/craftsmen`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result === true) {
          setCraftsmanName("");
          setCraftsmanAddress("");
          setCraftsmanZip("");
          setCraftsmanCity("");
          setPhoneNumber("");
          setLogo(null);
          setErrors({});
          navigation.navigate("Artisans");
        }
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={globalStyles.header}>
        <ReturnButton onPress={() => navigation.goBack()} />
        <Text style={globalStyles.title}>Créer un nouvel artisan</Text>
      </View>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView style={styles.inputContainer} ref={scrollViewRef}>
          <Input
            placeholder="Nom de l'entreprise"
            value={craftsmanName}
            onChangeText={(value) => setCraftsmanName(value)}
            autoCapitalize="sentences"
            keyboardType="default"
          />
          {errors.craftsmanName && (
            <Text style={styles.errorText}>{errors.craftsmanName}</Text>
          )}

          <Input
            placeholder="Adresse de l'artisan"
            value={craftsmanAddress}
            onChangeText={(value) => setCraftsmanAddress(value)}
            autoCapitalize="sentences"
            keyboardType="default"
          />
          {errors.craftsmanAddress && (
            <Text style={styles.errorText}>{errors.craftsmanAddress}</Text>
          )}

          <Input
            placeholder="Code postal de l'entreprise"
            value={craftsmanZip}
            onChangeText={(value) => setCraftsmanZip(value)}
            keyboardType="phone-pad"
          />
          {errors.craftsmanZip && (
            <Text style={styles.errorText}>{errors.craftsmanZip}</Text>
          )}

          <Input
            placeholder="Ville de l'artisan"
            value={craftsmanCity}
            onChangeText={(value) => setCraftsmanCity(value)}
            autoCapitalize="sentences"
            keyboardType="default"
          />
          {errors.craftsmanCity && (
            <Text style={styles.errorText}>{errors.craftsmanCity}</Text>
          )}

          <Input
            placeholder="Téléphone de l'entreprise"
            value={phoneNumber}
            onChangeText={(value) => setPhoneNumber(value)}
            keyboardType="phone-pad"
          />
          {errors.phoneNumber && (
            <Text style={styles.errorText}>{errors.phoneNumber}</Text>
          )}
        </ScrollView>
        <GradientButton text="Valider" onPress={handleValidate} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  inputContainer: {
    marginTop: 40,
  },
  labelLogo: {
    fontSize: 16,
    fontWeight: "500",
    color: "#663ED9",
    marginTop: 10,
    marginBottom: 10,
  },
  inputFilesContainer: {
    height: 140,
    marginBottom: 30,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
    width: "100%",
    marginLeft: 10,
  },
});
