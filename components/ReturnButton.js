import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

const ReturnButton = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <FontAwesome5
        name="chevron-left"
        size={22}
        color="#663ED9"
        style={styles.icon}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute", // Position absolue pour être en haut à gauche
    top: 6, // Ajuste la position selon la hauteur que tu veux du bord supérieur
    left: 16, // Ajuste la position selon la distance du bord gauche
    zIndex: 1, // Assure que le bouton sera au-dessus d'autres éléments
  },
  icon: {
    // Tu peux ajouter des styles ici si tu veux personnaliser davantage l'icône
  },
});

export default ReturnButton;
