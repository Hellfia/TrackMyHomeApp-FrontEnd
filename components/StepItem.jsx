import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const StepItem = ({ name, iconName, iconColor, onPress, iconOnPress }) => {
  return (
    <View style={styles.generalContainer}>
      <View style={styles.stepContainer}>
        <FontAwesome5
          name={iconName}
          size={22}
          color={iconColor}
          style={styles.icon}
        />
        <Text style={styles.stepText}>{name}</Text>
      </View>
      <TouchableOpacity onPress={onPress}>
        <FontAwesome5 name={iconOnPress} size={20} color="#663ED9" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  generalContainer: {
    width: "100%",
    marginVertical: 5,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "red",
    padding: 16,
    borderWidth: 1,
    borderColor: "#663ED9",
    borderRadius: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  stepContainer: {
    display: "flex",
    flexDirection: "row",
  },
  stepText: {
    fontSize: 15,
    fontWeight: "500",
  },
  icon: {
    marginRight: 14,
  },
});

export default StepItem;
