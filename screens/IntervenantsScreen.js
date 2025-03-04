import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function MesIntervenants({ navigation }) {
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.title}>Mes Intervenants</Text>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
});
