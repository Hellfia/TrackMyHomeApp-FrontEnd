// Artisans.js
import { FontAwesome5 } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import PlusButton from "../../../components/PlusButton";

export default function Artisans({ navigation }) {
  const insets = useSafeAreaInsets();
  const constructeur = useSelector((state) => state.constructeur.value);
  const [craftsmen, setCraftsmen] = useState([]);

  const prodURL = process.env.PROD_URL;

  const callArtisan = (phoneNumber) => {
    if (phoneNumber && phoneNumber !== "Non renseigné") {
      Linking.openURL(`tel:${phoneNumber}`);
    } else {
      alert("Numéro de téléphone non renseigné");
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetch(`${prodURL}/craftsmen/${constructeur.token}`)
        .then((res) => res.json())
        .then((data) => setCraftsmen(data.data))
        .catch((err) => console.error("Erreur fetch artisans :", err));
    }, [constructeur.token])
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* 3 petits points pour modifier */}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() =>
          navigation.navigate("UpdateCraftsman", { craftsman: item })
        }
      >
        <FontAwesome5 name="ellipsis-h" size={16} color="#000" />
      </TouchableOpacity>

      <View style={styles.cardIconWrapper}>
        <Image
          source={require("../../../assets/artisan.png")}
          style={styles.artisanAvatar}
          accessibilityLabel="Photo de l'artisan"
        />
      </View>

      <Text style={styles.cardTitle} numberOfLines={2}>
        {item.craftsmanName}
      </Text>

      <TouchableOpacity
        style={styles.phoneButton}
        onPress={() => callArtisan(item.phoneNumber)}
      >
        <FontAwesome5 name="phone-alt" size={16} color="#f67360" />
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient
      colors={["#8E44AD", "#372173"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      locations={[0, 0.1]}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mes Artisans</Text>
        </View>

        {/* Contenu principal */}
        <View style={styles.content}>
          <PlusButton
            onPress={() => navigation.navigate("CreateCraftsman")}
            icon="plus"
            style={{
              left: 150,
              width: 40,
              height: 40,
              borderRadius: 20,
            }}
            hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
          />

          <FlatList
            data={craftsmen}
            keyExtractor={(item) => item._id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.list}
            renderItem={renderItem}
            ListEmptyComponent={() => (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>
                  Ajoutez votre premier artisan !
                </Text>
              </View>
            )}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const { width } = Dimensions.get("window");
const HORIZONTAL_PADDING = 24;
const COLUMN_GAP = 16;
const CARD_WIDTH = (width - HORIZONTAL_PADDING * 2 - COLUMN_GAP) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    position: "relative",
  },
  header: {
    height: 40,
    marginHorizontal: HORIZONTAL_PADDING,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 10,
    paddingHorizontal: HORIZONTAL_PADDING,
  },
  list: {
    marginTop: 20,
    paddingBottom: 40,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
    marginRight: 5,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    position: "relative",
    shadowColor: "#673ED9",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  menuButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  cardIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F0EBFA",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#663ED9",
    marginBottom: 4,
    textAlign: "center",
  },
  artisanAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    resizeMode: "contain",
  },
  phoneButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F8D5C0",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  emptyState: {
    marginTop: 50,
    alignSelf: "center",
    padding: 30,
    borderWidth: 1,
    borderColor: "#663ED9",
    borderRadius: 8,
  },
  emptyText: {
    fontSize: 18,
    color: "#362173",
    textAlign: "center",
  },
});
