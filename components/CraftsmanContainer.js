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
          {craftsmanZip} {craftsmanCity} {phoneNumber}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  generalContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#663ED9",
    borderRadius: 8,
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
  nameCraftsman: {
    fontWeight: "500",
  },
});

export default CraftsmanContainer;
