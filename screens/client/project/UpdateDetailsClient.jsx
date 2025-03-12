import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ReturnButton from "../../../components/ReturnButton";
import globalStyles from "../../../styles/globalStyles";

export default function UpdateDetailsClient({ route, navigation }) {
  const { data } = route.params;

  const formatDate = (date) => {
    if (!date) return "Pas de date renseignée";
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusIcon = (status) => {
    let iconName = "";
    let iconColor = "";

    if (status === "À venir") {
      iconName = "ban";
      iconColor = "#FF0000";
    } else if (status === "Terminé") {
      iconName = "check";
      iconColor = "#28DB52";
    } else if (status === "En cours") {
      iconName = "spinner";
      iconColor = "#FFA500";
    }

    return { iconName, iconColor };
  };

  const { iconName, iconColor } = getStatusIcon(data.status);

  return (
    <SafeAreaView style={styles.container}>
      <View style={globalStyles.header}>
        <ReturnButton onPress={() => navigation.goBack()} />
        <Text style={globalStyles.title}>{data.name}</Text>
      </View>
      {data.uri ? ( // Vérifie si l'URI existe
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: data.uri }} // Affiche l'image si l'URI est valide
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      ) : null}{" "}
      {/* Masque l'image si l'URI n'est pas valide */}
      <ScrollView>
        <View style={styles.infosContainer}>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Statut de l'étape :</Text>
            <View style={styles.statusRow}>
              <FontAwesome5 name={iconName} color={iconColor} size={24} />
              <Text style={styles.dataStatus}>{data.status}</Text>
            </View>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Date de début :</Text>
            <Text style={styles.dataText}>
              {data.date
                ? formatDate(data.date)
                : "Pas de date de début renseignée"}
            </Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Date de fin :</Text>
            <Text style={styles.dataText}>
              {data.dateEnd
                ? formatDate(data.dateEnd)
                : "Pas de date de fin renseignée"}
            </Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoTextContent}>Commentaire :</Text>
            <Text style={styles.dataTextContent}>
              {data.content
                ? data.content
                : "Pas de commentaire pour le moment!"}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
  },
  imageContainer: {
    width: "100%",
    height: 180,
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 20,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  infosContainer: {
    marginVertical: 30,
  },
  infoContainer: {
    flexDirection: "column",
    borderWidth: 1,
    borderColor: "#663ED9",
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,

    paddingVertical: 15,
    marginVertical: 5,
  },
  infoText: {
    textAlign: "center",
    fontSize: 16,
    color: "#362173",
    marginBottom: 10,
    fontWeight: "600",
  },
  dataText: {
    color: "#663ED9",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
  },
  infoTextContent: {
    textAlign: "left",
    fontSize: 16,
    color: "#362173",
    marginBottom: 10,
    fontWeight: "600",
    paddingLeft: 20,
    paddingRight: 10,
  },
  dataTextContent: {
    color: "#663ED9",
    fontSize: 16,
    textAlign: "left",
    fontWeight: "600",
    paddingLeft: 20,
    paddingRight: 20,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  dataStatus: {
    color: "#663ED9",
    fontSize: 16,
    textAlign: "left",
    fontWeight: "600",
    paddingLeft: 10,
    paddingRight: 20,
  },
});
