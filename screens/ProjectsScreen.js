import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import ClientContainer from "../components/ClientContainer";
import PlusButton from "../components/PlusButton";
import globalStyles from "../styles/globalStyles";

export default function ProjectsScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [clients, setClients] = useState([]);
  const [clientLocations, setClientLocations] = useState([]);

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

  useEffect(() => {
    const constructorId = "67c5906967201a0f704367dc";
    fetch(`http://192.168.1.146:4000/projects/clients/${constructorId}`)
      .then((res) => res.json())
      .then((data) => {
        setClients(data.data);
        fetchClientLocations(data.data);
      });
  }, []);

  // fonction qui appel le backend pour récupéré la géolocalisation d'une adresse client
  const fetchClientLocations = (clients) => {
    const locationPromises = clients
      .filter((clientItem) => clientItem.client !== null)
      .map((clientItem) => {
        const address = `${clientItem.client.constructionAdress}, ${clientItem.client.constructionZipCode}, ${clientItem.client.constructionCity}`;

        return fetch("http://192.168.1.146:4000/projects/geocode", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ address }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.result) {
              return {
                id: clientItem._id,
                name: `${clientItem.client.firstname} ${clientItem.client.lastname}`,
                coordinates: data.location,
              };
            }
            return null;
          })
          .catch((error) => {
            console.error(
              "Erreur lors de la récupération de l'adresse :",
              error
            );
            return null;
          });
      });

    // Attendre toutes les promesses
    Promise.all(locationPromises)
      .then((locations) => {
        const validLocations = locations.filter((loc) => loc !== null);
        setClientLocations(validLocations); // Met à jour l'état avec les localisations valides
      })
      .catch((error) =>
        console.error(
          "Erreur lors de la mise à jour des localisations :",
          error
        )
      );
  };

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

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Text style={globalStyles.title}>Mes chantiers</Text>
      {errorMsg ? (
        <Text style={styles.errorText}>{errorMsg}</Text>
      ) : (
        <View style={styles.mapContainer}>
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
            {clientLocations.map((client) => (
              <Marker
                key={client.id}
                coordinate={client.coordinates}
                title={client.name}
                pinColor="purple"
              />
            ))}
          </MapView>
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
                />
              ))
          ) : (
            <Text>Aucun client trouvé !</Text>
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
    paddingTop: 20,
  },
  mapContainer: {
    width: "90%",
    height: 250,
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 40,
    marginBottom: 25,
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
    marginBottom: 15,
  },
  plusButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    zIndex: 10,
  },
});
