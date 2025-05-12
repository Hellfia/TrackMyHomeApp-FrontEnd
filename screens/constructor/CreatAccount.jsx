import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import GradientButton from "../../components/GradientButton";
import Input from "../../components/Input";
import { loginConstructeur } from "../../reducers/constructeur";
import creatAccount from "../../schemas/CreatAccountSchema";

export default function CreatAccount({ navigation }) {
  const [constructorName, setConstructorName] = useState("");
  const [constructorSiret, setConstructorSiret] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  const prodURL = process.env.PROD_URL;

  // Function to validate form data
  const validate = () => {
    const { error } = creatAccount.validate(
      {
        constructorName,
        constructorSiret,
        email,
        password,
        city,
        zipCode,
        address,
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

  const handleSignup = () => {
    if (!validate()) {
      return;
    }

    fetch(`${prodURL}/constructors/signup`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        constructorName: constructorName,
        constructorSiret: constructorSiret,
        email: email,
        password: password,
        city: city,
        address: address,
        zipCode: zipCode,
        phoneNumber: phoneNumber,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          dispatch(
            loginConstructeur({
              constructorId: data.constructorId,
              token: data.token,
              role: "constructeur",
            })
          );
          setConstructorName("");
          setEmail("");
          setPassword("");
          setConstructorSiret("");
          setCity("");
          setPhoneNumber("");
          setZipCode("");
          setAddress("");
          navigation.navigate("MainTabs");
        }
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../../assets/logo.png")}
        style={styles.logo}
        accessibilityLabel="Logo de TrackMyHome"
      />

      <Text style={styles.title}>TrackMyHome</Text>
      <Text style={styles.subtitle}>Créer un compte professionnel</Text>

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView style={styles.form}>
          <Input
            style={styles.input}
            placeholder="Nom de l'entreprise"
            value={constructorName}
            onChangeText={setConstructorName}
            autoCapitalize="sentences"
            autoCorrect={false}
            keyboardType="default"
          />
          {errors.constructorName && (
            <Text style={styles.errorText}>{errors.constructorName}</Text>
          )}

          <Input
            style={styles.input}
            placeholder="Siret de l'entreprise"
            value={constructorSiret}
            onChangeText={setConstructorSiret}
            keyboardType="phone-pad"
          />
          {errors.constructorSiret && (
            <Text style={styles.errorText}>{errors.constructorSiret}</Text>
          )}

          <Input
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          <Input
            style={styles.input}
            placeholder="Numéro de téléphone"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
          {errors.phoneNumber && (
            <Text style={styles.errorText}>{errors.phoneNumber}</Text>
          )}
          <Input
            style={styles.input}
            placeholder="Adresse"
            value={address}
            onChangeText={setAddress}
            autoCapitalize="sentences"
            autoCorrect={false}
            keyboardType="default"
          />
          {errors.address && (
            <Text style={styles.errorText}>{errors.address}</Text>
          )}
          <Input
            style={styles.input}
            placeholder="Code Postal"
            keyboardType="phone-pad"
            value={zipCode}
            onChangeText={setZipCode}
          />
          {errors.zipCode && (
            <Text style={styles.errorText}>{errors.zipCode}</Text>
          )}
          <Input
            style={styles.input}
            placeholder="Ville"
            value={city}
            onChangeText={setCity}
            autoCapitalize="sentences"
            autoCorrect={false}
            keyboardType="default"
          />
          {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}

          <Input
            style={styles.input}
            placeholder="Mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            keyboardType="default"
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
      <GradientButton
        text="Créer votre compte"
        style={styles.button}
        onPress={handleSignup}
      />

      <View style={styles.bottomTextContainer}>
        <Text style={styles.bottomText}>Vous avez déjà un compte? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Connexion")}>
          <Text style={styles.linkText}>Cliquez-ici</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    resizeMode: "contain",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#000000",
  },
  subtitle: {
    fontSize: 16,
    color: "#555555",
  },
  keyboardContainer: {
    width: "100%",
    height: "60%",
  },
  form: {
    width: "100%",
    marginTop: 25,
    marginBottom: 10,
  },
  bottomTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 40,
  },
  bottomText: {
    fontSize: 14,
    color: "#000000",
  },
  linkText: {
    fontSize: 14,
    color: "#8A2BE2",
    textDecorationLine: "underline",
  },
  errorText: {
    fontSize: 12,
    color: "red",
    marginTop: -14,
    paddingBottom: 12,
  },
});
