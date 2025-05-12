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
import { LinearGradient } from "expo-linear-gradient";
import { useSelector } from "react-redux";
import GradientButton from "../../../components/GradientButton";
import PurpleButton from "../../../components/PurpleButton";
import Input from "../../../components/Input";
import ReturnButton from "../../../components/ReturnButton";
import updateCraftsman from "../../../schemas/UpdateCraftsmanSchema";
import globalStyles from "../../../styles/globalStyles";

export default function UpdateCraftsman({ route, navigation }) {
  const { craftsman } = route.params;

  const [craftsmanName, setCraftsmanName] = useState(
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
  const [errors, setErrors] = useState({});

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

  const handleUpdateProfile = () => {
    const { error } = updateCraftsman.validate({
      craftsmanName,
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
      console.log("Validation errors:", errorDetails); // Log validation errors
      return;
    }
    const slug = encodeURIComponent(route.params.craftsman.craftsmanName);

    fetch(`${prodURL}/craftsmen/${slug}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        craftsmanName,
        craftsmanAddress,
        craftsmanZip,
        craftsmanCity,
        phoneNumber,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Server response:", data); // Log server response
        if (data.result) {
          navigation.goBack();
        } else {
          console.error("Update failed:", data);
          alert("La mise à jour a échoué. Veuillez réessayer.");
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        alert("Une erreur s'est produite. Veuillez réessayer plus tard.");
      });
  };

  const handlePressDelete = async () => {
    try {
      const response = await fetch(`${prodURL}/craftsmen/${craftsmanName}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();
      if (response.ok && result.result) navigation.goBack();
      else console.log(result.error);
    } catch (error) {
      console.error(error);
      alert("Une erreur s'est produite. Veuillez réessayer plus tard.");
    }
  };

  return (
    <LinearGradient
      colors={["#8E44AD", "#753A9C", "#372173"]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }} edges={["bottom", "left", "right"]}>
        <View style={[globalStyles.header, { marginTop: insets.top + 10 }]}>
          <ReturnButton onPress={() => navigation.goBack()} />
          <Text style={styles.title}>Modifier votre artisan</Text>
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
                placeholder="Nom de l'artisan"
                value={craftsmanName}
                onChangeText={setCraftsmanName}
                autoCapitalize="sentences"
                autoCorrect={false}
              />
              {errors.craftsmanName && (
                <Text style={styles.errorText}>{errors.craftsmanName}</Text>
              )}

              <Input
                placeholder="Adresse de l'artisan"
                value={craftsmanAddress}
                onChangeText={setCraftsmanAddress}
                autoCapitalize="sentences"
                autoCorrect={false}
              />
              {errors.craftsmanAddress && (
                <Text style={styles.errorText}>{errors.craftsmanAddress}</Text>
              )}

              <Input
                placeholder="Code postal"
                value={craftsmanZip}
                onChangeText={setCraftsmanZip}
                keyboardType="phone-pad"
                autoCorrect={false}
              />
              {errors.craftsmanZip && (
                <Text style={styles.errorText}>{errors.craftsmanZip}</Text>
              )}

              <Input
                placeholder="Ville"
                value={craftsmanCity}
                onChangeText={setCraftsmanCity}
                autoCapitalize="sentences"
                autoCorrect={false}
              />
              {errors.craftsmanCity && (
                <Text style={styles.errorText}>{errors.craftsmanCity}</Text>
              )}

              <Input
                placeholder="Téléphone"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                autoCorrect={false}
              />
              {errors.phoneNumber && (
                <Text style={styles.errorText}>{errors.phoneNumber}</Text>
              )}
            </View>
          </ScrollView>

          <Animated.View
            style={[
              styles.buttonWrapper,
              { transform: [{ translateY: buttonTranslateY }] },
            ]}
          >
            <GradientButton
              text="Mettre à jour"
              onPress={handleUpdateProfile}
            />
            <PurpleButton
              icon="trash-alt"
              text="Supprimer l'artisan"
              backgroundColor="#FE5900"
              onPress={handlePressDelete}
            />
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 50,
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  form: {
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 70,
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
