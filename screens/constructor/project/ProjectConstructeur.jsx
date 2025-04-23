import { useFocusEffect } from "@react-navigation/native";
import * as Location from "expo-location";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  StyleSheet,
  Text,
  View,
  FlatList
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import ClientContainer from "../../../components/ClientContainer";
import PlusButton from "../../../components/PlusButton";
import { LinearGradient } from "expo-linear-gradient";

export default function ProjectConstructeur({ navigation }) {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [clients, setClients] = useState([]);
const prodURL = process.env.PROD_URL;
  const constructeur = useSelector((state) => state.constructeur.value);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission de localisation refusée");
        return;
      }

      Location.watchPositionAsync({ distanceInterval: 10 }, (loc) =>
        setLocation(loc)
      );
    })();
  }, []);

  const devUrl = process.env.DEV_URL;

  useFocusEffect(
    useCallback(() => {
      const constructorId = constructeur.constructorId;
      const token = constructeur.token;
      setLoading(true);
      fetch(`${prodURL}/projects/clients/${constructorId}/${token}`)
        .then((res) => res.json())
        .then((data) => {
          setClients(data.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Erreur lors de la récupération des clients", err);
          setLoading(false);
        });
    }, [constructeur.constructorId])
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
        latitudeDelta: 0.4,
        longitudeDelta: 0.4,
      }
    : defaultRegion;

  const handlePress = () => {
    navigation.navigate("AddProject");
  };

  // Fonction pour ouvrir Google Maps avec itinéraire en voiture
  const openGoogleMaps = (latitude, longitude) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
    Linking.openURL(url).catch((err) =>
      console.error("Erreur lors de l'ouverture de Google Maps", err)
    );
  };

  const handleMarkerPress = (firstname, lastname, latitude, longitude) => {
    Alert.alert(
      `Chantier de ${firstname} ${lastname}`,
      `\nVous souhaitez vous rendre sur ce chantier ?`,
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Oui, go !",
          onPress: () => openGoogleMaps(latitude, longitude),
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <LinearGradient
    colors={["#8E44AD", "#372173"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        locations={[0, 0.1]} // 👈 le foncé commence dès 40% du dégradé
    style={styles.gradientHeader}
  >
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Mes chantiers</Text>
      </View>
  
      <View style={styles.mainContainer}>
        {errorMsg ? (
          <Text style={styles.errorText}>{errorMsg}</Text>
        ) : (
          <View style={styles.mapWrapper}>
  <View style={styles.mapContainer}>
    {loading ? (
      <ActivityIndicator size="large" color="#663ED9" />
    ) : (
      <MapView style={styles.map} region={region}>
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Ma position"
          />
        )}
        {clients?.map(
          (client, index) =>
            client.client?.constructionLat &&
            client.client?.constructionLong && (
              <Marker
                key={client._id || `marker-${index}`}
                coordinate={{
                  latitude: parseFloat(client.client.constructionLat),
                  longitude: parseFloat(client.client.constructionLong),
                }}
                pinColor="purple"
                onPress={() =>
                  handleMarkerPress(
                    client.client.firstname,
                    client.client.lastname,
                    parseFloat(client.client.constructionLat),
                    parseFloat(client.client.constructionLong)
                  )
                }
              />
            )
        )}
      </MapView>
    )}
  </View>
</View>
          )}

            <View style={styles.clientsHeader}>
              <Text style={styles.clientsTitle}>Mes clients</Text>
          </View>
  <FlatList
  data={clients.filter((c) => c.client !== null)}
  keyExtractor={(item) => item._id}
  numColumns={2}
  columnWrapperStyle={styles.clientRow}
  contentContainerStyle={styles.clientList}
  renderItem={({ item, index }) => (
    <View style={styles.cardWrapper}>
      <ClientContainer
        firstname={item.client.firstname}
        lastname={item.client.lastname}
        address={item.client.constructionAdress}
        zip={item.client.constructionZipCode}
        city={item.client.constructionCity}
        profilePicture={item.client.profilePicture}
        style={{ width: 150, height: 180 }}
        onPress={() =>
          navigation.navigate("ClientDetails", {
            data: item,
          })
        }
      />
    </View>
  )}
  
  ListEmptyComponent={
    <View style={styles.clientNotFound}>
      <Text style={styles.clientNotFoundText}>
        Ajoutez votre premier client !
      </Text>
    </View>
  }
/>
<PlusButton
  icon="plus"
  onPress={handlePress}
            style={{
              top: 260,
              left: 330,
              width: 40,
              height: 40,
              borderRadius: 20,
  }}
/>
      </View>
    </SafeAreaView>
  </LinearGradient>
  
  );
}


const styles = StyleSheet.create({
  gradientHeader: {
    flex: 1,
  },
  headerContent: {
    paddingTop: 10,
    paddingBottom: 30,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    paddingTop: 10,
  },
  mapWrapper: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  mapContainer: {
    height: 220,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
  },
  map: {
    width: "100%",
    height: "100%",

  },
  errorText: {
    textAlign: "center",
    color: "red",
    marginTop: 20,
  },
  cardWrapper: {
    width: "47%",
  },
  clientsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 25,
    alignItems: "center",
    marginBottom: 12,
  },
  clientsTitle: {
    marginBottom: 5,
    fontSize: 22,
    fontWeight: "600",
    color: "#000",
  },
  clientRow: {
    justifyContent: "space-between",
    marginBottom: 20,
  },
  
  clientList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  subTitleText: {
    textAlign: "left",
    paddingLeft: 25,
    marginBottom: 7,
  },
  clientNotFound: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
    marginHorizontal: 40,
    padding: 50,
    width: "80%",
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#663ED9",
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  clientNotFoundText: {
    fontSize: 18,
    textAlign: "center",
    color: "#362173",
  },
});
