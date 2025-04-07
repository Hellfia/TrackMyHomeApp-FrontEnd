import React from 'react'
import { StyleSheet, View, Text } from "react-native";
import { SafeAreaView} from "react-native-safe-area-context";

export default function MessageClient({ navigation}) {
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text>Message</Text>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({});
