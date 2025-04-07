import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function MessageConstructeur({ navigation }) {
    return (
        <SafeAreaView>
            <View>
                <Text>Message</Text>
            </View>
        </SafeAreaView>);
}

const styles = StyleSheet.create({});
