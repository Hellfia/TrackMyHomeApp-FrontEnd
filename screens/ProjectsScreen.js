import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function ProjectsScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [projectsData, setProjectsData] = useState([
    { id: "1", name: "Maison de Paul", progress: 45 },
    { id: "2", name: "Villa de Marie", progress: 80 },
    { id: "3", name: "Extension Pierre", progress: 25 },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newChantier, setNewChantier] = useState({
    name: "",
    prenom: "",
    adresse: "",
  });

  useEffect(() => {
    (async () => {
      // Demande de permission de géolocalisation
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission refusée pour accéder à la géolocalisation");
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    })();
  }, []);

  const addChantier = () => {
    const newId = Date.now().toString();
    const newItem = { id: newId, name: newChantier.name, progress: 0 };
    setProjectsData([...projectsData, newItem]);
    setNewChantier({ name: "", prenom: "", adresse: "" });
    setModalVisible(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("DetailProject", { projectId: item.id })
      }
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Ionicons name="arrow-forward" size={20} color="#666" />
      </View>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${item.progress}%` }]} />
      </View>
      <Text style={styles.progressText}>{item.progress}%</Text>
    </TouchableOpacity>
  );

  const defaultRegion = {
    latitude: 46.603354,
    longitude: 1.888334,
    latitudeDelta: 10,
    longitudeDelta: 10,
  };

  const region = location
    ? {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 1,
        longitudeDelta: 1,
      }
    : defaultRegion;

  return (
    <SafeAreaView style={styles.safeContainer} edges={["top", "left", "right"]}>
      <View style={styles.fixedHeader}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mes Chantiers</Text>
          <TouchableOpacity
            style={styles.headerIcon}
            onPress={() => navigation.navigate("Messages")}
          >
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={24}
              color="#6C63FF"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.logoContainer}>
          {/* <Image
            style={styles.logoPlaceholder}
            source={require("../assets/logo.png")}
          /> */}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.mapContainer}>
          <MapView style={styles.map} region={region}>
            {location && (
              <Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                title="Votre position"
              />
            )}
          </MapView>
        </View>

        <Text style={styles.title}>Mes Chantiers</Text>
        {projectsData.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() =>
              navigation.navigate("DetailProject", { projectId: item.id })
            }
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Ionicons name="arrow-forward" size={20} color="#666" />
            </View>
            <View style={styles.progressBarContainer}>
              <View
                style={[styles.progressBar, { width: `${item.progress}%` }]}
              />
            </View>
            <Text style={styles.progressText}>{item.progress}%</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Nouveau Chantier</Text>
            <TextInput
              style={styles.input}
              placeholder="Nom du chantier"
              value={newChantier.name}
              onChangeText={(text) =>
                setNewChantier({ ...newChantier, name: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Prénom"
              value={newChantier.prenom}
              onChangeText={(text) =>
                setNewChantier({ ...newChantier, prenom: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Adresse du chantier"
              value={newChantier.adresse}
              onChangeText={(text) =>
                setNewChantier({ ...newChantier, adresse: text })
              }
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={addChantier}
              >
                <Text style={styles.modalButtonText}>Créer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  fixedHeader: {
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    position: "relative",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#6C63FF",
    textAlign: "center",
    width: "100%",
  },
  headerIcon: {
    position: "absolute",
    right: 16,
    padding: 4,
  },
  logoContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    color: "#6C63FF",
    fontWeight: "600",
  },
  scrollContent: {
    paddingBottom: 80,
  },
  mapContainer: {
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  map: {
    width: "100%",
    height: 250,
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
    color: "#333",
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  progressBarContainer: {
    width: "100%",
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    marginTop: 10,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#6C63FF",
  },
  progressText: {
    marginTop: 6,
    fontSize: 14,
    color: "#666",
  },

  addButton: {
    position: "absolute",
    bottom: 10,
    right: 30,
    backgroundColor: "#6C63FF",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    color: "#6C63FF",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    backgroundColor: "#6C63FF",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#aaa",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
