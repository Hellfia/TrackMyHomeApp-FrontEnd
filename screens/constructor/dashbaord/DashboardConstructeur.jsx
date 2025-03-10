import { FontAwesome5 } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import avatar from "../../../assets/avatar.png";
import globalStyles from "../../../styles/globalStyles";

export default function DashboardConstructeur({ navigation }) {
  const [projectsData, setProjectsData] = useState(0);
  const [clientsData, setClientsData] = useState([]);
  const [craftsmenData, setCraftsmenData] = useState(0);
  const devUrl = process.env.DEV_URL;
  const constructeur = useSelector((state) => state.constructeur.value);

  useEffect(() => {
    fetch(`${devUrl}/constructors/${constructeur.token}`)
      .then((response) => response.json())
      .then((data) => setCraftsmenData(data.constructor.craftsmen.length))
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetch(`${devUrl}/projects/${constructeur.constructorId}`)
      .then((response) => response.json())
      .then((data) => setProjectsData(data.data.length))
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetch(`${devUrl}/projects/clients/${constructeur.constructorId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setClientsData(
            data.data.map((item, index) => ({
              id: index,
              logo: item.client.profilePicture,
              firstname: item.client.firstname,
              lastname: item.client.lastname,
              phoneNumber: item.client.phoneNumber || "Non renseigné",
            }))
          );
        } else {
          setClientsData([]);
        }
      })
      .catch(console.error);
  }, []);

  const callClient = (phoneNumber) => {
    if (phoneNumber && phoneNumber !== "Non renseigné") {
      Linking.openURL(`tel:${phoneNumber}`);
    } else {
      alert("Numéro de téléphone non renseigné");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View contentContainerStyle={styles.content}>
        <Text style={globalStyles.title}>Mon dashboard</Text>
        <View style={styles.subContainer}>
          <Text
            style={styles.sectionTitle}
            onPress={() => navigation.navigate("Projet")}
          >
            Mes Chantiers
          </Text>
          <View style={styles.section}>
            <Text style={styles.sectionSubtitle}>
              Nombre de chantier en cours :{" "}
            </Text>
            <Text style={styles.highlight}>{projectsData}</Text>
          </View>

          <Text style={styles.sectionTitle}>Mes clients</Text>
          <View style={styles.sectionClient}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {clientsData.map((client) => (
                <TouchableOpacity
                  key={client.id}
                  style={styles.clientCard}
                  onPress={() => callClient(client.phoneNumber)}
                >
                  <Image
                    source={client.logo ? { uri: client.logo } : avatar}
                    style={styles.avatar}
                  />
                  <Text style={styles.clientText}>
                    {client.firstname} {client.lastname}
                  </Text>
                  <FontAwesome5 name="phone-alt" color="#FE5900" size={20} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <Text style={styles.sectionTitle}>Mes artisans</Text>
          <TouchableOpacity
            style={styles.section}
            onPress={() => navigation.navigate("Intervenants")}
          >
            <Text style={styles.sectionSubtitle}>
              Nombre d'artisan en activité:
            </Text>
            <Text style={styles.highlight}>{craftsmenData}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subContainer: {
    marginVertical: 40,
  },
  content: {
    flexGrow: 1,
    padding: 10,
  },
  section: {
    marginBottom: 30,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#663ED9",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    alignItems: "center",
    marginHorizontal: 25,
  },
  sectionClient: {
    marginBottom: 30,
    paddingBottom: 10,
    marginLeft: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    marginBottom: 10,
    marginHorizontal: 25,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  highlight: {
    color: "#FE5900",
    fontSize: 22,
    fontWeight: "bold",
    padding: 5,
  },
  clientCard: {
    borderWidth: 1,
    borderColor: "#663ED9",
    borderRadius: 8,
    padding: 12,
    marginRight: 12,
    alignItems: "center",
    width: 130,
    backgroundColor: "#fff",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 6,
  },
  clientText: {
    fontWeight: "500",
    color: "#663ED9",
    marginTop: 4,
    marginBottom: 10,
    textAlign: "center",
  },
});
