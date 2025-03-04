import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import avatar from "../assets/avatar.png";

const ClientContainer = ({}) => {
  return (
    <View style={styles.generalContainer}>
      <Image source={avatar} style={styles.avatar} />
      <View style={styles.infosContainer}>
        <Text style={styles.nameClient}>Nom Prenom</Text>
        <Text style={styles.adressClient}>Adresse</Text>
        <Text style={styles.zipCleint}>75000</Text>
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
  nameClient: {
    fontWeight: "500",
  },
});

export default ClientContainer;
