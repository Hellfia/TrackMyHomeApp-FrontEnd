import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function DocumentsScreen() {
  const [documents, setDocuments] = useState([
    { id: 1, title: "Contrat de construction" },
    { id: 2, title: "Déblocage des fonds 1" },
    { id: 3, title: "Déblocage des fonds 2" },
    { id: 4, title: "Déblocage des fonds 3" },
  ]);

  const handleImportDocument = () => {};

  const handleDeleteDocument = (id) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#663ED9" />
        </TouchableOpacity>
        <Text style={styles.title}>Les documents</Text>

        <View style={{ width: 30 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity
          style={styles.importContainer}
          onPress={handleImportDocument}
        >
          <Ionicons
            name="add"
            size={24}
            color="#663ED9"
            style={styles.plusIcon}
          />
          <Text style={styles.importText}>Importez un nouveau document</Text>
          <Text style={styles.formatText}>
            Format accepté : JPEG, HEIC, PNG
          </Text>
        </TouchableOpacity>

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
  backButton: {
    marginRight: 8,
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
