import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const PlusButton = ({ icon, text, onPress, backgroundColor = "#FE5900" }) => {
  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={onPress}>
      <View style={[styles.button, { backgroundColor }]}>
        {icon && (
          <FontAwesome5
            name={icon}
            size="22"
            color="#FFFFFF"
            style={styles.icon}
          />
        )}
        <Text style={styles.buttonText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: "15%",
    marginBottom: 20,
    borderRadius: "50%",
    marginLeft: 30,
  },
  button: {
    flexDirection: "row",
    alignItems: "left",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 14,
  },
  icon: { alignItems: "center" },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 16,
    zIndex: 999, // S'assurer que le bouton flotte au-dessus du contenu
  },
});

export default PlusButton;
