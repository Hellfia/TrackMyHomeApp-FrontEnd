import { Dimensions, PixelRatio } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const BASE_WIDTH = 375; // largeur de référence (iPhone 6/7/8)

// facteur d’échelle global
const scale = SCREEN_WIDTH / BASE_WIDTH;

// normalize une taille (px) pour l’écran courant
export function normalize(size) {
  const newSize = size * scale;
  // arrondir pour éviter le flou sur les bords
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}
