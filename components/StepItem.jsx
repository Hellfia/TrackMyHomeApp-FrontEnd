import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const StepItem = ({ name, iconName, iconColor, onPress }) => {
  return (
    <View style={styles.generalContainer}>
      <View style={styles.stepContainer}>
        <FontAwesome5
          name={iconName}
          size={20}
          color={iconColor}
          style={styles.icon}
        />
        <Text style={styles.stepText}>{name}</Text>
      </View>
      <TouchableOpacity onPress={onPress}>
        <FontAwesome5 name="pencil-alt" size={20} color="#663ED9" />
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

    paddingHorizontal: 20,
  },
  stepContainer: {
    display: "flex",
    flexDirection: "row",
  },
  stepText: {
    fontSize: 14,
    fontWeight: "400",
  },
  icon: {
    marginRight: 10,
  },
});

export default StepItem;
