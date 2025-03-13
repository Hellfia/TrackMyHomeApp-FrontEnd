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
import { useSelector } from "react-redux";
import GradientButton from "../../../components/GradientButton";
import Input from "../../../components/Input";
import ReturnButton from "../../../components/ReturnButton";
import globalStyles from "../../../styles/globalStyles";
import updateProfileConstructorSchema from "../../../schemas/UpdateProfilConstructorSchema";

export default function UpdateProfileConstructeur({ route, navigation }) {
  const { data } = route.params;

  const constructeur = useSelector((state) => state.constructeur.value);

  const [constructorName, setConstructorName] = useState(
    data.constructorName || ""
  );
  const [constructorSiret, setConstructorSiret] = useState(
    data.constructorSiret || ""
  );
  const [email, setEmail] = useState(data.email || "");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(data.phoneNumber || "");
  const [address, setAddress] = useState(data.address || "");
  const [city, setCity] = useState(data.city || "");
  const [zipCode, setZipCode] = useState(data.zipCode || "");
  const [errors, setErrors] = useState({});

  const token = constructeur.token;

  const devUrl = process.env.DEV_URL;

  const validate = () => {
    const { error } = updateProfileConstructorSchema.validate(
      {
        constructorName,
        constructorSiret,
        email,
        password,
        zipCode,
        address,
        city,
        phoneNumber,
      },
      { abortEarly: false }
    );
    if (error) {
      const errorDetails = error.details.reduce((acc, curr) => {
        acc[curr.path[0]] = curr.message;
        return acc;
      }, {});
      setErrors(errorDetails);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleUpdateProfile = () => {
    if (!validate()) {
      return;
    }

    fetch(`${devUrl}/constructors/${token}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        constructorName: constructorName,
        constructorSiret: constructorSiret,
        email: email,
        password: password,
        city: city,
        zipCode: zipCode,
        address: address,
        phoneNumber: phoneNumber,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          navigation.navigate("Profil");
        }
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={globalStyles.header}>
        <ReturnButton onPress={() => navigation.goBack()} />
        <Text style={globalStyles.title}>Modifier votre Profil</Text>
      </View>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView>
          <View style={styles.inputContainer}>
            <Input
              style={styles.inputText}
              placeholder="Nom de l'entreprise"
              value={constructorName}
              onChangeText={(value) => setConstructorName(value)}
              autoCapitalize="words"
              autoCorrect={false}
              keyboardType="default"
            />
            {errors.constructorName && (
              <Text style={styles.errorText}>{errors.constructorName}</Text>
            )}

            <Input
              style={styles.inputText}
              placeholder="Siret de l'entreprise"
              value={constructorSiret}
              onChangeText={(value) => setConstructorSiret(value)}
              autoCorrect={false}
              keyboardType="phone-pad"
            />
            {errors.constructorSiret && (
              <Text style={styles.errorText}>{errors.constructorSiret}</Text>
            )}

            <Input
              style={styles.inputText}
              placeholder="Email"
              value={email}
              onChangeText={(value) => setEmail(value)}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
            />

            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
            <Input
              style={styles.inputText}
              placeholder="Numéro de téléphone"
              value={phoneNumber}
              onChangeText={(value) => setPhoneNumber(value)}
              autoCorrect={false}
              keyboardType="phone-pad"
            />
            {errors.phoneNumber && (
              <Text style={styles.errorText}>{errors.phoneNumber}</Text>
            )}
            <Input
              style={styles.inputText}
              placeholder="Adresse "
              value={address}
              onChangeText={(value) => setAddress(value)}
              autoCapitalize="words"
              autoCorrect={false}
              keyboardType="default"
            />
            {errors.address && (
              <Text style={styles.errorText}>{errors.address}</Text>
            )}
            <Input
              style={styles.inputText}
              placeholder="Code Postal"
              value={zipCode}
              onChangeText={(value) => setZipCode(value)}
              autoCorrect={false}
              keyboardType="phone-pad"
            />
            {errors.zipCode && (
              <Text style={styles.errorText}>{errors.zipCode}</Text>
            )}
            <Input
              style={styles.inputText}
              placeholder="Ville"
              value={city}
              onChangeText={(value) => setCity(value)}
              autoCapitalize="words"
              autoCorrect={false}
              keyboardType="default"
            />
            {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}

            <Input
              style={styles.inputText}
              placeholder="Mot de passe"
              value={password}
              onChangeText={(value) => setPassword(value)}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry={true}
              keyboardType="default"
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
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
  inputContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
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
    fontSize: 12,
    color: "red",
    marginTop: -10,
    marginBottom: 10,
    width: "100%",
    marginLeft: 15,
  },
});
