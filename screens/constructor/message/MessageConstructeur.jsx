import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
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

  const prodURL = process.env.PROD_URL;

  useEffect(() => {
    if (!projectId) {
      console.warn("No projectId provided, redirecting to ClientRoomsScreen");
      navigation.replace("ClientRoomsScreen");
      return;
    }

    socketRef.current = io(prodURL);

    socketRef.current.on("connect", () => {
      console.log("Connected to Socket.IO server");
      // Ajout de l'émission pour rejoindre la room du projet
      socketRef.current.emit("joinProject", projectId);
      console.log(`Joined project room: ${projectId}`);
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
      setMessages([]);

      const fetchMessages = async () => {
        try {
          const response = await fetch(`${prodURL}/messages/${projectId}`);
          const data = await response.json();
          if (data.success) {
            const formattedMessages = data.messages.map((msg) => ({
              text: msg.content,
              from: msg.sender,
              date: new Date(msg.date).toLocaleTimeString(),
            }));
            setMessages(formattedMessages);
          } else {
            console.error("Error fetching messages:", data.error);
          }
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };

      fetchMessages();
    }
  }, [projectId]);

  const sendMessage = async () => {
    if (inputValue.trim() && projectId) {
      const newMessage = {
        text: inputValue,
        from: constructeur.constructorName,
        date: new Date().toLocaleTimeString(),
        projectId: projectId,
      };

      socketRef.current.emit("sendMessage", newMessage);

      try {
        await fetch(`${prodURL}/messages/${projectId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sender: constructeur.constructorName,
            content: inputValue,
            date: new Date().toLocaleTimeString(),
          }),
        });
      } catch (error) {
        console.error("Error saving message to database:", error);
      }

      setInputValue("");
    }
  };

  // Rendu des bulles de message
  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
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
        {item.date ? item.date.slice(0, 5) : ""}
      </Text>
    </View>
  );

  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const clientName = route.params?.clientName;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView style={styles.container}>
        {/* Barre supérieure type "header" */}
        <View style={styles.header}>
          <View style={styles.backButton}>
            <ReturnButton
              onPress={() =>
                navigation.navigate("MainTabs", { screen: "Message" })
              }
            />
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>{clientName}</Text>
          </View>
        </View>

        {/* Liste des messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: false })
          }
        />

        {/* Barre d'envoi de message en bas */}
        <View style={styles.inputContainer}>
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
            <Ionicons name="send" size={20} color="#362173" />
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
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
  },

  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    textAlign: "center",
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
    textAlign: "center",
    marginBottom: 10,
    flex: 1,
  },

  // --- LISTE DES PROJETS (LOGIQUE INTACTE, MAIS MASQUÉ VISUELLEMENT) ---
  projectList: {
    display: "none",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  backButton: {
    position: "absolute",
    top: 0,
    left: 15,
  },

  messagesList: {
    paddingHorizontal: 25,
    paddingBottom: 16,
  },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    maxWidth: "70%",
    borderRadius: 12,
  },
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
