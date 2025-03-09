import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import avatar from "../assets/avatar.png";

const CraftsmanContainer = ({
  craftsmanName,
  craftsmanAddress,
  craftsmanZip,
  craftsmanCity,
  craftsmanLogo,
  phoneNumber,
}) => {
  const profileImage = craftsmanLogo ? { uri: craftsmanLogo } : avatar;

  return (
    <View style={styles.generalContainer}>
      <Image source={profileImage} style={styles.avatar} />
      <View style={styles.infosContainer}>
        <Text style={styles.nameCraftsman}>{craftsmanName}</Text>
        <Text>{craftsmanAddress}</Text>
        <Text>
          {craftsmanZip} {craftsmanCity}
        </Text>
        <Text> {phoneNumber}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  generalContainer: {
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
    marginVertical: 5,
    width: "100%",
  },
  infosContainer: {
    marginLeft: 15,
    flex: 1,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  nameCraftsman: {
    fontWeight: "500",
    color: "#663ED9",
  },
});

export default CraftsmanContainer;
