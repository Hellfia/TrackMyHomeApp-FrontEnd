import * as DocumentPicker from "expo-document-picker";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
const InputFiles = () => {
  const [files, setFiles] = useState([]); // État pour stocker les fichiers ajoutés

  const handleImportDocument = async () => {
    console.log("handleImportDocument appelé");
    DocumentPicker.getDocumentAsync({
      type: "*/*", // Autorise tous les types de fichiers
    })
      .then((res) => {
        if (res.type === "success") {
          console.log("DocumentPicker résultat :", res);
          const newDoc = {
            id: Date.now(),
            title: res.name,
          };
          setDocuments((prevDocs) => [...prevDocs, newDoc]);
          Alert.alert("Fichier ajouté", `Nom du fichier: ${res.name}`);
        } else {
          console.log("Sélection annulée par l'utilisateur.");
        }
      })
      .catch((err) => {
        console.error("Erreur lors de la sélection du fichier:", err);
      });
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.importContainer}
        onPress={handleImportDocument}
      >
        <Ionicons
          name="add"
          size={36}
          color="#FE5900"
          style={styles.plusIcon}
        />
        <Text style={styles.importText}>Importez un nouveau document</Text>
      </TouchableOpacity>

      {/* Conteneur des fichiers ajoutés */}
      <View style={styles.fileContainer}>
        <FlatList
          data={files}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.fileItem}>
              <Text>{item.name}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  importContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#663ED9",
    borderRadius: 8,
    paddingVertical: 30,
    padding: 20,
  },
  plusIcon: {
    marginBottom: 10,
  },
  importText: {
    fontSize: 16,
    color: "#663ED9",
    marginBottom: 5,
  },
  fileContainer: {
    width: "80%",
  },
  fileItem: {
    padding: 10,
    marginBottom: 5,
    backgroundColor: "#f4f4f4",
    borderRadius: 5,
  },
});

export default InputFiles;
