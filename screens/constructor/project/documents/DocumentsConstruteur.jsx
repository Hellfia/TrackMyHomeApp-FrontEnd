import { FontAwesome5 } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  StatusBar,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSelector } from "react-redux";
import InputFiles from "../../../../components/InputFiles";
import ReturnButton from "../../../../components/ReturnButton";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function DocumentsConstruteur({ navigation }) {
  const insets = useSafeAreaInsets();
  // Récupère le projectId depuis le store constructeur ou client
  const constructeur = useSelector((state) => state.constructeur.value);
  const client = useSelector((state) => state.client.value);
  const projectId =
    constructeur.projectId != null ? constructeur.projectId : client.projectId;

  const prodURL = process.env.PROD_URL;
  const [documents, setDocuments] = useState([]);

  // Fetch documents for the project
  const fetchDocuments = () => {
    fetch(`${prodURL}/upload/documents/${projectId}`)
      .then((res) => res.json())
      .then((dataFetch) => setDocuments(dataFetch.documents))
      .catch((err) => console.error("Erreur récupération docs", err));
  };

  // Load documents when screen gains focus
  useFocusEffect(
    useCallback(() => {
      fetchDocuments();
    }, [projectId])
  );

  // Handler to add newly uploaded document(s) to state
  const handleDocumentAdded = (newDocs) => {
    if (Array.isArray(newDocs)) {
      setDocuments(newDocs);
    } else {
      setDocuments((prev) => [newDocs, ...prev]);
    }
  };

  // Delete document
  const handleDeleteDocument = (id) => {
    fetch(`${prodURL}/upload/documents/${projectId}/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((dataFetch) => {
        if (dataFetch.result) {
          setDocuments((prev) => prev.filter((doc) => doc._id !== id));
        }
      })
      .catch((err) => console.error("Erreur suppression doc", err));
  };

  // View document
  const handleViewDocument = async (uri) => {
    try {
      await Linking.openURL(uri);
    } catch (err) {
      console.error("Impossible d'ouvrir URL:", uri, err);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      {/* HEADER */}
      <LinearGradient
        colors={["#8E44AD", "#372173"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[
          styles.header,
          { paddingTop: insets.top + 10, paddingBottom: 10 },
        ]}
      >
        <ReturnButton onPress={() => navigation.goBack()} top={50} />
        <Text style={styles.headerTitle}>Mes documents</Text>
        {/* placeholder for spacing */}
        <View style={styles.spacer} />
      </LinearGradient>

      {/* CONTENT AREA */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <View style={styles.content}>
          <View style={styles.inputSection}>
            <InputFiles onUploadSuccess={handleDocumentAdded} />
          </View>
          <Text style={styles.documentsTitle}>Documents</Text>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {documents.length === 0 ? (
              <Text style={styles.noDocuments}>Aucun document disponible</Text>
            ) : (
              documents.map((doc) => (
                <View key={doc._id} style={styles.documentItem}>
                  <TouchableOpacity
                    onPress={() => handleViewDocument(doc.uri)}
                    style={styles.documentTitle}
                  >
                    <Text numberOfLines={1}>{doc.name}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteDocument(doc._id)}
                  >
                    <FontAwesome5 name="trash-alt" size={20} color="red" />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#372173" },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    flex: 1,
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  container: { flex: 1 },
  content: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
  },
  inputSection: { height: 180, marginTop: 20, alignItems: "center" },
  documentsTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginLeft: 20,
  },
  scrollContent: { padding: 20 },
  documentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#663ED9",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  documentTitle: { flex: 1, paddingRight: 8, fontSize: 16 },
  noDocuments: { textAlign: "center", marginTop: 20, color: "#666" },
});
