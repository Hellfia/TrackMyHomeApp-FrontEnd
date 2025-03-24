import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const PlusButton = ({ icon, onPress, backgroundColor = "#FE5900", style }) => {
  return (
    <TouchableOpacity style={[styles.buttonContainer, style]} onPress={onPress}>
      <View style={[styles.button, { backgroundColor }]}>
        {icon && (
          <FontAwesome5
            name={icon}
            size={22}
            color="#FFFFFF"
            style={styles.icon}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    zIndex: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  icon: {
    alignSelf: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    marginTop: 5,
    fontSize: 12,
    textAlign: "center",
  },
});

export default PlusButton;
