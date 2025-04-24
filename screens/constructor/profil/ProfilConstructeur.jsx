// ProfilConstructeur.js
import React, { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";

import avatar from "../../../assets/avatar.png";
import GradientButton from "../../../components/GradientButton";
import PurpleButton from "../../../components/PurpleButton";
import { logout } from "../../../reducers/constructeur";
import { scale, rfs } from "../../../utils/scale";

export default function ProfilConstructeur({ navigation }) {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const prodURL = process.env.PROD_URL;
  const constructeur = useSelector((s) => s.constructeur.value);

  const [info, setInfo] = useState({});

  useFocusEffect(
    useCallback(() => {
      fetch(`${prodURL}/constructors/${constructeur.token}`)
        .then((res) => res.json())
        .then((d) => setInfo(d.data || {}))
        .catch(console.error);
    }, [constructeur.token])
  );

  const profileImage = info.profilePicture
    ? { uri: info.profilePicture }
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
          {/* Avatar overlapping header */}
          <View style={styles.iconContainer}>
            <Image
              source={profileImage}
              style={styles.image}
              accessibilityLabel="Ma photo de profil"
            />
          </View>

          {/* Infos */}
          <View style={styles.infosContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>{info.constructorName ?? ""}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>{info.email ?? ""}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>{info.phoneNumber ?? ""}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>{info.address ?? ""}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>{info.zipCode ?? ""}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>{info.city ?? ""}</Text>
            </View>
          </View>

          {/* Actions */}
          <GradientButton
            text="Modifier mon profil"
            onPress={() =>
              navigation.navigate("UpdateProfileConstructeur", { data: info })
            }
          />
          <PurpleButton
            text="Se déconnecter"
            icon="door-open"
            backgroundColor="#FE5900"
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
    // autorise le débordement pour que l'avatar chevauche
    overflow: "visible",
  },
  sectionWrapper: {
    paddingHorizontal: scale(24),
  },
  iconContainer: {
    alignItems: "center",
    // remonte l'avatar de moitié de sa hauteur pour chevaucher le header
    marginTop: -scale(70),
    marginBottom: scale(20),
    zIndex: 2,
  },
  image: {
    width: scale(140),
    height: scale(140),
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
