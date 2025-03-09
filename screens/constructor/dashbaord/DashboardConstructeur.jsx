import React from "react";
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

export default function DashboardConstructeur({ navigation }) {
  const projectsData = [
    { id: "1", name: "Maison de Paul", progress: 45 },
    { id: "2", name: "Villa de Marie", progress: 80 },
    { id: "3", name: "Extension Pierre", progress: 25 },
  ];

  // juste pour tester le coun du nombre de chantier
  const chantierCount = projectsData.length;

  const clientsData = [
    { id: "1", name: "Client 1", projectId: "1" },
    { id: "2", name: "Client 2", projectId: "2" },
    { id: "3", name: "Client 3", projectId: "3" },
    { id: "4", name: "Client 4", projectId: "1" },
  ];

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
              Vous avez {chantierCount} chantiers en cours
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
                  onPress={() =>
                    navigation.navigate("DetailProject", {
                      projectId: client.projectId,
                    })
                  }
                >
                  <Ionicons name="image-outline" size={40} color="#6C63FF" />
                  <Text style={styles.clientText}>{client.name}</Text>
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
