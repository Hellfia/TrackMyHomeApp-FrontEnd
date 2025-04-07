import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TextInput,
  TouchableOpacity
} from "react-native";

/**
 * Exemple de données simulant une conversation
 * - from: "user" => message violet (à gauche)
 * - from: "other" => message blanc (à droite)
 * - showTime: pour afficher ou non l'heure sous la bulle
 */
const initialMessages = [
  {
    id: "1",
    text: "Bonjour, comment allez-vous ?",
    from: "user",
    showTime: false,
  },
  {
    id: "2",
    text: "J'ai de bonnes nouvelles",
    from: "user",
    showTime: true,
    time: "10:22",
  },
  {
    id: "3",
    text: "Je vais bien, merci !\nDis moi tout ! Je vous écoutes",
    from: "other",
    showTime: true,
    time: "10:22",
  },
];

export default function MessageClient() {
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState("");

  // Rendu individuel d'un message dans la FlatList
  const renderMessage = ({ item }) => {
    const isUser = item.from === "user";
    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userContainer : styles.otherContainer,
        ]}
      >
        {/* Bulle de texte */}
        <View style={[styles.bubble, isUser ? styles.userBubble : styles.otherBubble]}>
          <Text
            style={[
              styles.bubbleText,
              isUser ? styles.userText : styles.otherText,
            ]}
          >
            {item.text}
          </Text>
        </View>

        {/* Heure, si nécessaire */}
        {item.showTime && (
          <Text style={[styles.timeText, isUser ? styles.userTime : styles.otherTime]}>
            {item.time}
          </Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* En-tête avec photo + nom */}
      <View style={styles.header}>
        <Image
          source={{ uri: "https://via.placeholder.com/150" }} // Remplacez par l'URL ou l'image voulue
          style={styles.avatar}
        />
        <Text style={styles.headerTitle}>Luc DUPONT</Text>
      </View>

      {/* Liste des messages */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContainer}
      />

      {/* Barre de saisie en bas */}
      <View style={styles.inputBar}>
        <TouchableOpacity style={styles.plusButton}>
          <Text style={styles.plusButtonText}>+</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.textInput}
          placeholder="Envoyer un message..."
          placeholderTextColor="#999"
          value={inputValue}
          onChangeText={setInputValue}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Conteneur global
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  // En-tête
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
    backgroundColor: "#FFF",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerTitle: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },

  // Liste des messages
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    padding: 16,
  },

  // Conteneur d'un message + heure
  messageContainer: {
    marginBottom: 10,
    maxWidth: "80%",
  },

  // Alignement spécifique
  userContainer: {
    alignSelf: "flex-start",
  },
  otherContainer: {
    alignSelf: "flex-end",
  },

  // Bulle de message
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  userBubble: {
    backgroundColor: "#663ED9",
    borderTopLeftRadius: 2, // coin supérieur gauche plus "carré"
  },
  otherBubble: {
    backgroundColor: "#F2F2F2",
    borderTopRightRadius: 2, // coin supérieur droit plus "carré"
  },
  bubbleText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: "#FFFFFF",
  },
  otherText: {
    color: "#333333",
  },

  // Heure sous la bulle
  timeText: {
    fontSize: 12,
    marginTop: 2,
    color: "#999",
  },
  userTime: {
    textAlign: "left",
  },
  otherTime: {
    textAlign: "right",
  },

  // Barre de saisie en bas
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderTopWidth: 0.5,
    borderTopColor: "#ccc",
    backgroundColor: "#FFF",
  },
  plusButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FF6A00",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  plusButtonText: {
    color: "#FFF",
    fontSize: 24,
    lineHeight: 24,
  },
  textInput: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    borderRadius: 20,
    paddingHorizontal: 12,
    fontSize: 16,
  },
});