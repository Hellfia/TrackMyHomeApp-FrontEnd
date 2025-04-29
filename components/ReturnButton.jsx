import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const ReturnButton = ({ onPress, top = 4, left = 0 }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, { top, left }]}
    >
      <View style={styles.circle}>
        <FontAwesome5 name="chevron-left" size={20} color="#fff" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    paddingLeft: 10,
    zIndex: 10,
  },
  circle: {
    backgroundColor: "#836BAE",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
});

export default ReturnButton;
