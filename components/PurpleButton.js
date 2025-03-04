import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const PurpleButton = ({ text, onPress }) => {
  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={onPress}>
      <View style={styles.button}>
        <Text style={[styles.buttonText]}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: "100%",
    marginBottom: 20,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default PurpleButton;
