import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import Icon from "react-native-vector-icons/Ionicons"; // Assurez-vous que react-native-vector-icons est installé

// Moved the separator component outside the parent component.
const Separator = () => <View style={styles.separator} />;

export default function ClientRoomsScreen() {
  const [clientRooms, setClientRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();
  const constructor = useSelector((state) => state.constructeur.value);

  // Add detailed logging to verify data fetching and navigation.
  useEffect(() => {
    console.log("Fetching client rooms for constructor ID:", constructor.constructorId);
    console.log("Using token:", constructor.token);

    const fetchClientRooms = async () => {
      try {
        const response = await fetch(
          `https://track-my-home-backend.vercel.app/projects/clients/${constructor.constructorId}/${constructor.token}`
        );
        const data = await response.json();
        console.log("API response:", data);

        if (data.result && Array.isArray(data.data)) {
          const rooms = data.data.map((project) => {
            console.log("Processing project:", project);
            return {
              roomId: project._id,
              client: { name: `${project.client?.firstname || "Unknown"} ${project.client?.lastname || "Client"}` },
              lastMessage: project.messages?.[project.messages.length - 1]?.content || "No messages yet",
            };
          });
          console.log("Mapped rooms:", rooms);
          setClientRooms(rooms);
        } else {
          console.error("Invalid API response structure:", data);
        }
      } catch (error) {
        console.error("Error fetching client rooms:", error);
      }
    };

    fetchClientRooms();
  }, [constructor.constructorId, constructor.token]);

  const handleRoomPress = (room) => {
    console.log("Selected room:", room);
    if (room && room.roomId) {
      console.log("Navigating to MessageConstructeur with projectId:", room.roomId);
      navigation.navigate("MessageConstructeur", {
        projectId: room.roomId,
        clientName: room.client.name,
        screen: "MessageConstructeur"
      });
    } else {
      console.error("Error: Invalid room data", room);
    }
  };

  // Updated the renderRoom function to pass the entire room object to handleRoomPress.
  const renderRoom = ({ item }) => (
    <TouchableOpacity style={styles.roomContainer} onPress={() => handleRoomPress(item)}>
      <Text style={styles.roomName}>{item.client.name}</Text>
      <Text style={styles.roomDetails}>Last message: {item.lastMessage}</Text>
    </TouchableOpacity>
  );

  // Filtrage des rooms par nom du client
  const filteredRooms = clientRooms.filter((room) =>
    room.client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header centré dans une zone de largeur réduite */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Client Rooms</Text>
        <View style={styles.searchContainer}>
          <Icon name="search-outline" size={20} color="#FE5900" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      {/* FlatList occupe toute la largeur de l'écran */}
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
    backgroundColor: "#F9F9F9",
    paddingTop: 20,
  },
  // Le header est centré dans une zone de largeur "90%"
  headerContainer: {
    width: "90%",
    alignSelf: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#4102F9",
    marginBottom: 10,
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#FE5900",
    borderRadius: 20,
    paddingHorizontal: 10,
    height: 40,
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
  // La FlatList occupe toute la largeur
  flatList: {
    width: "100%",
  },
  listContainer: {
    paddingBottom: 16,
  },
  roomContainer: {
    backgroundColor: "#FFF",
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#4102F9",
  },
  roomName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4102F9",
  },
  roomDetails: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  separator: {
    height: 1,
    backgroundColor: "#EEE",
  },
});
