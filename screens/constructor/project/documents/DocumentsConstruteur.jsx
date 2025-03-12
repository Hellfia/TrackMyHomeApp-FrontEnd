import { FontAwesome5 } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import InputFiles from "../../../../components/InputFiles";
import ReturnButton from "../../../../components/ReturnButton";
import globalStyles from "../../../../styles/globalStyles";

export default function DocumentsConstruteur({ navigation }) {
  const [documents, setDocuments] = useState([]);

  const devUrl = process.env.DEV_URL;

  useFocusEffect(
    useCallback(() => {
      const projectId = "67d01b03db992024d53a2038";
      fetch(`${devUrl}/upload/documents/${projectId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
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

  const handleViewDocument = async (uri) => {
    try {
      const supported = await Linking.canOpenURL(uri);
      if (supported) {
        await Linking.openURL(uri);
      } else {
        console.error("Impossible d'ouvrir l'URL :", uri);
      }
    } catch (err) {
      console.error("Erreur lors de l'ouverture de l'URL :", err);
    }
  };

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
              <View style={styles.documentTitle}>
                <Text>{document.name}</Text>
              </View>

              <View style={styles.actions}>
                {/* Icone œil pour télécharger ou ouvrir le document */}
                <TouchableOpacity
                  onPress={() => handleViewDocument(document.uri)}
                >
                  <FontAwesome5
                    name="eye"
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
});
