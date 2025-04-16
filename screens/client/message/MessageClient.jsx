import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  Keyboard,
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
import globalStyles from "../../../styles/globalStyles";

export default function MessageClient() {
  const client = useSelector((state) => state.client.value);
  const navigation = useNavigation();

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const socketRef = useRef(null);
  const flatListRef = useRef(null);

  // Utilise le projectId fourni par le client ou une valeur par défaut pour les tests
  const projectId = client.projectId || "67f5467ad98577e04aa1779c";
  const prodURL = process.env.PROD_URL;

  // Identifiant du client (prénom+nom si dispo, sinon "user")
  const myIdentifier =
    client.firstname && client.lastname
      ? `${client.firstname} ${client.lastname}`
      : "user";

  // --- Logique Socket.IO inchangée ---
  useEffect(() => {
    console.log("Connecting to Socket.IO server...");
    socketRef.current = io(prodURL);

    socketRef.current.on("connect", () => {
      console.log("Connected to Socket.IO server");
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
  }, []);

  useEffect(() => {
    if (projectId) {
      console.log(`Joining project room: ${projectId}`);
      socketRef.current.emit("joinProject", projectId);
      setMessages([]); // Efface les messages quand on change de projet

      // Récupération des messages existants
      const fetchMessages = async () => {
        try {
          const response = await fetch(`${prodURL}/messages/${projectId}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          if (data.success) {
            const formattedMessages = data.messages.map((msg) => ({
              content: msg.content,
              sender: msg.sender,
              date: new Date(msg.date).toISOString(),
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

      const handleNewMessage = (message) => {
        setMessages((prevMessages) => {
          if (
            !prevMessages.some(
              (m) => m.content === message.content && m.date === message.date
            )
          ) {
            return [...prevMessages, message];
          }
          return prevMessages;
        });
      };

      socketRef.current.on("newMessage", handleNewMessage);

      return () => {
        socketRef.current.off("newMessage", handleNewMessage);
      };
    }
  }, [projectId]);

  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  useFocusEffect(
    React.useCallback(() => {
      if (messages.length > 0) {
        flatListRef.current?.scrollToEnd({ animated: true });
      }
    }, [messages])
  );

  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  }, []);

  const sendMessage = async () => {
    if (inputValue.trim()) {
      const newMessage = {
        content: inputValue,
        sender: myIdentifier,
        date: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, newMessage]);
      socketRef.current.emit("sendMessage", newMessage);

      try {
        const response = await fetch(`${prodURL}/messages/${projectId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newMessage),
        });
        const data = await response.json();
      } catch (error) {
        console.error("Error saving message to database:", error);
      }

      setInputValue("");
      Keyboard.dismiss();
    }
  };

  const renderMessage = ({ item }) => {
    const isMyMessage = item.sender === myIdentifier;
    return (
      <View
        style={[
          styles.messageContainer,
          isMyMessage ? styles.myMessage : styles.otherMessage,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            isMyMessage ? styles.myMessageText : styles.otherMessageText,
          ]}
        >
          {item.content}
        </Text>
        <Text
          style={isMyMessage ? styles.messageTime : styles.otherMessageTime}
        >
          {new Date(item.date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView style={styles.container}>
        {/* Header affichant le nom de l'interlocuteur */}
        <View style={[styles.header, globalStyles.header]}>
          <View style={styles.userInfo}>
            <Image
              style={styles.profilePicture}
              source={{
                uri: "https://via.placeholder.com/150x150.png?text=Avatar",
              }}
            />
            <Text style={[styles.userName, globalStyles.title]}>
              {messages.length > 0 && messages[0].sender !== myIdentifier
                ? messages[0].sender
                : "Interlocuteur inconnu"}
            </Text>
          </View>
        </View>

        {/* Section Projet masquée */}
        <View style={styles.projectList}>
          <Text style={styles.sectionTitle}>Project</Text>
          {/* Liste des projets si besoin */}
        </View>

        {/* Liste des messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.messagesList}
        />

        {/* Barre d'envoi avec icône d'envoi */}
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

// --- Styles modernisés ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingTop: 4,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
  },
  userInfo: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 0,
    paddingVertical: 4,
  },
  userName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },

  projectList: {
    display: "none",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },

  messagesList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  messageContainer: {
    marginVertical: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    maxWidth: "80%",
  },

  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#663ED9",
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomRightRadius: 6,
  },
  myMessageText: {
    color: "#fff",
  },

  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#F2F2F2",
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
  },
  otherMessageText: {
    color: "#000",
  },

  messageTime: {
    fontSize: 13,
    marginTop: 4,
    textAlign: "right",
    color: "rgba(255, 255, 255, 0.75)",
  },

  otherMessageTime: {
    fontSize: 13,
    marginTop: 4,
    textAlign: "right",
    color: "#808080",
  },

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
    backgroundColor: "#FFF",
  },
  textInput: {
    paddingHorizontal: 8,
    fontSize: 16,
    color: "#000",
    height: 40,
  },
  sendIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});
