import { FontAwesome5 } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import InputFiles from "../../../../components/InputFiles";
import ReturnButton from "../../../../components/ReturnButton";
import globalStyles from "../../../../styles/globalStyles";

export default function DocumentsConstruteur({ navigation }) {
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null); // Pour gérer le document sélectionné

  const devUrl = process.env.DEV_URL;

  useFocusEffect(
    useCallback(() => {
      const projectId = "67d01b03db992024d53a2038";
      fetch(`${devUrl}/upload/documents/${projectId}`)
        .then((res) => res.json())
        .then((data) => {
          setDocuments(data.documents);
        })
        .catch((err) => {
          console.error("Erreur lors de la récupération des documents", err);
        });
    }, [])
  );

  const handleDeleteDocument = (id) => {
    const projectId = "67d01b03db992024d53a2038";
    fetch(`${devUrl}/upload/documents/${projectId}/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.result) {
          setDocuments((prevDocuments) =>
            prevDocuments.filter((doc) => doc._id !== id)
          );
        } else {
          console.error("Erreur lors de la suppression du document");
        }
      })
      .catch((err) => {
        console.error("Erreur lors de la suppression du document", err);
      });
  };

  const handleViewDocument = (uri) => {
    setSelectedDocument(uri);
  };

  if (selectedDocument) {
    const htmlContent = `
      <html>
        <head>
          <style>
            body {
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              background-color: #f7f7f7;
            }
            img {
              max-width: 100%;
              max-height: 100%;
              object-fit: contain;
            }
          </style>
        </head>
        <body>
          <img src="${selectedDocument}" />
        </body>
      </html>
    `;

    return (
      <SafeAreaView style={styles.webviewContainer}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setSelectedDocument(null)} // Ferme la WebView
        >
          <FontAwesome5 name="times" size={24} color="white" />
        </TouchableOpacity>
        <WebView
          originWhitelist={["*"]}
          source={{ html: htmlContent }} // Charge le contenu HTML avec l'image centrée
          style={styles.webview}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={globalStyles.header}>
        <ReturnButton onPress={() => navigation.navigate("Dashboard")} />
        <Text style={globalStyles.title}>Mes documents</Text>
      </View>
      <View style={styles.inputContainer}>
        <InputFiles />
      </View>
      <Text style={styles.documentsTitle}>Documents</Text>
      <ScrollView>
        {documents.length === 0 ? (
          <Text style={styles.noDocuments}>Aucun document disponible</Text>
        ) : (
          documents.map((document) => (
            <View key={document._id} style={styles.documentItem}>
              <TouchableOpacity
                onPress={() => handleViewDocument(document.uri)}
                style={styles.documentTitle}
              >
                <Text>{document.name}</Text>
              </TouchableOpacity>

              <View style={styles.actions}>
                {/* Icone œil pour visualiser le document */}
                <TouchableOpacity
                // onPress={() =>  }
                >
                  <FontAwesome5
                    name="arrow-alt-circle-down"
                    size={24}
                    color="#663ED9"
                    style={styles.icon}
                  />
                </TouchableOpacity>

                {/* Icone poubelle pour supprimer le document */}
                <TouchableOpacity
                  onPress={() => handleDeleteDocument(document._id)}
                >
                  <FontAwesome5 name="trash-alt" size={24} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
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
  inputContainer: {
    height: 180,
    marginTop: 20,
  },
  documentsTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 20,
  },
  documentItem: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#663ED9",
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  documentTitle: {
    fontSize: 14,
    fontWeight: "500",
    paddingLeft: 10,
    maxWidth: 230,
  },
  icon: {
    marginRight: 15,
  },
  noDocuments: {
    textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  webviewContainer: {
    flex: 1,
    position: "relative",
  },
  webview: {
    flex: 1,
  },
  closeButton: {
    position: "absolute",
    top: 70,
    right: 30,
    zIndex: 10,
    backgroundColor: "red",
    width: 50,
    height: 50,
    borderRadius: 50,
    padding: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
