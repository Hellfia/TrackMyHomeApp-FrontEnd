import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PlusButton from "../components/PlusButton";
import { useSelector } from "react-redux";
import CraftsmanContainer from "../components/CraftsmanContainer";
import globalStyles from "../styles/globalStyles";
import { useEffect, useState } from "react";

export default function MesIntervenants({ navigation }) {
  const constructeur = useSelector((state) => state.constructeur.value);
  const [craftsman, setCraftsman] = useState([]);
  console.log("craftsman", craftsman);
  useEffect(() => {
    const token = constructeur.token;
    fetch(`http://192.168.1.191:4000/craftsmen/${token}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("dataFecthed", data);
        // data est déjà un tableau d'artisans
        setCraftsman(data.data);
      })
      .catch((error) => console.error("Erreur lors du fetch:", error));
  }, []);
  console.log(constructeur);
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Mes intervenants</Text>
        <View style={styles.listContent}>
          <ScrollView>
            {craftsman.map((craftsmanItem) => (
              <CraftsmanContainer
                key={craftsmanItem._id}
                craftsmanName={craftsmanItem.craftsmanName}
                craftsmanLogo={craftsmanItem.craftsmanLogo}
                craftsmanAddress={craftsmanItem.craftsmanAddress}
                craftsmanZip={craftsmanItem.craftsmanZip}
                craftsmanCity={craftsmanItem.craftsmanCity}
              />
            ))}
          </ScrollView>
        </View>
      </View>
      <View style={styles.plusButton}></View>
      <PlusButton
        icon="plus"
        onPress={() => navigation.navigate("CreateCraftsman")}
      ></PlusButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerContainer: {
    paddingTop: 50,
    paddingBottom: 20,
    alignItems: "center",
    backgroundColor: "#F7F7F7",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#663ED9",
  },
  listContent: {
    padding: 16,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
  },
});
