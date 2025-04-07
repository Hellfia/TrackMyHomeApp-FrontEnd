import { StyleSheet, View } from "react-native";
import { SafeAreaView, Text, View } from "react-native-safe-area-context";
import globalStyles from "../../../styles/globalStyles";
export default function MessageClientScreen({}) {
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text>Message</Text>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({});
