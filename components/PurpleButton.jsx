import React from "react";
import PropTypes from "prop-types";
import { FontAwesome5 } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const PurpleButton = ({
  icon,
  text,
  onPress,
  gradientColors = ["#8E44AD", "#372173"],
  start = { x: 0, y: 0 },
  end = { x: 0, y: 1 },
}) => {
  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={onPress}>
      <LinearGradient
        colors={gradientColors}
        start={start}
        end={end}
        style={styles.button}
      >
        {icon && (
          <FontAwesome5
            name={icon}
            size={22}
            color="#FFFFFF"
            style={styles.icon}
          />
        )}
        <Text style={styles.buttonText}>{text}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

PurpleButton.propTypes = {
  icon: PropTypes.string,
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  gradientColors: PropTypes.arrayOf(PropTypes.string),
  start: PropTypes.shape({ x: PropTypes.number, y: PropTypes.number }),
  end: PropTypes.shape({ x: PropTypes.number, y: PropTypes.number }),
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: "100%",
    marginBottom: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 14,
  },
  icon: {
    marginRight: 12,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default PurpleButton;
