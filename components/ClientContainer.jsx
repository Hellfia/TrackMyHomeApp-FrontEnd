import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import avatar from "../assets/avatar.png";

const ClientContainer = ({
  firstname,
  lastname,
  address,
  zip,
  city,
  profilePicture,
  onPress,
}) => {
  const profileImage = profilePicture ? { uri: profilePicture } : avatar;
  return (
    <TouchableOpacity style={styles.generalContainer} onPress={onPress}>
      <Image
        source={profileImage}
        style={styles.avatar}
        accessibilityLabel="Photo de profil de l'utilisateur"
      />
      <View style={styles.infosContainer}>
        <View style={styles.modifContainer}>
          <Text style={styles.nameClient}>
            {firstname} {lastname}
          </Text>
        </View>
        <Text style={styles.addressClient}>{address}</Text>
        <Text>
          {zip} {city}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  generalContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#663ED9",
    borderRadius: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    padding: 12,
    marginHorizontal: 20,
    marginVertical: 5,
  },
  infosContainer: {
    marginLeft: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  nameClient: {
    fontWeight: "500",
    color: "#663ED9",
  },
});

export default ClientContainer;
