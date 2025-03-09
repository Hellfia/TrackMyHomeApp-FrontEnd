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
import { useDispatch } from "react-redux";
import { addDocument } from "../reducers/constructeur";

const InputFiles = () => {
  const [files, setFiles] = useState([]); // Pour stocker les fichiers uploadés
  const [selectedFile, setSelectedFile] = useState(null); // Pour stocker le fichier actuellement sélectionné
  const dispatch = useDispatch();

  const handleImportDocument = async () => {
    try {
      // Sélection du fichier via DocumentPicker avec la nouvelle structure
      const res = await DocumentPicker.getDocumentAsync({
        type: "*/*", // Autorise tous les types de fichiers
      });
      console.log("DocumentPicker result:", res);

      // Vérifier que l'utilisateur n'a pas annulé et qu'il y a bien un fichier dans assets
      if (!res.canceled && res.assets && res.assets.length > 0) {
        const fileInfo = res.assets[0];

        // Mise à jour immédiate de l'état pour afficher le nom du fichier sélectionné
        setSelectedFile({ name: fileInfo.name, uri: fileInfo.uri });

        // Préparation du FormData pour Cloudinary
        const formData = new FormData();
        formData.append("file", {
          uri: fileInfo.uri,
          name: fileInfo.name,
          type: fileInfo.mimeType || "application/octet-stream",
        });
        formData.append("upload_preset", "Document"); // Remplacez par votre upload preset

        // Utilisation de l'URL de l'API REST de Cloudinary
        const cloudinaryUrl =
          "https://api.cloudinary.com/v1_1/db0bnigaj/upload";
        console.log("Cloudinary URL:", cloudinaryUrl);

        // Upload du fichier via fetch vers Cloudinary
        const uploadResponse = await fetch(cloudinaryUrl, {
          method: "POST",
          body: formData,
        });
        const uploadResult = await uploadResponse.json();
        console.log("Cloudinary upload result:", uploadResult);

        if (uploadResponse.ok) {
          // Création d'un nouvel objet fichier incluant l'URL Cloudinary
          const newFile = {
            name: fileInfo.name,
            date: Date.now(),
            uri: uploadResult.secure_url,
          };
          setFiles((prevFiles) => [...prevFiles, newFile]);
          Alert.alert("Fichier ajouté", `Nom du fichier: ${fileInfo.name}`);

          // Utiliser directement newFile pour l'appel à l'API locale
          fetch("http://192.168.1.191:4000/projects/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              file: newFile,
              projectId: "67c9d8308c35c9b608aeb231",
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              console.log("Réponse de l'API :", data);
              if (data.result === true) {
                console.log("biloute", data.documents);
                dispatch(addDocument(data.documents));
              }
            })
            .catch((err) =>
              console.error("Erreur lors de l'envoi à l'API:", err)
            );
        } else {
          console.error(
            "Erreur lors de l'upload sur Cloudinary:",
            uploadResult
          );
          Alert.alert("Erreur", "L'upload du fichier a échoué");
        }
      } else {
        console.log("Sélection annulée par l'utilisateur.");
      }
    } catch (err) {
      console.error("Erreur lors de la sélection du fichier:", err);
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de la sélection du fichier."
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Affiche le bouton + */}
      <TouchableOpacity
        testID="importButton"
        style={styles.importContainer}
        onPress={handleImportDocument}
      >
        {selectedFile ? (
          // Affichage immédiat du nom du fichier sélectionné
          <Text testID="selectedFileName" style={styles.importText}>
            {selectedFile.name}
          </Text>
        ) : (
          // Contenu par défaut du bouton
          <>
            <Ionicons
              name="add"
              size={36}
              color="#FE5900"
              style={styles.plusIcon}
            />
            <Text style={styles.importText}>Importez un nouveau document</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Affichage de la liste des fichiers uploadés */}
      <View style={styles.fileContainer}>
        <FlatList
          testID="fileList"
          nestedScrollEnabled={true}
          data={files}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.fileItem}>
              <Text>{item.name}</Text>
              <Text>{item.url}</Text>
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
  importContainer: {
    alignItems: "center",
    justifyContent: "center",

    paddingVertical: 30,
    paddingHorizontal: 20,

    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#663ED9",
    borderRadius: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  plusIcon: {
    marginBottom: 10,
    fontWeight: "bold",
  },
  importText: {
    fontSize: 16,
    color: "#663ED9",
    marginBottom: 5,
    textAlign: "center",
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
