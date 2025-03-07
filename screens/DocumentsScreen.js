import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import ReturnButton from "../components/ReturnButton";
import * as DocumentPicker from "expo-document-picker";
import InputFiles from "../components/InputFiles";

export default function DocumentsScreen({ navigation }) {
  const [documents, setDocuments] = useState([]);

  const handleDeleteDocument = (id) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.header}>
        <ReturnButton onPress={() => navigation.navigate("Dashboard")} />
        <Text style={styles.title}>Les documents</Text>
        <View style={{ width: 30 }} />
      </View>
      z
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <InputFiles> </InputFiles>

        <Text style={styles.documentsTitle}>Documents Client 1</Text>
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
  safeContainer: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: "#FFF",
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
    color: "#663ED9",
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
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
  documentsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#663ED9",
    marginBottom: 10,
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
