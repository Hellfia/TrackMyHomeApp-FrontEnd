import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MessagesScreen() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { id: "1", text: "Bonjour, où en est la construction ?", sender: "user" },
    {
      id: "2",
      text: "Bonjour, nous avons terminé les fondations.",
      sender: "admin",
    },
  ]);

  const handleSend = () => {
    if (message.trim().length > 0) {
      const newMessage = {
        id: Date.now().toString(),
        text: message,
        sender: "user",
      };
      setMessages((prev) => [...prev, newMessage]);
      setMessage("");
    }
  };

  const renderItem = ({ item }) => {
    const isUser = item.sender === "user";
    return (
      <View
        style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.adminBubble,
        ]}
      >
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeContainer} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={80}
      >
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.chatContainer}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Tapez votre message..."
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendText}>Envoyer</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  container: {
    flex: 1,
  },
  chatContainer: {
    padding: 16,
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  userBubble: {
    backgroundColor: "#6C63FF",
    alignSelf: "flex-end",
  },
  adminBubble: {
    backgroundColor: "#E0E0E0",
    alignSelf: "flex-start",
  },
  messageText: {
    color: "#FFF",
  },
  inputContainer: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: "#DDD",
    padding: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "#F7F7F7",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: "#6C63FF",
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  sendText: {
    color: "#FFF",
    fontWeight: "600",
  },
});
