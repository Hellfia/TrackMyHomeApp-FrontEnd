import { StyleSheet } from "react-native";

const globalStyles = StyleSheet.create({
  title: {
    color: "#362173",
    fontSize: 24,
    fontWeight: 600,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 500,
  },
});

export default globalStyles;

// A importer dans le fichier ou on veux utiliser le globalStyles
//import globalStyles from '../styles/globalStyles';

//exemple d'utilisation :
//<View style={globalStyles.container}>
