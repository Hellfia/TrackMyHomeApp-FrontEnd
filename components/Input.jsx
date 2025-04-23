import React from "react";
import { StyleSheet, TextInput, View, Image } from "react-native";

const Input = ({
  placeholder,
  value,
  onChangeText,
  placeholderTextColor = "#fff",
  keyboardType,
  secureTextEntry = false,
  autoCapitalize,
  icon, // 👈 nouvelle prop
}) => {
  return (
    <View style={styles.inputContainer}>
      {icon && <Image source={icon} style={styles.icon} />}
      <TextInput
        secureTextEntry={secureTextEntry}
        style={styles.inputText}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row", // 👈 pour aligner icône + input
    alignItems: "center",
    width: "100%",
    borderWidth: 1.5,
    borderColor: "#fff",
    borderRadius: 12,
    backgroundColor: "#372173",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    paddingHorizontal: 14,
    height: 54,
    marginBottom: 16, // ✅ c’est bien
    fontSize: 16,
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 10,
    tintColor: "#fff", // optionnel si tu veux qu’elles soient blanches
  },
  inputText: {
    flex: 1, // ← indispensable !
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Input;
