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
  Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function InputPicture({
  step = {},
  clientIdProps,
  style,
  onUpload,
}) {
  const insets = useSafeAreaInsets();
  const [imageUri, setImageUri] = useState(step.uri || null);
  const [fileName, setFileName] = useState(step.uri ? "Image de l'étape" : "");
  const [showModal, setShowModal] = useState(false);
  const prodURL = process.env.PROD_URL || "";
  const requestMediaLibraryPermissions = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      Alert.alert("Permission d'accès à la galerie refusée");
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestMediaLibraryPermissions();
    if (!hasPermission) return;
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.5,
      });
      if (result.canceled || !result.assets?.length) return;
      const selected = result.assets[0];
      setImageUri(selected.uri);
      setFileName(selected.fileName || "Image sélectionnée");

      if (step._id) {
        const formData = new FormData();
        formData.append("file", {
          uri: selected.uri,
          name: selected.fileName,
          type: selected.type,
        });
        fetch(`${prodURL}/upload/picture/${clientIdProps}/${step._id}`, {
          method: "POST",
          body: formData,
        })
          .then((res) => res.json())
          .then((data) => {
            if (!data.result) {
              console.error("Upload failed:", data.error);
            } else {
              console.log("Image uploaded successfully:", data.step.uri);
              // Call the onUpload callback with the remote URL from the server response
              if (onUpload && data.step?.uri) {
                onUpload(data.step.uri);
              }
            }
          })
          .catch((err) => console.error("Error uploading image:", err));
      }
    } catch (e) {
      console.error("Erreur image picker:", e);
    }
  };

  const openActionSheet = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        { options: ["Annuler", "Photothèque"], cancelButtonIndex: 0 },
        (index) => index === 1 && pickImage()
      );
    } else {
      Alert.alert(
        "Choisir une option",
        null,
        [
          { text: "Photothèque", onPress: () => pickImage() },
          { text: "Annuler", style: "cancel" },
        ],
        { cancelable: true }
      );
    }
  };

  const removeImage = () => {
    setImageUri(null);
    setFileName("");
    // Also update the parent component
    if (onUpload) {
      onUpload("");
    }
  };

  if (!step) return null;

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        onPress={() => (imageUri ? setShowModal(true) : openActionSheet())}
        activeOpacity={0.7}
      >
        <View style={[styles.container, style]}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          ) : (
            <View style={styles.uploadContainer}>
              <Text style={styles.plusSign}>+</Text>
              <Text style={styles.mainText}>Importez une photo</Text>
              <Text style={styles.subText}>JPEG, HEIC, PNG</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      {imageUri && (
        <View style={styles.infoImage}>
          <Text style={styles.fileText}>{fileName}</Text>
          <TouchableOpacity onPress={removeImage} style={styles.trashButton}>
            <FontAwesome5 name="trash-alt" size={24} color="red" />
          </TouchableOpacity>
        </View>
      )}

      {imageUri && (
        <Modal
          visible={showModal}
          transparent={false}
          onRequestClose={() => setShowModal(false)}
        >
          <View style={styles.imageModalContainer}>
            <Image
              source={{ uri: imageUri }}
              style={styles.fullImage}
              resizeMode="contain"
            />
            <TouchableOpacity
              style={[styles.closeButton, { top: insets.top + 10 }]}
              onPress={() => setShowModal(false)}
            >
              <FontAwesome5 name="times" size={30} color="#fff" />
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: "center", marginVertical: 20 },
  container: {
    width: 340,
    height: 180,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  uploadContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  plusSign: { fontSize: 40, color: "#FF6600", marginBottom: 10 },
  mainText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#663ED9",
    marginBottom: 5,
  },
  subText: { fontSize: 12, color: "#888" },
  imagePreview: { width: "100%", height: "100%", resizeMode: "cover" },
  infoImage: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  fileText: { fontSize: 14, color: "#663ED9" },
  trashButton: { marginLeft: 20 },
  imageModalContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: { width: "100%", height: "100%" },
  closeButton: { position: "absolute", right: 20 },
});
