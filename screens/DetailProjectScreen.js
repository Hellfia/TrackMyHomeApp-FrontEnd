import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Image,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";

export default function DetailProjectScreen({ navigation, route }) {
  // Exemple d'étapes stockées dans un state
  const [steps, setSteps] = useState([
    { id: "1", label: "Étude du terrain", status: "Terminé", image: null },
    { id: "2", label: "Fondations", status: "En cours", image: null },
    { id: "3", label: "Étape 3", status: "Pas commencé", image: null },
  ]);

  // State pour la modal de modification
  const [modalVisible, setModalVisible] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(null);

  // Champs de la modal
  const [status, setStatus] = useState("pasCommence");
  const [autreStatus, setAutreStatus] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [commentaires, setCommentaires] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  // Fonction pour sélectionner une image avec la nouvelle API d'Expo Image Picker
  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.status !== "granted") {
      Alert.alert(
        "Permission nécessaire",
        "La permission d'accéder à la médiathèque est requise !"
      );
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images, // Utiliser la nouvelle API
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    // Dans la nouvelle API, le résultat renvoie { canceled: boolean, assets: [...] }
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // Ouvre la modal et pré-remplit les champs en fonction de l'étape
  const openModal = (stepIndex) => {
    setCurrentStepIndex(stepIndex);
    const currentStep = steps[stepIndex];
    if (currentStep.status === "Terminé") setStatus("termine");
    else if (currentStep.status === "En cours") setStatus("enCours");
    else if (currentStep.status === "Pas commencé") setStatus("pasCommence");
    else {
      setStatus("autre");
      setAutreStatus(currentStep.status);
    }
    setSelectedImage(currentStep.image || null);
    // Vous pouvez également pré-remplir d'autres champs (dates, commentaires) ici.
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleValidate = () => {
    const updatedSteps = [...steps];
    const stepToModify = updatedSteps[currentStepIndex];

    let newStatus = "";
    if (status === "pasCommence") newStatus = "Pas commencé";
    else if (status === "enCours") newStatus = "En cours";
    else if (status === "termine") newStatus = "Terminé";
    else if (status === "autre") newStatus = autreStatus || "Autre";

    stepToModify.status = newStatus;
    // Enregistrer l'image sélectionnée
    stepToModify.image = selectedImage;
    // (Optionnel) Enregistrer dateDebut, dateFin, commentaires, etc.
    updatedSteps[currentStepIndex] = stepToModify;
    setSteps(updatedSteps);
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#6C63FF" />
          <Text style={styles.backText}>Retour</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.allProjectsButton}
          onPress={() => navigation.navigate("Projet")}
        >
          <Text style={styles.allProjectsButtonText}>Tous mes chantiers</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Nom du client / du projet */}
        <Text style={styles.ownerName}>Kevin</Text>

        {/* Zone d'image */}
        <View style={styles.imageContainer}>
          {/* Affiche l'image du chantier si elle existe */}
          {steps[currentStepIndex]?.image ? (
            <Image
              source={{ uri: steps[currentStepIndex].image }}
              style={styles.imageDisplay}
            />
          ) : (
            <Text style={styles.imagePlaceholder}>Ajouter une image</Text>
          )}
        </View>

        {/* Liste des étapes */}
        {steps.map((step, index) => (
          <View key={step.id} style={styles.stepRow}>
            <View style={styles.stepInfo}>
              <Text style={styles.stepLabel}>
                {step.label} - {step.status}
              </Text>
              {step.image && (
                <Image source={{ uri: step.image }} style={styles.stepImage} />
              )}
            </View>
            <TouchableOpacity
              style={styles.modifyButton}
              onPress={() => openModal(index)}
            >
              <Text style={styles.modifyButtonText}>Modifier</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Bouton pour les documents administratifs */}
        <TouchableOpacity style={styles.docsButton}>
          <Text style={styles.docsButtonText}>Les documents administratif</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal de modification */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.modalScroll}>
              <Text style={styles.modalTitle}>Modifier l'étape</Text>

              {/* Zone d'ajout d'image */}
              <TouchableOpacity
                style={styles.modalImageContainer}
                onPress={pickImage}
              >
                {selectedImage ? (
                  <Image
                    source={{ uri: selectedImage }}
                    style={styles.modalImage}
                  />
                ) : (
                  <Text style={styles.modalImageText}>Ajouter une image</Text>
                )}
              </TouchableOpacity>

              {/* Statut */}
              <Text style={styles.sectionLabel}>Status :</Text>
              <View style={styles.statusRow}>
                <TouchableOpacity
                  style={styles.radioContainer}
                  onPress={() => setStatus("pasCommence")}
                >
                  <Ionicons
                    name={
                      status === "pasCommence"
                        ? "radio-button-on"
                        : "radio-button-off"
                    }
                    size={20}
                    color="#6C63FF"
                  />
                  <Text style={styles.radioLabel}>Pas commencé</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.radioContainer}
                  onPress={() => setStatus("enCours")}
                >
                  <Ionicons
                    name={
                      status === "enCours"
                        ? "radio-button-on"
                        : "radio-button-off"
                    }
                    size={20}
                    color="#6C63FF"
                  />
                  <Text style={styles.radioLabel}>En cours</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.radioContainer}
                  onPress={() => setStatus("termine")}
                >
                  <Ionicons
                    name={
                      status === "termine"
                        ? "radio-button-on"
                        : "radio-button-off"
                    }
                    size={20}
                    color="#6C63FF"
                  />
                  <Text style={styles.radioLabel}>Terminé</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.statusRow}>
                <TouchableOpacity
                  style={styles.radioContainer}
                  onPress={() => setStatus("autre")}
                >
                  <Ionicons
                    name={
                      status === "autre"
                        ? "radio-button-on"
                        : "radio-button-off"
                    }
                    size={20}
                    color="#6C63FF"
                  />
                  <Text style={styles.radioLabel}>Autres - personnalisé</Text>
                </TouchableOpacity>
              </View>
              {status === "autre" && (
                <TextInput
                  style={styles.input}
                  placeholder="Entrez un statut personnalisé"
                  value={autreStatus}
                  onChangeText={setAutreStatus}
                />
              )}

              {/* Date de début */}
              <Text style={styles.sectionLabel}>Date de début :</Text>
              <TextInput
                style={styles.input}
                placeholder="JJ/MM/AAAA"
                value={dateDebut}
                onChangeText={setDateDebut}
              />

              {/* Date de fin */}
              <Text style={styles.sectionLabel}>Date de fin :</Text>
              <TextInput
                style={styles.input}
                placeholder="JJ/MM/AAAA"
                value={dateFin}
                onChangeText={setDateFin}
              />

              {/* Commentaires */}
              <Text style={styles.sectionLabel}>Commentaires :</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Entrez vos commentaires"
                multiline={true}
                numberOfLines={4}
                value={commentaires}
                onChangeText={setCommentaires}
              />

              {/* Bouton Valider */}
              <TouchableOpacity
                style={styles.validateButton}
                onPress={handleValidate}
              >
                <Text style={styles.validateButtonText}>Valider</Text>
              </TouchableOpacity>

              {/* Bouton Annuler */}
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeModal}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    marginLeft: 4,
    color: "#6C63FF",
    fontSize: 16,
    fontWeight: "500",
  },
  allProjectsButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#6C63FF",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  allProjectsButtonText: {
    color: "#6C63FF",
    fontWeight: "600",
  },
  contentContainer: {
    padding: 16,
  },
  ownerName: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 16,
    color: "#333",
  },
  imageContainer: {
    height: 150,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  imagePlaceholder: {
    color: "#666",
  },
  imageDisplay: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  stepInfo: {
    flex: 1,
  },
  stepLabel: {
    fontSize: 16,
    color: "#333",
  },
  stepImage: {
    width: 50,
    height: 50,
    marginTop: 8,
    borderRadius: 4,
  },
  modifyButton: {
    backgroundColor: "#6C63FF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  modifyButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  docsButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#6C63FF",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginTop: 16,
  },
  docsButtonText: {
    color: "#6C63FF",
    fontWeight: "600",
  },
  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 12,
    padding: 16,
    maxHeight: "90%",
  },
  modalScroll: {
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  modalImageContainer: {
    height: 120,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  modalImageText: {
    color: "#666",
  },
  modalImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
    marginBottom: 4,
    color: "#333",
  },
  statusRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  radioLabel: {
    marginLeft: 4,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    color: "#333",
  },
  textArea: {
    height: 80,
  },
  validateButton: {
    backgroundColor: "#6C63FF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  validateButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#6C63FF",
    fontWeight: "600",
    fontSize: 16,
  },
});
