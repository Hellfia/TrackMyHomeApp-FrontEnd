import { FontAwesome5 } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  ActionSheetIOS,
  Alert,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function InputPicture({ step, clientIdProps }) {
  const devUrl = process.env.DEV_URL;

  const [imageUri, setImageUri] = useState(null);
  const [fileName, setFileName] = useState("");

  // Fonction pour demander les permissions de la galerie
  const requestMediaLibraryPermissions = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission d'accès à la galerie refusée");
      return false;
    }
    return true;
  };

  // Fonction pour choisir une image depuis la galerie
  const pickImage = async () => {
    const hasPermission = await requestMediaLibraryPermissions();
    if (!hasPermission) return;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.3,
    });

    if (result.canceled) {
      return;
    }

    const selectedImage = result.assets[0];
    setImageUri(selectedImage.uri); // Mise à jour de l'état avec l'URI
    setFileName(selectedImage.fileName || "image.jpg"); // Ajout du nom du fichier

    // Formulaire pour l'upload
    const formData = new FormData();
    formData.append("file", {
      uri: selectedImage.uri,
      name: selectedImage.fileName,
      type: selectedImage.type,
    });

    fetch(`https://track-my-home-backend.vercel.app/upload/picture/${clientIdProps}/${step._id}`, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          console.log("Image téléchargée avec succès");
        }
      })
      .catch((error) => {
        console.error("Erreur lors du téléchargement de l'image :", error);
      });
  };

  // Fonction pour ouvrir le sélecteur d'image
  const openActionSheet = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Annuler", "Photothèque"],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            pickImage();
          }
        }
      );
    } else {
      Alert.alert(
        "Choisir une option",
        "",
        [
          { text: "Photothèque", onPress: pickImage },
          { text: "Annuler", style: "cancel" },
        ],
        { cancelable: true }
      );
    }
  };

  // Fonction pour supprimer l'image actuelle
  const removeImage = () => {
    setImageUri(null); // Réinitialise l'image
    setFileName(""); // Réinitialise le nom du fichier
  };

  // Logique pour afficher la preview de l'image si 'imageUri' existe
  useEffect(() => {
    if (step.uri) {
      setImageUri(step.uri);
      setFileName("image.jpg"); // Tu peux ajuster en fonction du nom du fichier
    }
  }, [step.uri]); // Cette logique se lance chaque fois que 'step.uri' change

  return (
    <View style={styles.container}>
      {imageUri ? (
        // Si une image est disponible, on affiche la preview avec l'option pour supprimer
        <View style={styles.preview}>
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          <View style={styles.infoImage}>
            <Text style={styles.fileText}>{fileName}</Text>
            <TouchableOpacity onPress={removeImage}>
              <FontAwesome5
                name="trash-alt"
                size={24}
                color="red"
                style={styles.iconTrash}
              />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // Si aucune image n'est disponible, on affiche le bouton pour importer une image
        <TouchableOpacity
          style={styles.uploadContainer}
          onPress={openActionSheet}
        >
          <Text style={styles.plusSign}>+</Text>
          <Text style={styles.mainText}>Importez une photo</Text>
          <Text style={styles.subText}>Format accepté : JPEG, HEIC, PNG</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  uploadContainer: {
    width: "100%",
    height: 150,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#663ED9",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 40,
  },
  plusSign: {
    fontSize: 40,
    color: "#FF6600",
    marginBottom: 10,
  },
  mainText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#663ED9",
    marginBottom: 5,
  },
  subText: {
    fontSize: 12,
    color: "#888",
  },
  preview: {
    alignItems: "center",
  },
  imagePreview: {
    width: 300,
    height: 150,
    borderRadius: 10,
    resizeMode: "cover",
  },
  fileText: {
    marginTop: 10,
    fontSize: 14,
    color: "#663ED9",
    textAlign: "center",
  },
  infoImage: {
    flexDirection: "row",
  },
  iconTrash: {
    marginLeft: 20,
    marginTop: 8,
  },
});
