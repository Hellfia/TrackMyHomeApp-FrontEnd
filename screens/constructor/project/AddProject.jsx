import React, { useState, useRef, useEffect } from "react";
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import GradientButton from "../../../components/GradientButton";
import Input from "../../../components/Input";
import ReturnButton from "../../../components/ReturnButton";
import addProject from "../../../schemas/AddProjectSchema";

export default function AddProjects({ navigation }) {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [constructionAdress, setConstructionAdress] = useState("");
  const [constructionZipCode, setConstructionZipCode] = useState("");
  const [constructionCity, setConstructionCity] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState({});

  const constructeur = useSelector((state) => state.constructeur.value);
  const constructorId = constructeur.constructorId;
  const prodURL = process.env.PROD_URL;
  const insets = useSafeAreaInsets();

  const buttonTranslateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => {
      Animated.timing(buttonTranslateY, {
        toValue: -40,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      Animated.timing(buttonTranslateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handlePress = () => {
    const { error } = addProject.validate({
      firstname,
      lastname,
      phoneNumber,
      constructionAdress,
      constructionZipCode,
      constructionCity,
      email,
      password,
    });

    if (error) {
      const errorDetails = error.details.reduce((acc, curr) => {
        acc[curr.path[0]] = curr.message;
        return acc;
      }, {});
      setErrors(errorDetails);
      return;
    }

    fetch(`${prodURL}/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstname,
        lastname,
        phoneNumber,
        constructionAdress,
        constructionZipCode,
        constructionCity,
        email,
        password,
        constructeurId: constructorId,
        token: constructeur.token,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setFirstname("");
        setLastname("");
        setConstructionAdress("");
        setConstructionZipCode("");
        setConstructionCity("");
        setEmail("");
        setPassword("");
        setPhoneNumber("");
        navigation.navigate("MainTabs");
      });
  };

  return (
    <LinearGradient colors={["#8E44AD", "#753A9C", "#372173"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={["bottom", "left", "right"]}>
        <View style={[styles.header, { marginTop: insets.top + 10 }]}>
          <ReturnButton onPress={() => navigation.goBack()} />
          <View style={styles.titleWrapper}>
            <Text style={styles.headerTitle}>Créer un nouveau</Text>
            <Text style={styles.headerTitle}>chantier</Text>
          </View>
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.form}>
              <Input placeholder="Nom du client" value={firstname} onChangeText={setFirstname} />
              {errors.firstname && <Text style={styles.errorText}>{errors.firstname}</Text>}

              <Input placeholder="Prénom du client" value={lastname} onChangeText={setLastname} />
              {errors.lastname && <Text style={styles.errorText}>{errors.lastname}</Text>}

              <Input placeholder="Numéro de téléphone" value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" />
              {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}

              <Input placeholder="Adresse du chantier" value={constructionAdress} onChangeText={setConstructionAdress} />
              {errors.constructionAdress && <Text style={styles.errorText}>{errors.constructionAdress}</Text>}

              <Input placeholder="Code postal" value={constructionZipCode} onChangeText={setConstructionZipCode} keyboardType="numeric" />
              {errors.constructionZipCode && <Text style={styles.errorText}>{errors.constructionZipCode}</Text>}

              <Input placeholder="Ville" value={constructionCity} onChangeText={setConstructionCity} />
              {errors.constructionCity && <Text style={styles.errorText}>{errors.constructionCity}</Text>}

              <Input placeholder="Adresse email du client" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

              <Input placeholder="Mot de passe provisoire" value={password} onChangeText={setPassword} secureTextEntry />
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>
          </ScrollView>

          <Animated.View style={[styles.buttonWrapper, { transform: [{ translateY: buttonTranslateY }] }]}>
            <GradientButton text="Valider" onPress={handlePress} />
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    position: "relative",
    alignItems: "center",
    marginBottom: 20,
  },
  titleWrapper: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 80,
    flexGrow: 1,
  },
  form: {
    width: "100%",
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 10,
  },
  buttonWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});
