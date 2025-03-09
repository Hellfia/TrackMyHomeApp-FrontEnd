import { useFocusEffect } from "@react-navigation/native";
import * as Location from "expo-location";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import ClientContainer from "../../../components/ClientContainer";
import PlusButton from "../../../components/PlusButton";
import globalStyles from "../../../styles/globalStyles";

export default function ProjectConstructeur({ navigation }) {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [clients, setClients] = useState([]);

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
      setLoading(true);
      fetch(`${devUrl}/projects/clients/${constructorId}`)
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
        latitudeDelta: 0.8,
        longitudeDelta: 0.8,
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
    <SafeAreaView style={styles.container}>
      <Text style={globalStyles.title}>Mes chantiers</Text>
      {errorMsg ? (
        <Text style={styles.errorText}>{errorMsg}</Text>
      ) : (
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
              {clients.map(
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
      )}
      <View style={styles.clientsContainer}>
        <Text style={[globalStyles.subTitle, styles.subTitleText]}>
          Mes clients
        </Text>
        <ScrollView>
          {clients.length > 0 ? (
            clients
              .filter((clientItem) => clientItem.client !== null)
              .map((clientItem) => (
                <ClientContainer
                  key={clientItem._id}
                  firstname={clientItem.client.firstname}
                  lastname={clientItem.client.lastname}
                  address={clientItem.client.constructionAdress}
                  zip={clientItem.client.constructionZipCode}
                  city={clientItem.client.constructionCity}
                  profilePicture={clientItem.client.profilePicture}
                  onPress={() =>
                    navigation.navigate("ClientDetails", {
                      data: clientItem,
                    })
                  }
                />
              ))
          ) : (
            <View style={styles.clientNotFound}>
              <Text>Aucun client trouvé !</Text>
            </View>
          )}
        </ScrollView>
      </View>

      <PlusButton style={styles.plusButton} onPress={handlePress} icon="plus" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  mapContainer: {
    width: "90%",
    height: 250,
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 40,
    marginBottom: 15,
  },
  map: {
    flex: 1,
  },
  errorText: {
    textAlign: "center",
    color: "red",
    marginTop: 20,
  },
  clientsContainer: {
    width: "100%",
    flex: 1,
    marginBottom: 10,
  },
  subTitleText: {
    textAlign: "left",
    paddingLeft: 25,
    marginBottom: 7,
  },
  plusButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    zIndex: 10,
  },
  clientNotFound: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
});
