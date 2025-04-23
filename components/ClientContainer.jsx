import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import avatar from "../assets/avatar.png";

const ClientContainer = ({
  firstname,
  lastname,
  address,
  zip,
  city,
  profilePicture,
  onPress,
  variant = "orange",
  style,
}) => {
  const profileImage = profilePicture ? { uri: profilePicture } : avatar;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.card,
        variant === "violet" ? styles.violetShadow : styles.orangeShadow,
      ]}
    >
      <Image
        source={profileImage}
        style={styles.avatar}
        accessibilityLabel="Photo de profil de l'utilisateur"
      />
      <Text style={styles.name}>
        {firstname} {lastname}
      </Text>
      <Text style={styles.address} numberOfLines={1}>{address}</Text>
      <Text style={styles.city}>{zip} {city}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    elevation: 4,
    width: 170,
    height: 160,
  },
  orangeShadow: {
    shadowColor: "#FF5900",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  violetShadow: {
    shadowColor: "#673ED9",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  name: {
    fontWeight: "700",
    fontSize: 14,
    color: "#673ED9",
    textAlign: "center",
    marginBottom: 4,
  },
  address: {
    fontSize: 12,
    color: "#444",
    textAlign: "center",
  },
  city: {
    fontSize: 12,
    color: "#444",
    textAlign: "center",
  },
});

export default ClientContainer;
