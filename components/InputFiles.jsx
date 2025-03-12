import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActionSheetIOS,
  Platform,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

export default function InputFile() {
  const devUrl = process.env.DEV_URL
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Demande la permission pour accéder à la galerie (au moment du choix de l'image)
  const requestMediaLibraryPermissions = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
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
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.3,
    });
    console.log("biloute")
    console.log(result)
    if (result.canceled) {
      return 
    }
    console.log("biloute2", result.assets[0].uri)
    const formData = new FormData()
    formData.append("file", {
      uri: result.assets[0].uri,
      name: result.assets[0].fileName,
      type: result.assets[0].mimeType 
    })
    console.log("biloute3", formData.file)
    fetch(`${devUrl}/upload/67d01b03db992024d53a2038`, {
       method: "POST",
      //  headers: { "Content-Type": "image" },
      body: formData
      })
        .then((response) => response.json())
         .then((data) => {
         console.log("Réponse de l'API :", data);
         if (data.result === true) {
          console.log("biloute", data.documents);
          dispatch(addDocument(data.documents));
    }
  })
             
};

  // Fonction pour sélectionner un fichier (PDF, etc.) via DocumentPicker
  const pickFile = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: '*/*', // vous pouvez restreindre, ex: 'application/pdf'
      copyToCacheDirectory: true,
    });
console.log('chtio', result)
if (result.canceled) {
  return 
}
console.log("biloute2", result.assets[0].uri)
const formData = new FormData()
formData.append("file", {
  uri: result.assets[0].uri,
  name: result.assets[0].name,
  type: result.assets[0].mimeType 
})
console.log("biloute3", formData.file)
fetch(`${devUrl}/upload/67d01b03db992024d53a2038`, {
   method: "POST",
  //  headers: { "Content-Type": "image" },
  body: formData
  })
    .then((response) => response.json())
     .then((data) => {
     console.log("Réponse de l'API :", data);
     if (data.result === true) {
      console.log("biloute", data.documents);
      dispatch(addDocument(data.documents));
}
})
  }
  // Ouvre un ActionSheet (iOS) ou un simple Alert (Android) pour choisir le type de fichier
  const openActionSheet = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Annuler', 'Choisir une image', 'Choisir un document'],
          cancelButtonIndex: 0,
        },
        buttonIndex => {
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
        'Choisir une option',
        '',
        [
          { text: 'Choisir une image', onPress: pickImage },
          { text: 'Choisir un document', onPress: pickFile },
          { text: 'Annuler', style: 'cancel' },
        ],
        { cancelable: true }
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Zone cliquable avec style pointillé */}
      <TouchableOpacity style={styles.uploadContainer} onPress={openActionSheet}>
        <Text style={styles.plusSign}>+</Text>
        <Text style={styles.mainText}>Importez une image du chantier</Text>
        <Text style={styles.subText}>Format accepté : JPEG, HEIC, PNG</Text>
      </TouchableOpacity>

      {/* Prévisualisation de l'image ou du fichier sélectionné */}
      {selectedImage && (
        <View style={styles.preview}>
          <Text style={styles.previewTitle}>Image sélectionnée :</Text>
          <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
        </View>
      )}
      {selectedFile && (
        <View style={styles.preview}>
          <Text style={styles.previewTitle}>Fichier sélectionné :</Text>
          <Text numberOfLines={1} style={styles.fileText}>
            {selectedFile}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    alignItems: 'center',
  },
  uploadContainer: {
    width: '100%',
    height: 150,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#663ED9', 
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  plusSign: {
    fontSize: 40,
    color: '#FF6600', 
    marginBottom: 10,
  },
  mainText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#663ED9',
    marginBottom: 5,
  },
  subText: {
    fontSize: 12,
    color: '#888',
  },
  // Preview
  preview: {
    marginTop: 20,
    alignItems: 'center',
  },
  previewTitle: {
    fontWeight: '600',
    marginBottom: 5,
  },
  imagePreview: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  fileText: {
    maxWidth: '80%',
    textAlign: 'center',
  },
});
