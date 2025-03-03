import React from "react";
import { TextInput, View } from "react-native";

const Input = ({
  placeholder,
  value,
  onChangeText,
  placeholderTextColor,
  keyboardType,
}) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.inputText}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    borderWidth: 3,
    borderColor: "#663ED9",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },

  inputText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Input;
