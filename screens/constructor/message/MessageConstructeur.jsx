import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons"; // Pour les icônes, assure-toi d'avoir installé react-native-vector-icons
import { useSelector } from "react-redux";
import io from "socket.io-client";
import ReturnButton from "../../../components/ReturnButton";

export default function MessageConstructeur({ navigation, route }) {
  const projectId = route?.params?.projectId;
  const constructeur = useSelector((state) => state.constructeur.value);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [projects, setProjects] = useState([]);
  const socketRef = useRef(null);
  const flatListRef = useRef(null);

  const prodURL = process.env.PROD_URL

  useEffect(() => {
    if (!projectId) {
      console.warn("No projectId provided, redirecting to ClientRoomsScreen");
      navigation.replace("ClientRoomsScreen");
      return;
    }

    console.log("MessageConstructeur mounted with projectId:", projectId);
    // ... rest of your useEffect code ...
    console.log("Connecting to Socket.IO server...");
    socketRef.current = io(prodURL);

    socketRef.current.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    socketRef.current.on("newMessage", (message) => {
      console.log("New message received:", message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      console.log("Disconnecting from Socket.IO server...");
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [projectId, navigation]);

  useEffect(() => {
    if (projectId) {
      console.log(`Fetching messages for projectId: ${projectId}`);
      setMessages([]); // Clear messages when switching projects

      const fetchMessages = async () => {
        try {
          const response = await fetch(
            `${prodURL}/messages/${projectId}`
          );
          const data = await response.json();
          if (data.success) {
            console.log("Fetched messages:", data.messages);
            const formattedMessages = data.messages.map((msg) => ({
              text: msg.content,
              from: msg.sender,
              time: new Date(msg.date).toLocaleTimeString(),
            }));
            setMessages(formattedMessages);
          } else {
            console.error("Error fetching messages:", data.error);
          }
        } catch (error) {
          console.error("Error fetching messages:", error);
          console.log(
            "Fetching messages from:",
            `${prodURL}/messages/${projectId}`
          );
        }
      };

      fetchMessages();
    }
  }, [projectId]);

  useEffect(() => {
    // Récupération (simulée) des projets depuis le backend
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          `${prodURL}/projects/${constructeur.constructorId}`
        );
        const data = await response.json();
        console.log("Fetched projects:", data);
        setProjects(data.projects || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, [constructeur.constructorId]);

  const sendMessage = async () => {
    if (inputValue.trim() && projectId) {
      const newMessage = {
        text: inputValue,
        from: constructeur.constructorName || "constructor",
        time: new Date().toLocaleTimeString(),
        projectId: projectId,
      };

      // Ajouter le message à l'état local immédiatement
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      console.log("Sending message:", newMessage);
      socketRef.current.emit("sendMessage", newMessage);

      try {
        const response = await fetch(
          `${prodURL}/messages/${projectId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sender: constructeur.constructorName || "constructor",
              content: inputValue,
            }),
          }
        );
        const data = await response.json();
        console.log("Message saved to database:", data);
      } catch (error) {
        console.error("Error saving message to database:", error);
      }

      setInputValue(""); // Nettoie le champ
    }
  };

  // Rendu des bulles de message
  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        // Messages envoyés par le constructeur (myMessage) à DROITE
        item.from === constructeur.constructorName
          ? styles.otherMessage
          : styles.myMessage,
      ]}
    >
      <Text
        style={[
          styles.messageText,
          item.from === constructeur.constructorName
            ? styles.otherMessageText
            : styles.myMessageText,
        ]}
      >
        {item.text}
      </Text>
      <Text
        style={[
          styles.messageTime,
          item.from === constructeur.constructorName
            ? { color: "#666" }
            : { color: "#FFF" },
        ]}
      >
        {item.time.slice(0, 5)}
      </Text>
    </View>
  );

  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // Rendu de la liste de projets (toujours présente dans la logique, mais cachée par style)
  const renderProject = ({ item }) => (
    <Button
      title={`Project: ${item.name}`}
      onPress={() => setCurrentProjectId(item._id)}
    />
  );

  // Corrected logic to display the client's name dynamically.
  const clientName = route.params?.clientName || "Client Inconnu";

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView style={styles.container}>
        {/* Barre supérieure type "header" */}
        <View style={styles.header}>
          <ReturnButton
            style={styles.backButton}
            onPress={() =>
              navigation.navigate("MainTabs", { screen: "Message" })
            }
          />

          <View style={styles.userInfo}>
            <Image
              style={styles.profilePicture}
              source={{
                uri: "https://via.placeholder.com/150x150.png?text=Avatar",
              }}
            />
            <Text style={styles.userName}>{clientName}</Text>
          </View>
        </View>

        {/* Liste des projets, masquée par style pour coller au screenshot */}
        <View style={styles.projectList}>
          <Text style={styles.sectionTitle}>Project</Text>
          <FlatList
            data={projects}
            renderItem={renderProject}
            keyExtractor={(item) => item._id}
            horizontal
          />
        </View>

        {/* Liste des messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.messagesList}
        />

        {/* Barre d'envoi de message en bas */}
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.plusButton}
            onPress={() => console.log("Plus icon pressed")}
          >
            <Text style={styles.plusSign}>+</Text>
          </TouchableOpacity>

          <View style={styles.textInputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Envoyer un message..."
              placeholderTextColor="#999"
              value={inputValue}
              onChangeText={setInputValue}
            />
          </View>

          <TouchableOpacity onPress={sendMessage} style={styles.sendIconButton}>
            <Ionicons name="send" size={20} color="#4102F9" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

MessageConstructeur.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  // --- CONTENEURS GÉNÉRAUX ---
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
  },
  backButton: {
    padding: 5,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  profilePicture: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },

  // --- LISTE DES PROJETS (LOGIQUE INTACTE, MAIS MASQUÉ VISUELLEMENT) ---
  projectList: {
    display: "none", // On masque cette partie pour coller au screenshot
    // si tu souhaites la rendre visible un jour, enlève cette ligne
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },

  // --- LISTE DES MESSAGES ---
  messagesList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    // on laisse un espace en bas pour ne pas que le dernier message soit caché
  },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    maxWidth: "70%",
    borderRadius: 12,
  },
  // message du constructeur => GAUCHE en violet
  myMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#663ED9",
  },
  // message de l’autre => DROITE en blanc
  otherMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#F2F2F2",
  },
  messageText: {
    fontSize: 16,
  },
  myMessageText: {
    color: "#FFF", // texte blanc sur fond violet
  },
  otherMessageText: {
    color: "#000", // texte noir sur fond blanc/gris
  },
  messageTime: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    textAlign: "right", // place l'heure à droite dans la bulle
  },
  otherMessageTime: {
    color: "#FFF", // texte blanc sur fond violet
  },

  // --- BARRE D'ENVOI EN BAS ---
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: "#DDD",
    backgroundColor: "#FFF",
  },
  plusButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FE5900",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  plusSign: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  textInputWrapper: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    marginRight: 8,
    justifyContent: "center",
  },
  textInput: {
    paddingHorizontal: 8,
    fontSize: 16,
    color: "#000",
    height: 40, // Increased height for thicker input
  },
  sendIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});
