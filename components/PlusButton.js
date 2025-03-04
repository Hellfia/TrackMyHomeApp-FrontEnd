import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const PlusButton = ({
  icon,
  text,
  onPress,
  backgroundColor = "#FE5900",
  style,
}) => {
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
        <Text style={styles.buttonText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    top: 700,
    position: "absolute",
    right: 20,
    width: 70,
    paddingLeft: 10,
    marginLeft: 20,
    paddingRight: 5,
  },
  button: {
    alignItems: "center",
    paddingTop: 15,
    borderRadius: "50%",
  },
});

export default PlusButton;
