import React from "react";
import "./Input.css"; // Importation du fichier CSS pour les styles
import { TextInput, View } from "react-native";
const Input = ({ type, placeholder, value, onChange, name }) => {
  return (
    <View className="input-container">
      <TextInput
        type={type}
        className="input-field"
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </View>
  );
};

export default Input;
