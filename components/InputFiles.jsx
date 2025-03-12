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

export default function InputFile() {
  const constructeur = useSelector((state) => state.constructeur.value);
  const client = useSelector((state) => state.client.value);

  const projectId =
    constructeur.projectId === null ? client.projectId : constructeur.projectId;

  const devUrl = process.env.DEV_URL;

  // Demande la permission pour accéder à la galerie (au moment du choix de l'image)
  const requestMediaLibraryPermissions = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission d'accès à la galerie refusée");
      return false;
    }
    return true;
  };

  // Fonction pour sélectionner une image depuis la galerie
  const pickImage = async () => {
    const hasPermission = await requestMediaLibraryPermissions();
    if (!hasPermission) return;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.3,
    });
    if (result.canceled) {
      return;
    }
    const formData = new FormData();
    formData.append("file", {
      uri: result.assets[0].uri,
      name: result.assets[0].fileName,
      type: result.assets[0].mimeType,
    });
    fetch(`${devUrl}/upload/${projectId}`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          console.log("image", data.documents);
        }
      });
  };

  // Fonction pour sélectionner un fichier (PDF, etc.) via DocumentPicker
  const pickFile = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: "*/*", // vous pouvez restreindre, ex: 'application/pdf'
      copyToCacheDirectory: true,
    });
    if (result.canceled) {
      return;
    }

    const formData = new FormData();
    formData.append("file", {
      uri: result.assets[0].uri,
      name: result.assets[0].name,
      type: result.assets[0].mimeType,
    });
    fetch(`${devUrl}/upload/${projectId}`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          console.log("document", data.documents);
        }
      });
  };
  // Ouvre un ActionSheet (iOS) ou un simple Alert (Android) pour choisir le type de fichier
  const openActionSheet = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Annuler", "Choisir une image", "Choisir un document"],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            pickImage();
          } else if (buttonIndex === 2) {
            pickFile();
          }
        }
      );
    } else {
      // Sur Android, on peut utiliser un Alert ou une bibliothèque tierce
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
      {/* Zone cliquable avec style pointillé */}
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
  // Preview
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
