import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const PlusButton = ({ icon, onPress, style }) => {
  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={onPress}>
      <View style={styles.shadowWrapper}>
        <LinearGradient
          colors={["#F8D5C0", "#fb9b6b", "#f67360"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          locations={[0, 0.5, 0.9]}
          style={[styles.gradientButton, style]}
        >
          {icon && (
            <FontAwesome5
              name={icon}
              size={22}
              color="#FFFFFF"
              style={styles.icon}
            />
          )}
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  shadowWrapper: {
    borderRadius: 30,
    shadowColor: "#fb9b6b",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 10,
  },
  gradientButton: {
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    // padding removed to allow icon to be perfectly centered via external style width/height
  },
  icon: {
    alignSelf: "center",
  },
});

export default PlusButton;
