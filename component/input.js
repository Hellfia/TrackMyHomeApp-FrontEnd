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
  inputContainer: {},
  inputText: {},
});

export default Input;
