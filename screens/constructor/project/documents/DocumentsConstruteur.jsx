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
import InputFiles from "../../../../components/InputFiles";
import ReturnButton from "../../../../components/ReturnButton";
import globalStyles from "../../../../styles/globalStyles";
import { useDispatch } from 'react-redux'
import { addDocument } from "../../../../reducers/constructeur";

export default function DocumentsConstruteur({ navigation }) {
  const [documents, setDocuments] = useState([]);
  
const [files, setFiles] = useState([]); // Pour stocker les fichiers uploadés
  const [selectedFile, setSelectedFile] = useState(null); // Pour stocker le fichier actuellement sélectionné
  const dispatch = useDispatch();
 
  const devUrl = process.env.DEV_URL

  // const handleImportDocument = async () => {
    
  //     // Sélection du fichier via DocumentPicker avec la nouvelle structure
  //     const res = await DocumentPicker.getDocumentAsync({
  //       type: "*/*", // Autorise tous les types de fichiers
  //     });
  //     console.log("DocumentPicker result:", res);

  //     // Vérifier que l'utilisateur n'a pas annulé et qu'il y a bien un fichier dans assets
  //     if (!res.canceled && res.assets && res.assets.length > 0) {
  //       const fileInfo = res.assets[0];

  //       // Mise à jour immédiate de l'état pour afficher le nom du fichier sélectionné
  //       setSelectedFile({ name: fileInfo.name, uri: fileInfo.uri });

  //       // Préparation du FormData pour Cloudinary
  //       const formData = new FormData();
  //       formData.append("file", {
  //         uri: fileInfo.uri,
  //         name: fileInfo.name,
  //         type: fileInfo.mimeType || "application/octet-stream",
  //       });
  //       formData.append("upload_preset", "Document"); // Remplacez par votre upload preset

  //       // Utilisation de l'URL de l'API REST de Cloudinary
  //       const cloudinaryUrl =
  //         "https://api.cloudinary.com/v1_1/db0bnigaj/upload";
  //       console.log("Cloudinary URL:", cloudinaryUrl);

  //       // Upload du fichier via fetch vers Cloudinary
  //       const uploadResponse = await fetch(cloudinaryUrl, {
  //         method: "POST",
  //         body: formData,
  //       });
  //       const uploadResult = await uploadResponse.json();
  //       console.log("Cloudinary upload result:", uploadResult);

  //       if (uploadResponse.ok) {
  //         // Création d'un nouvel objet fichier incluant l'URL Cloudinary
  //         const newFile = {
  //           name: fileInfo.name,
  //           date: Date.now(),
  //           uri: uploadResult.secure_url,
  //         };
  //         setFiles((prevFiles) => [...prevFiles, newFile]);
          
           
  //         // Utiliser directement newFile pour l'appel à l'API locale
  //         fetch(`${devUrl}/projects/upload`, {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify({
  //             file: newFile,
  //             projectId: "67c9d8308c35c9b608aeb231",
  //           }),
  //         })
  //           .then((response) => response.json())
  //           .then((data) => {
  //             console.log("Réponse de l'API :", data);
  //             if (data.result === true) {
  //               console.log("biloute", data.documents);
  //               dispatch(addDocument(data.documents));
  //             }
  //           })
  //           .catch((err) =>
  //             console.error("Erreur lors de l'envoi à l'API:", err)
  //           );
  //       } else {
  //         console.error(
  //           "Erreur lors de l'upload sur Cloudinary:",
  //           uploadResult
  //         );
  //         Alert.alert("Erreur", "L'upload du fichier a échoué");
  //       }
  //     } else {
  //       console.log("Sélection annulée par l'utilisateur.");
  //     }

  // };
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
        <InputFiles/>

        <Text style={styles.documentsTitle}>Documents Client 1</Text>
        {files.map((doc) => (
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
  documentsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#663ED9",
    marginVertical: 20,
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
