import React, { useState, useEffect, useRef } from "react";
import {
  Animated,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from "react-native";
import { useDispatch } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import logo from "../assets/logo.png";
import GradientButton from "../components/GradientButton";
import Input from "../components/Input";
import emailIcon from "../assets/email.png";
import lockIcon from "../assets/verrou.png";
import { loginClient } from "../reducers/client";
import { loginConstructeur } from "../reducers/constructeur";

export default function ConnexionScreen({ navigation }) {
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const dispatch = useDispatch();
  const prodURL = process.env.PROD_URL;

  const logoScale = useRef(new Animated.Value(1)).current;
  const logoTranslateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => {
      Animated.parallel([
        Animated.timing(logoScale, {
          toValue: 0.6,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(logoTranslateY, {
          toValue: -30,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      Animated.parallel([
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(logoTranslateY, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handlePressConnexion = () => {
    fetch(`${prodURL}/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: signInEmail, password: signInPassword }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.result) {
          const payload = {
            token: data.token,
            profilPicture: data.profilPicture,
          };
          if (data.role === "client") {
            dispatch(loginClient({ ...payload, ...data }));
          } else {
            dispatch(loginConstructeur({ ...payload, ...data }));
          }
          setSignInEmail("");
          setSignInPassword("");
          navigation.navigate("MainTabs");
        } else {
          alert("Identifiants incorrects, veuillez réessayer.");
        }
      })
      .catch(err => console.error("Erreur:", err));
  };

  return (
<LinearGradient colors={["#8E44AD", "#753A9C", "#372173"]} style={{ flex: 1 }}>
  <SafeAreaView style={{ flex: 1 }} edges={["bottom", "left", "right"]}>
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topSection}>
          <Animated.Image
            source={logo}
            style={[
              styles.logo,
              {
                transform: [
                  { scale: logoScale },
                  { translateY: logoTranslateY },
                ],
              },
            ]}
          />
          <Text style={styles.title}>
            <Text style={styles.trackMy}>TrackMy</Text>
            <Text style={styles.home}>Home</Text>
          </Text>
          <Text style={styles.subtitle}>
            Suivez l'avancement de votre projet !
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            placeholder="Email"
            placeholderTextColor="#fff"
            icon={emailIcon}
            onChangeText={setSignInEmail}
            value={signInEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            placeholder="Mot de passe"
            placeholderTextColor="#fff"
            icon={lockIcon}
            onChangeText={setSignInPassword}
            value={signInPassword}
            secureTextEntry
          />
          <GradientButton text="Se connecter" onPress={handlePressConnexion} />
          <Text style={styles.text}>
            Pas encore de compte pro ?{" "}
            <Text style={styles.link} onPress={() => navigation.navigate("ProAccCreation")}>
              Créer un compte !
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>
</LinearGradient>

  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingBottom: 40,
    paddingTop: 10,
  },
  logoContainer: {
    marginBottom: 10,
  },
  logo: {
    width: 200,
    height: 200,
    shadowColor: "#fff",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 7,
    marginBottom: 10,
    resizeMode: "contain",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  trackMy: {
    color: "#FFFFFF",
  },
  home: {
    color: "#F99A5E",
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  text: {
    marginTop: 30,
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
  },
  link: {
    color: "#F99A5E",
    textDecorationLine: "underline",
  },
  topSection: {
    alignItems: "center",
    marginBottom: 20,
  },
});
