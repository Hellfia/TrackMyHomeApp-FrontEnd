import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
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

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const socketRef = useRef(null);
  const flatListRef = useRef(null);

  const projectId = client.projectId;
  const prodURL = process.env.PROD_URL;

  const myIdentifier =
    client.firstname && client.lastname
      ? `${client.firstname} ${client.lastname}`
      : "User";

  useEffect(() => {
    socketRef.current = io(prodURL);

    socketRef.current.on("connect", () => {
      socketRef.current.emit("joinProject", projectId);
    });

    socketRef.current.on("newMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [prodURL, projectId]);

  useEffect(() => {
    if (projectId) {
      setMessages([]);
      const fetchMessages = async () => {
        try {
          const response = await fetch(`${prodURL}/messages/${projectId}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          if (data.success) {
            const formattedMessages = data.messages.map((msg) => ({
              text: msg.content,
              from: msg.sender,
              date: new Date(msg.date).toLocaleTimeString(),
              projectId: projectId,
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
  }, [prodURL, projectId]);

  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  useFocusEffect(
    React.useCallback(() => {
      if (messages.length > 0) {
        flatListRef.current?.scrollToEnd({ animated: true });
      }
    }, [messages])
  );

  const sendMessage = async () => {
    if (inputValue.trim() && projectId) {
      const newMessage = {
        text: inputValue,
        from: myIdentifier,
        date: new Date().toLocaleTimeString(),
        projectId: projectId,
      };
      socketRef.current.emit("sendMessage", newMessage);

      try {
        await fetch(`${prodURL}/messages/${projectId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sender: myIdentifier,
            content: inputValue,
          }),
        });
      } catch (error) {
        console.error("Error saving message to database:", error);
      }

      setInputValue("");
      Keyboard.dismiss();
    }
  };

  const renderMessage = ({ item }) => {
    const isMyMessage = item.from === myIdentifier;
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
          {item.text}
        </Text>
        <Text
          style={isMyMessage ? styles.messageTime : styles.otherMessageTime}
        >
          {item.date ? item.date.slice(0, 5) : ""}
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
        <View style={[styles.header, globalStyles.header]}>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, globalStyles.title]}>
              {messages.length > 0 && messages[0].from !== myIdentifier
                ? messages[0].from
                : "Interlocuteur inconnu"}
            </Text>
          </View>
        </View>

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
    paddingVertical: 4,
  },
  profilePicture: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  userName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
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
    borderRadius: 12,
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
    color: "#FFF",
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
