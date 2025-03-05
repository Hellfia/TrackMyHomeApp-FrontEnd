import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GradientButton from "../components/GradientButton";
import Input from "../components/Input";
import globalStyles from "../styles/globalStyles";

export default function AddProjectsScreen() {
  const handlePress = () => {
    console.log("Clické");
  };

  return (
    <SafeAreaView>
      <View>
        <Text style={globalStyles.title}>Créer un nouveau chantier</Text>
        <Input placeholder="Nom du client" />
        <Input placeholder="Prénom du client" />
        <Input placeholder="Adresse du chantier" />
        <Input placeholder="Code postal du chantier" />
        <Input placeholder="Ville du chantier" />
        <Input placeholder="Adresse email du client" />
        <Input placeholder="Mot de passe provisoire" />
        <GradientButton text="Valider" onPress={handlePress} />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 20,
  },
});
