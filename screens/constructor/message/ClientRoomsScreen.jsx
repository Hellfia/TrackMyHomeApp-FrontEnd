import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";

const Separator = () => <View style={styles.separator} />;

export default function ClientRoomsScreen() {
  const [clientRooms, setClientRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();

  const constructor = useSelector((state) => state.constructeur.value);

  const prodURL = process.env.PROD_URL;

  useFocusEffect(
    useCallback(() => {
      const fetchClientRooms = async () => {
        try {
          const response = await fetch(
            `${prodURL}/projects/clients/${constructor.constructorId}/${constructor.token}`
          );
          const data = await response.json();

          if (data.result && Array.isArray(data.data)) {
            const rooms = data.data.map((project) => {
              return {
                roomId: project._id,
                client: {
                  name: `${project.client?.firstname || "Unknown"} ${
                    project.client?.lastname || "Client"
                  }`,
                },
                lastMessage:
                  project.messages?.[project.messages.length - 1]?.content ||
                  "Commencez une conversation avec votre client.",
              };
            });
            setClientRooms(rooms);
          } else {
            console.error("Invalid API response structure:", data);
          }
        } catch (error) {
          console.error("Error fetching client rooms:", error);
        }
      };

      fetchClientRooms();
    }, [constructor.constructorId, constructor.token])
  );

  const handleRoomPress = (room) => {
    if (room && room.roomId) {
      navigation.navigate("MessageConstructeur", {
        projectId: room.roomId,
        clientName: room.client.name,
        screen: "MessageConstructeur",
      });
    } else {
      console.error("Error: Invalid room data", room);
    }
  };

  const renderRoom = ({ item }) => (
    <TouchableOpacity
      style={styles.roomContainer}
      onPress={() => handleRoomPress(item)}
    >
      <Text style={styles.roomName}>{item.client.name}</Text>
      <Text style={styles.roomDetails}>{item.lastMessage}</Text>
    </TouchableOpacity>
  );

  // Filtrage des rooms par nom du client
  const filteredRooms = clientRooms.filter((room) =>
    room.client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Client Rooms</Text>
        <View style={styles.searchContainer}>
          <Icon
            name="search-outline"
            size={20}
            color="#FE5900"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      <FlatList
        data={filteredRooms}
        renderItem={renderRoom}
        keyExtractor={(item) => item.roomId}
        style={styles.flatList}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={Separator}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    width: "90%",
    alignSelf: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    color: "#362173",
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 10,
    paddingHorizontal: 40,
    paddingVertical: 15,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderWidth: 2,
    borderColor: "#FE5900",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 50,
    width: "100%",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: 0,
  },
  flatList: {
    width: "100%",
  },
  listContainer: {
    paddingBottom: 16,
  },
  roomContainer: {
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#362173",
    marginVertical: 2,
    height: 110,
  },
  roomName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#362173",
  },
  roomDetails: {
    fontSize: 16,
    color: "#2D3747",
    marginTop: 4,
  },
  separator: {
    height: 1,
    backgroundColor: "#EEE",
  },
});
