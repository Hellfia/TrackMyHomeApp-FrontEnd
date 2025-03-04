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

import CraftsmanContainer from "../components/CraftsmanContainer";
import globalStyles from "../styles/globalStyles";
import { useEffect, useState } from "react";
>>>>>>> 2180dd366652eb785b9307035f0280572cee2877
export default function MesIntervenants({ navigation }) {
  const [craftsman, setCraftsman] = useState([]);
  const Craftsman = useSelector((state) => state.Craftsman);

  useEffect(() => {
    const craftsmanId = "67c72424a42cfad1eaae00bc";
    fetch(`http://192.168.1.146:4000/craftsmen/${craftsmanId}`)
      .then((res) => res.json())
      .then((data) => {
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
          {Craftsman.length > 0 ? (
            Craftsman.filter(
              (craftsmanItem) => craftsmanItem.Craftsman !== null
            ).map((craftsmanItem) => (
              <ClientContainer
                key={craftsmanItem._id}
                craftsmanName={craftsmanItem.client.firstname}
                craftsmanAddress={craftsmanItem.client.constructionAdress}
                craftsmanZip={craftsmanItem.client.constructionZipCode}
                craftsmanCity={craftsmanItem.client.constructionCity}
                craftsmanLogo={craftsmanItem.client.profilePicture}
              />
            ))
          ) : (
            <Text>Aucun client trouvé !</Text>
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
