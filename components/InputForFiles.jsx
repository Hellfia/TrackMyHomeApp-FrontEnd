import React, { useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View, Image, Modal } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";

export default function InputForFiles({ documents, setDocuments }) {
  const [modalVisible, setModalVisible] = useState(false);

  const handlePress = () => setModalVisible(true);

  const handleOptionSelect = async (option) => {
    setModalVisible(false);

    if (option === "camera") {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      if (!cameraPermission.granted) {
        Alert.alert("Permission refusée", "Accès caméra requis");
        return;
      }

      let result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.8 });
      if (!result.canceled) uploadToCloudinary(result.assets[0].uri);
    }

    if (option === "gallery") {
      const galleryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!galleryPermission.granted) {
        Alert.alert("Permission refusée", "Accès à la galerie requis");
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 1 });
      if (!result.canceled) uploadToCloudinary(result.assets[0].uri);
    }

    if (option === "document") {
      const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
      if (!result.canceled && result.assets) {
        uploadToCloudinary(result.assets[0].uri, result.assets[0].name);
      }
    }
  };

  const uploadToCloudinary = async (uri, name = "document") => {
    const formData = new FormData();
    formData.append("file", { uri, name, type: "multipart/form-data" });
    formData.append("upload_preset", "db0bnigaj");

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/db0bnigaj/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (result.secure_url) {
        const newDoc = { id: Date.now().toString(), name, uri: result.secure_url };
        setDocuments((prev) => [...prev, newFile]);
      }
    } catch (error) {
      Alert.alert("Erreur", "Échec de l'upload : " + error.message);
    }
  };

  

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.importContainer} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={36} color="#FE5900" style={styles.plusIcon} />
        <Text style={styles.importText}>Importer un nouveau document</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={() => handleOptionSelect("camera")} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Prendre une photo</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleOptionSelect("gallery")} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Photothèque</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleOptionSelect("document")} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Document</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCancel}>
              <Text style={styles.modalCancelText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#FFF",
    padding: 20,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  modalButton: {
    paddingVertical: 12,
  },
  modalButtonText: {
    fontSize: 18,
    textAlign: "center",
    color: "#663ED9",
  },
  modalCancel: {
    paddingVertical: 10,
  },
});
