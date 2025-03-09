import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import InputFiles from "../../../components/InputFiles";
import ReturnButton from "../../../components/ReturnButton";
import globalStyles from "../../../styles/globalStyles";

export default function DocumentsClient({ navigation }) {
  const [documents, setDocuments] = useState([]);

  const handleDeleteDocument = (id) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={globalStyles.header}>
        <ReturnButton onPress={() => navigation.navigate("Dashboard")} />
        <Text style={globalStyles.title}>Mes documents</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <InputFiles> </InputFiles>

        <Text style={styles.subTitle}>Mes documents</Text>
        {documents.map((doc) => (
          <View key={doc.id} style={styles.documentItem}>
            <Text style={styles.documentTitle}>{doc.title}</Text>
            <TouchableOpacity onPress={() => handleDeleteDocument(doc.id)}>
              <Ionicons name="trash-outline" size={24} color="#FF0000" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    margin: 20,
    paddingBottom: 40,
  },
  scrollContainer: {
    paddingTop: 40,
  },
  importContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#663ED9",
    borderRadius: 8,
    paddingVertical: 30,
    marginBottom: 30,
  },
  plusIcon: {
    marginBottom: 10,
  },
  importText: {
    fontSize: 16,
    color: "#663ED9",
    marginBottom: 5,
  },
  formatText: {
    fontSize: 12,
    color: "#999",
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginVertical: 30,
  },
  documentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginBottom: 10,
  },
  documentTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
});
