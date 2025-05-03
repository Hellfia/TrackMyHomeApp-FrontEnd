import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import {
  ActionSheetIOS,
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";

export default function InputFile({ onUploadSuccess }) {
  const constructeur = useSelector((state) => state.constructeur.value);
  const client = useSelector((state) => state.client.value);

  const projectId =
    constructeur.projectId === null ? client.projectId : constructeur.projectId;

  const prodURL = process.env.PROD_URL;

  // Demande la permission pour accéder à la galerie
  const requestMediaLibraryPermissions = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission d'accès à la galerie refusée");
      return false;
    }
    return true;
  };

  // Sélection et upload d'une image
  const pickImage = async () => {
    const hasPermission = await requestMediaLibraryPermissions();
    if (!hasPermission) return;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.3,
    });
    if (result.canceled) return;

    const formData = new FormData();
    formData.append("file", {
      uri: result.assets[0].uri,
      name: result.assets[0].fileName,
      type: result.assets[0].mimeType,
    });

    fetch(`${prodURL}/upload/${projectId}`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          // Appel du callback pour mettre à jour la liste immédiatement
          onUploadSuccess && onUploadSuccess(data.document || data.documents);
        }
      })
      .catch((err) => console.error("Erreur upload image", err));
  };

  // Sélection et upload d'un fichier
  const pickFile = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
    });
    if (result.canceled) return;

    const formData = new FormData();
    formData.append("file", {
      uri: result.assets[0].uri,
      name: result.assets[0].name,
      type: result.assets[0].mimeType,
    });

    fetch(`${prodURL}/upload/${projectId}`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          // Appel du callback pour mettre à jour la liste immédiatement
          onUploadSuccess && onUploadSuccess(data.document || data.documents);
        }
      })
      .catch((err) => console.error("Erreur upload document", err));
  };

  // Ouvre les options selon la plateforme
  const openActionSheet = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Annuler", "Choisir une image", "Choisir un document"],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) pickImage();
          else if (buttonIndex === 2) pickFile();
        }
      );
    } else {
      Alert.alert(
        "Choisir une option",
        "",
        [
          { text: "Choisir une image", onPress: pickImage },
          { text: "Choisir un document", onPress: pickFile },
          { text: "Annuler", style: "cancel" },
        ],
        { cancelable: true }
      );
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.uploadContainer}
        onPress={openActionSheet}
      >
        <Text style={styles.plusSign}>+</Text>
        <Text style={styles.mainText}>Importez un document</Text>
        <Text style={styles.subText}>Format accepté : JPEG, HEIC, PNG</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
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
    padding: 10,
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
    marginTop: 20,
    alignItems: "center",
  },
  previewTitle: {
    fontWeight: "600",
    marginBottom: 5,
  },
  imagePreview: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  fileText: {
    maxWidth: "80%",
    textAlign: "center",
  },
});
