import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import globalStyles from "../../../styles/globalStyles";
import { useSelector } from "react-redux";

export default function DashboardConstructeur({ navigation }) {
  const [projectsData, setProjectsData] = useState([]);
  const [clientsData, setClientsData] = useState([]);
  const devUrl = process.env.DEV_URL;
  const constructeur = useSelector((state) => state.constructeur.value);

  useEffect(() => {
    const constructorId = constructeur.constructorId;
    fetch(`${devUrl}/projects/${constructorId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('projects data', data)
        setProjectsData(data.data.length);
      })
      .catch((error) => console.error(error));
  }, []);



  useEffect(() => {
    const constructorId = constructeur.constructorId;
  
    fetch(`${devUrl}/projects/clients/${constructorId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('clients data', data);
  
        if (data.result) {
          setClientsData(
            data.data.map((item) => ({
              logo: item.client.profilePicture, // correction ici : 'profilePicture' au lieu de 'profilPicture'
              firstname: item.client.firstname,
              phoneNumber: item.client.phoneNumber || 'Non renseigné', // Ajouter un fallback si non existant
            }))
          );
        } else {
          setClientsData([]);
        }
      })
      .catch((error) => {
        console.error(error);
        setClientsData([]);
      });
  }, []);


  return (
    <SafeAreaView style={styles.container}>
      <View>
        <View style={globalStyles.header}>
          <Text style={globalStyles.title}>Mon dashboard</Text>
        </View>
        <ScrollView style={styles.content}>
          {/* // section pour le count du nombre de chantier */}
          <View style={styles.section}>
            <Text
              style={styles.sectionTitle}
              onPress={() => navigation.navigate("Projet")}
            >
              Mes Chantiers
            </Text>
            <Text style={styles.sectionSubtitle}>
              Vous avez {projectsData} chantiers en cours
            </Text>
          </View>
          {/* //section des clients */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mes clients</Text>
            <View style={styles.clientsRow}>
              {clientsData.map((client) => (
                <TouchableOpacity
                  key={client.id}
                  style={styles.clientCard}
                  
                >
                  <Ionicons name="image-outline" size={40} color="#6C63FF" />
                  <Text style={styles.clientText}>{client.firstname} { client.phoneNumber }</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {/* // affiche les messages */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mes messages (0)</Text>
            <Text style={styles.sectionSubtitle}>
              Vous n'avez pas de nouveaux messages
            </Text>
          </View>

          <View style={styles.section}>
            <Text
              style={styles.sectionTitle}
              onPress={() => navigation.navigate("Documents")}
            >
              Mes documents
            </Text>

            <Text style={styles.sectionSubtitle}>Mes documents</Text>
            <View style={styles.clientsRow}></View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    color: "#333",
  },
  sectionSubtitle: {
    color: "#666",
  },
  clientsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  clientCard: {
    width: 60,
    alignItems: "center",
  },
  clientText: {
    marginTop: 4,
    color: "#333",
  },
});
