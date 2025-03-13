import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

const Input = ({
  placeholder,
  value,
  onChangeText,
  placeholderTextColor,
  keyboardType,
  secureTextEntry = false,
}) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        secureTextEntry={secureTextEntry}
        style={styles.inputText}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize="words"
        autoCorrect={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#663ED9",
    borderRadius: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
  },

  inputText: {
    color: "#050315",
    fontSize: 16,
    fontWeight: "400",
  },
});

export default Input;
