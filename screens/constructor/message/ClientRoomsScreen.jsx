// ClientRoomsScreen.js
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const HORIZONTAL_PADDING = 24;

// helper pour formater "time ago"
function getTimeAgo(date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo`;
  const years = Math.floor(months / 12);
  return `${years}y`;
}

export default function ClientRoomsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const constructor = useSelector((state) => state.constructeur.value);
  const prodURL = process.env.PROD_URL;

  const [clientRooms, setClientRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const res = await fetch(
            `${prodURL}/projects/clients/${constructor.constructorId}/${constructor.token}`
          );
          const json = await res.json();
          if (json.result && Array.isArray(json.data)) {
            const rooms = json.data.map((project) => {
              const msgs = project.messages || [];
              const lastMsg = msgs[msgs.length - 1] || {};
              // on parse la date du dernier message
              const date =
                lastMsg.createdAt
                  ? new Date(lastMsg.createdAt)
                  : lastMsg.date
                  ? new Date(lastMsg.date)
                  : null;
              return {
                roomId: project._id,
                client: {
                  name: `${project.client?.firstname || ""} ${
                    project.client?.lastname || ""
                  }`.trim(),
                },
                lastMessage: lastMsg.content || "Pas encore de message.",
                lastMessageDate: date,
              };
            });
            setClientRooms(rooms);
          }
        } catch (e) {
          console.error(e);
        }
      })();
    }, [constructor.constructorId, constructor.token])
  );

  const filteredRooms = clientRooms.filter((room) =>
    room.client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRoomPress = (room) =>
    navigation.navigate("MessageConstructeur", {
      projectId: room.roomId,
      clientName: room.client.name,
    });

  const renderRoom = ({ item }) => {
    const timeAgo = item.lastMessageDate
      ? getTimeAgo(item.lastMessageDate)
      : "";
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => handleRoomPress(item)}
      >
        <View style={styles.avatarCircle}>
          <Icon name="person" size={24} color="#663ED9" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.itemTitle} numberOfLines={1}>
            {item.client.name}
          </Text>
          <Text style={styles.itemSubtitle} numberOfLines={1}>
            {item.lastMessage}
          </Text>
        </View>
        <Text style={styles.timeAgo}>{timeAgo}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <LinearGradient
        colors={["#8E44AD", "#372173"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        locations={[0, 0.1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Messages</Text>
          <View style={styles.searchWrapper}>
            <Icon
              name="search-sharp"
              size={25}
              color="#f67360"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher..."
              placeholderTextColor="#BA8ECD"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Contenu blanc arrondi */}
        <View style={styles.content}>
          <FlatList
            data={filteredRooms}
            keyExtractor={(item) => item.roomId}
            renderItem={renderRoom}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginHorizontal: HORIZONTAL_PADDING,
    alignItems: "center",
    paddingBottom: 12,
    marginTop: -50,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 40,
    width: "100%",
    marginTop: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#362173",
    paddingVertical: 0,
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 12,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 20,
    paddingHorizontal: HORIZONTAL_PADDING,
  },
  list: {
    paddingBottom: 40,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F0EBFA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#663ED9",
  },
  itemSubtitle: {
    fontSize: 14,
    color: "#444",
    marginTop: 4,
  },
  timeAgo: {
    fontSize: 12,
    color: "#999",
    marginLeft: 12,
  },
  separator: {
    height: 1,
    backgroundColor: "#EEE",
    marginVertical: 8,
  },
});
