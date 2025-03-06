import React, { useState } from "react";
import { View, StyleSheet, Text, FlatList, Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";
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
    <View style={styles.container}>
      {/* Affiche le bouton + */}
      <Ionicons name="add" size={24} color="#663ED9" style={styles.plusIcon} />
      {/* Conteneur des fichiers ajoutés */}
      <View style={styles.fileContainer}>
        <Text style={styles.fileHeader}>Fichiers sélectionnés:</Text>
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
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fileContainer: {
    marginTop: 30,
    width: "80%",
  },
  fileHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  fileItem: {
    padding: 10,
    marginBottom: 5,
    backgroundColor: "#f4f4f4",
    borderRadius: 5,
  },
});

export default InputFiles;
