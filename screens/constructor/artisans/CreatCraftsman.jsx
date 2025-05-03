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
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import GradientButton from "../../../components/GradientButton";
import Input from "../../../components/Input";
import ReturnButton from "../../../components/ReturnButton";
import creatCraftsman from "../../../schemas/CreatCraftsmanSchema";

export default function CreateCraftsman({ navigation }) {
  const [craftsmanName, setCraftsmanName] = useState("");
  const [craftsmanAddress, setCraftsmanAddress] = useState("");
  const [craftsmanZip, setCraftsmanZip] = useState("");
  const [craftsmanCity, setCraftsmanCity] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [logo, setLogo] = useState(null);
  const [errors, setErrors] = useState({});

  const constructeur = useSelector((state) => state.constructeur.value);
  const token = constructeur.token;
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
      const errorDetails = error.details.reduce((acc, curr) => {
        acc[curr.path[0]] = curr.message;
        return acc;
      }, {});
      setErrors(errorDetails);
      return;
    }

    const payload = {
      craftsmanName,
      craftsmanLogo: logo || "",
      craftsmanAddress,
      craftsmanZip,
      craftsmanCity,
      phoneNumber,
      constructeurToken: token,
    };

    fetch(`${prodURL}/craftsmen`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
    <LinearGradient
      colors={["#8E44AD", "#753A9C", "#372173"]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }} edges={["bottom", "left", "right"]}>
        <View style={[styles.header, { marginTop: insets.top + 10 }]}>
          <ReturnButton onPress={() => navigation.goBack()} />
          <View style={styles.titleWrapper}>
            <Text style={styles.headerTitle}>Créer un nouvel</Text>
            <Text style={styles.headerTitle}>artisan</Text>
          </View>
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.form}>
              <Input
                placeholder="Nom de l'entreprise"
                value={craftsmanName}
                onChangeText={setCraftsmanName}
                autoCapitalize="sentences"
              />
              {errors.craftsmanName && (
                <Text style={styles.errorText}>{errors.craftsmanName}</Text>
              )}

              <Input
                placeholder="Adresse de l'artisan"
                value={craftsmanAddress}
                onChangeText={setCraftsmanAddress}
                autoCapitalize="sentences"
              />
              {errors.craftsmanAddress && (
                <Text style={styles.errorText}>{errors.craftsmanAddress}</Text>
              )}

              <Input
                placeholder="Code postal"
                value={craftsmanZip}
                onChangeText={setCraftsmanZip}
                keyboardType="phone-pad"
              />
              {errors.craftsmanZip && (
                <Text style={styles.errorText}>{errors.craftsmanZip}</Text>
              )}

              <Input
                placeholder="Ville"
                value={craftsmanCity}
                onChangeText={setCraftsmanCity}
                autoCapitalize="sentences"
              />
              {errors.craftsmanCity && (
                <Text style={styles.errorText}>{errors.craftsmanCity}</Text>
              )}

              <Input
                placeholder="Téléphone"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
              {errors.phoneNumber && (
                <Text style={styles.errorText}>{errors.phoneNumber}</Text>
              )}

              {/* TODO: ajouter un Input pour le logo si nécessaire */}
            </View>
          </ScrollView>

          <Animated.View
            style={[
              styles.buttonWrapper,
              { transform: [{ translateY: buttonTranslateY }] },
            ]}
          >
            <GradientButton text="Valider" onPress={handleValidate} />
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
