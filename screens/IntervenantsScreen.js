<<<<<<< HEAD
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
=======
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
  const [craftsman, setCraftsman] = useState([]);

  useEffect(() => {
    const constructorId = "67c72424a42cfad1eaae00bc";
    fetch(`http://192.168.1.146:4000/projects/craftsmen/${constructorId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("dataFecthed", data);
        setCraftsman(data.data);
      });
  }, []);

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.title}>Mes Intervenants</Text>
      </View>
      <View style={styles.clientsContainer}>
        <Text style={[globalStyles.subTitle, styles.subTitleText]}>
          Mes Intervenants
        </Text>
        <ScrollView>
          {craftsman.length > 0 ? (
            craftsman
              .filter((item) => item.craftsman !== null)
              .map((item) => (
                <CraftsmanContainer
                  key={item._id}
                  craftsmanName={item.craftsman.firstname}
                  craftsmanAddress={item.craftsman.constructionAdress}
                  craftsmanZip={item.craftsman.constructionZipCode}
                  craftsmanCity={item.craftsman.constructionCity}
                  craftsmanLogo={item.craftsman.profilePicture}
                />
              ))
          ) : (
            <Text>Aucun craftsman trouvé !</Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
});
