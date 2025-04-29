import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import ReturnButton from "../../../components/ReturnButton";
import maison from "../../../assets/maison-test.jpg";

export default function UpdateDetailsClient({ route, navigation }) {
  const insets = useSafeAreaInsets();
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
    <LinearGradient
      colors={["#8E44AD", "#372173"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      locations={[0, 0.1]}
      style={styles.pageContainer}
    >
      {/* Header Gradient */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <ReturnButton onPress={() => navigation.goBack()} left={10} top={53} />
        <Text style={styles.headerTitle}>{data.name}</Text>
      </View>

      {/* White content with rounded corners */}
      <View style={styles.content}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        >
          {data.uri ? (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: data.uri }}
                style={styles.image}
                resizeMode="cover"
                accessibilityLabel="Photo du chantier pour cette étape"
              />
            </View>
          ) : null}

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
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  imageContainer: {
    width: "100%",
    height: 180,
    borderRadius: 20,
    overflow: "hidden",
    marginVertical: 20,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  infosContainer: {
    marginHorizontal: 5,
    marginVertical: 30,
  },
  infoContainer: {
    flexDirection: "column",
    borderRadius: 16,
    backgroundColor: "#fff",
    shadowOffset: { width: 2, height: 4 },
    shadowColor: "#673ED9",
    shadowOpacity: 0.2,
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
    paddingHorizontal: 20,
  },
  dataTextContent: {
    color: "#663ED9",
    fontSize: 16,
    textAlign: "left",
    fontWeight: "600",
    paddingHorizontal: 20,
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
    fontWeight: "600",
    paddingLeft: 10,
  },
});
