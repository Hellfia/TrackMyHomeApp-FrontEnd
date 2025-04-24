// utils/scale.js
import { Dimensions } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
// Largeur de référence (design maquette)
const BASE_WIDTH = 375;

/**
 * Scale horizontal basé sur la largeur de l'écran
 * @param {number} size px dans la maquette
 * @returns {number} px adapté à l'écran
 */
export function scale(size) {
  return (SCREEN_WIDTH / BASE_WIDTH) * size;
}

/**
 * Taille de police responsive
 * @param {number} fontSize px dans la maquette
 * @returns {number} taille de police adaptée
 */
export function rfs(fontSize) {
  return Math.round((SCREEN_WIDTH / BASE_WIDTH) * fontSize);
}

/**
 * Pourcentage de la largeur d'écran
 * @param {number} percent ex : 45
 * @returns {number} px correspondant
 */
export function wp(percent) {
  return (SCREEN_WIDTH * percent) / 100;
}

/**
 * Pourcentage de la hauteur d'écran
 * @param {number} percent ex : 30
 * @returns {number} px correspondant
 */
export function hp(percent) {
  return (SCREEN_HEIGHT * percent) / 100;
}
