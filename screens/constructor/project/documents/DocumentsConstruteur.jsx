import { FontAwesome5 } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  StatusBar,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Image,
  Alert,
} from "react-native";
import { useSelector } from "react-redux";
import InputFiles from "../../../../components/InputFiles";
import ReturnButton from "../../../../components/ReturnButton";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PropTypes from "prop-types";
import { WebView } from "react-native-webview";

export default function DocumentsConstructeur({ navigation }) {
  const insets = useSafeAreaInsets();
  const constructeur = useSelector((state) => state.constructeur.value);
  const client = useSelector((state) => state.client.value);
  const projectId =
    constructeur.projectId != null ? constructeur.projectId : client.projectId;

  const rawProdURL = process.env.PROD_URL || "";
  const prodURL = rawProdURL.trim();

  const [documents, setDocuments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentUri, setCurrentUri] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [fileError, setFileError] = useState(false);

  const fetchDocuments = useCallback(() => {
    fetch(`${prodURL}/upload/documents/${projectId}`)
      .then((res) => res.json())
      .then((dataFetch) => {
        const cleanDocs = dataFetch.documents.map((doc) => ({
          ...doc,
          uri: doc.uri.replace(/(\r\n|\n|\r)/gm, "").trim(),
        }));
        setDocuments(cleanDocs);
      })
      .catch((err) => console.error("Erreur récupération docs", err));
  }, [prodURL, projectId]);

  useFocusEffect(fetchDocuments);

  const handleDocumentAdded = (newDocs) => {
    const normalize = (doc) => ({
      ...doc,
      uri: doc.uri.replace(/(\r\n|\n|\r)/gm, "").trim(),
    });
    if (Array.isArray(newDocs)) {
      setDocuments(newDocs.map(normalize));
    } else {
      setDocuments((prev) => [normalize(newDocs), ...prev]);
    }
  };

  const handleDeleteDocument = (id) => {
    const deleteDocument = async () => {
      try {
        const response = await fetch(
          `${prodURL}/upload/documents/${projectId}/${id}`,
          { method: "DELETE" }
        );
        const dataFetch = await response.json();
        if (dataFetch.result) {
          setDocuments((prev) => prev.filter((doc) => doc._id !== id));
        }
      } catch (err) {
        console.error("Erreur suppression doc", err);
      }
    };
    deleteDocument();
  };

  const handleViewDocument = (uri) => {
    setFileError(false);
    const cleanUri = uri.replace(/(\r\n|\n|\r)/gm, "").trim();
    const ext = cleanUri.split(".").pop().toLowerCase();
    const type = ["png", "jpg", "jpeg", "gif"].includes(ext) ? "image" : "pdf";
    setFileType(type);
    setCurrentUri(cleanUri);
    setModalVisible(true);
  };

  const onImageError = () => {
    console.error("Image loading error:", currentUri);
    setFileError(true);
    Alert.alert("Erreur", "Impossible de charger l'image.");
  };

  const onWebViewError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.error("WebView error:", nativeEvent);
    setFileError(true);
    Alert.alert("Erreur", "Impossible de charger le document.");
  };

  return (
    <View style={styles.root}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
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
        <View style={styles.spacer} />
      </LinearGradient>

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

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        {fileError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Erreur de chargement.</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        )}
        {!fileError && fileType === "pdf" && (
          <View style={styles.pdfContainer}>
            <WebView
              source={{ uri: encodeURI(currentUri) }}
              style={styles.pdfView}
              startInLoadingState
              onError={onWebViewError}
            />
            <TouchableOpacity
              style={styles.pdfClose}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        )}
        {!fileError && fileType === "image" && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: currentUri }}
              style={styles.media}
              resizeMode="contain"
              onError={onImageError}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        )}
      </Modal>
    </View>
  );
}

DocumentsConstructeur.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

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
  spacer: { width: 40 },
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
  errorContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: { fontSize: 16, color: "red", marginBottom: 20 },
  closeButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "#663ED9",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: { color: "#fff", fontWeight: "bold" },
  pdfContainer: { flex: 1, backgroundColor: "#fff" },
  pdfView: { flex: 1 },
  pdfClose: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "#663ED9",
    padding: 10,
    borderRadius: 5,
  },
  imageContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  media: { width: "100%", height: "100%" },
});
