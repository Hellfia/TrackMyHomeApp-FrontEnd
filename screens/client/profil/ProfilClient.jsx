import React, { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, Image, ScrollView, StyleSheet, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import avatar from "../../../assets/avatar.png";
import GradientButton from "../../../components/GradientButton";
import PurpleButton from "../../../components/PurpleButton";
import { logout } from "../../../reducers/client";
import { scale, rfs } from "../../../utils/scale";

export default function ProfilClient({ navigation }) {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const prodURL = process.env.PROD_URL;
  const client = useSelector((s) => s.client.value);

  const [infoClient, setInfoClient] = useState({});

  useFocusEffect(
    useCallback(() => {
      fetch(`${prodURL}/clients/${client.token}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.client) {
            setInfoClient(data.client);
          } else {
            Alert.alert("Erreur", "Données du client introuvables");
          }
        })
        .catch((error) => {
          console.error("Erreur récupération profil :", error);
          Alert.alert("Erreur réseau", error.message);
        });
    }, [client.token])
  );

  const profileImage =
    infoClient.profilePicture?.length > 0
      ? { uri: infoClient.profilePicture }
      : avatar;

  return (
    <LinearGradient
      colors={["#8E44AD", "#372173"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      locations={[0, 0.1]}
      style={[styles.pageContainer, { paddingTop: insets.top }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mon Profil</Text>
      </View>

      {/* Content */}
      <View style={styles.contentWrapper}>
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.sectionWrapper}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.iconContainer}>
            <Image
              source={profileImage}
              style={styles.image}
              accessibilityLabel="Photo de profil"
            />
          </View>

          <View style={styles.infosContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>{infoClient.firstname ?? ""}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>{infoClient.lastname ?? ""}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>{infoClient.email ?? ""}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>*******</Text>
            </View>
          </View>

          <GradientButton
            text="Modifier mon profil"
            onPress={() =>
              navigation.navigate("UpdateProfileClient", { data: infoClient })
            }
          />
          <PurpleButton
            text="Se déconnecter"
            icon="door-open"
            backgroundColor="#372173"
            onPress={() => dispatch(logout())}
            style={{ marginTop: scale(12) }}
          />
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    paddingVertical: scale(50),
  },
  headerTitle: {
    position: "absolute",
    top: scale(10),
    alignSelf: "center",
    fontSize: rfs(24),
    color: "#fff",
    fontWeight: "bold",
    zIndex: 3,
  },
  contentWrapper: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: scale(28),
    borderTopRightRadius: scale(28),
    paddingTop: scale(20),
    paddingBottom: scale(30),
    overflow: "visible",
  },
  sectionWrapper: {
    paddingHorizontal: scale(24),
  },
  iconContainer: {
    alignItems: "center",
    marginTop: -scale(70),
    marginBottom: scale(20),
    zIndex: 2,
  },
  image: {
    width: scale(120),
    height: scale(120),
    borderRadius: scale(70),
    borderWidth: 2,
    borderColor: "#663ED9",
  },
  infosContainer: {
    marginBottom: scale(10),
  },
  infoRow: {
    width: "100%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#663ED9",
    borderRadius: scale(8),
    padding: scale(12),
    marginBottom: scale(12),
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: scale(4),
    elevation: scale(2),
  },
  infoText: {
    fontSize: rfs(14),
    color: "#333",
  },
});
