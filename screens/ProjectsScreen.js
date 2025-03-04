// import * as Location from "expo-location";
// import React, { useEffect, useState } from "react";
// import { ScrollView, StyleSheet, Text, View } from "react-native";
// import MapView, { Marker } from "react-native-maps";
// import { SafeAreaView } from "react-native-safe-area-context";
// import ClientContainer from "../components/ClientContainer";
// import globalStyles from "../styles/globalStyles";

// export default function ProjectsScreen() {
//   const [location, setLocation] = useState(null);
//   const [errorMsg, setErrorMsg] = useState(null);

//   useEffect(() => {
//     (async () => {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         setErrorMsg("Permission de localisation refusée");
//         return;
//       }

//       Location.watchPositionAsync({ distanceInterval: 10 }, (loc) =>
//         setLocation(loc)
//       );
//     })();
//   }, []);

//   const defaultRegion = {
//     latitude: 46.603354,
//     longitude: 1.888334,
//     latitudeDelta: 10,
//     longitudeDelta: 10,
//   };

//   const region = location
//     ? {
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//         latitudeDelta: 1,
//         longitudeDelta: 1,
//       }
//     : defaultRegion;

//   return (
//     <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
//       <Text style={globalStyles.title}>Mes chantiers</Text>
//       {errorMsg ? (
//         <Text style={styles.errorText}>{errorMsg}</Text>
//       ) : (
//         <View style={styles.mapContainer}>
//           <MapView style={styles.map} region={region}>
//             {location && (
//               <Marker
//                 coordinate={{
//                   latitude: location.coords.latitude,
//                   longitude: location.coords.longitude,
//                 }}
//                 title="Votre position"
//               />
//             )}
//           </MapView>
//         </View>
//       )}
//       <SafeAreaView style={styles.clientsContainer}>
//         <Text style={[globalStyles.subTitle, styles.subTitleText]}>
//           Mes clients
//         </Text>
//         <ScrollView>
//           <ClientContainer />
//           <ClientContainer />
//           <ClientContainer />
//           <ClientContainer />
//           <ClientContainer />
//         </ScrollView>
//       </SafeAreaView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "flex-start",
//     alignItems: "center",
//     paddingTop: 20,
//   },
//   mapContainer: {
//     width: "90%",
//     height: 250,
//     borderRadius: 20,
//     overflow: "hidden",
//     marginVertical: 40,
//   },
//   map: {
//     flex: 1,
//   },
//   errorText: {
//     textAlign: "center",
//     color: "red",
//     marginTop: 20,
//   },
//   clientsContainer: {
//     width: "100%",
//   },
//   subTitleText: {
//     textAlign: "left",
//     paddingLeft: 25,
//     marginBottom: 15,
//   },
// });

import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import ClientContainer from "../components/ClientContainer";
import globalStyles from "../styles/globalStyles";

export default function ProjectsScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

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
                title="Votre position"
              />
            )}
          </MapView>
        </View>
      )}
      <View style={styles.clientsContainer}>
        <Text style={[globalStyles.subTitle, styles.subTitleText]}>
          Mes clients
        </Text>
        <ScrollView>
          <ClientContainer />
          <ClientContainer />
          <ClientContainer />
          <ClientContainer />
          <ClientContainer />
        </ScrollView>
      </View>
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
    paddingBottom: 5,
  },
  subTitleText: {
    textAlign: "left",
    paddingLeft: 25,
    marginBottom: 15,
  },
});
