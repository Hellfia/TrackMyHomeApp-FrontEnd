import React from "react";
import "./Input.css"; // Importation du fichier CSS pour les styles
import { TextInput, View } from "react-native";
const Input = ({ type, placeholder, value, onChange, name }) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        type={type}
        style={inputText}
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </View>
  );
};
//style du input
const styles = StyleSheet.create({});

export default Input;
