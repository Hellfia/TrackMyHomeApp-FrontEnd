import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  StyleSheet,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import ReturnButton from "../../../components/ReturnButton";

const MessageBubble = memo(({ message, isOwn }) => (
  <View style={[styles.bubble, isOwn ? styles.bubbleRight : styles.bubbleLeft]}>
    <Text
      style={[styles.bubbleText, isOwn ? styles.textRight : styles.textLeft]}
    >
      {message.text}
    </Text>
    <Text
      style={[styles.bubbleTime, isOwn ? styles.timeRight : styles.timeLeft]}
    >
      {new Date(message.date).toLocaleTimeString()}
    </Text>
  </View>
));

MessageBubble.propTypes = {
  message: PropTypes.object.isRequired,
  isOwn: PropTypes.bool.isRequired,
};

export default function MessageClient({ navigation }) {
  const client = useSelector((state) => state.client.value);
  const projectId = client.projectId;
  const prodURL = process.env.PROD_URL;

  const [interlocutorName, setInterlocutorName] = useState("Messagerie");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const flatListRef = useRef(null);
  const socketRef = useRef(null);

  const currentUser =
    client.firstname && client.lastname
      ? `${client.firstname} ${client.lastname}`
      : "Vous";

  useEffect(() => {
    const clientId = client._id || client.id || client.clientId;
    const token = client.token;
    if (!clientId || !token) return;
    let active = true;
    (async () => {
      try {
        const res = await fetch(
          `${prodURL}/projects/chantier/${clientId}/${token}`
        );
        const json = await res.json();
        if (active && json.result && json.data?.constructeur) {
          const ctor = json.data.constructeur;
          const name =
            ctor.constructorName ||
            `${ctor.firstname ?? ""} ${ctor.lastname ?? ""}`.trim() ||
            ctor.name ||
            "Messagerie";
          setInterlocutorName(name);
        }
      } catch (e) {
        console.error("Erreur fetch constructeur:", e);
      }
    })();
    return () => {
      active = false;
    };
  }, [client, prodURL]);

  useEffect(() => {
    if (!projectId) return;
    let active = true;
    (async () => {
      try {
        const res = await fetch(`${prodURL}/messages/${projectId}`);
        const json = await res.json();
        if (active && json.success) {
          const hist = json.messages.map((m) => ({
            text: m.content,
            date: m.date,
            sender: m.sender,
            id: m._id || m.id,
          }));
          setMessages(hist.reverse());
        }
      } catch (e) {
        console.error("Erreur fetch messages:", e);
      }
    })();
    return () => {
      active = false;
    };
  }, [projectId, prodURL]);

  useEffect(() => {
    if (!projectId) return;
    const sock = io(prodURL);
    socketRef.current = sock;
    sock.emit("joinProject", projectId);
    sock.on("newMessage", (msg) => {
      const incoming = {
        text: msg.text,
        date: msg.date,
        sender: msg.from,
        id: msg.id || Date.now().toString(),
      };
      setMessages((prev) => [incoming, ...prev]);
    });
    return () => sock.disconnect();
  }, [projectId, prodURL]);

  useEffect(() => {
    if (flatListRef.current && messages.length) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  }, [messages]);

  const renderItem = useCallback(
    ({ item }) => (
      <MessageBubble message={item} isOwn={item.sender === currentUser} />
    ),
    [currentUser]
  );

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text) return;

    const msg = {
      text,
      from: currentUser,
      date: new Date().toISOString(),
      projectId,
    };

    socketRef.current.emit("sendMessage", msg);
    setInput("");
    Keyboard.dismiss();

    try {
      await fetch(`${prodURL}/messages/${projectId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: msg.from,
          content: msg.text,
          date: msg.date,
        }),
      });
    } catch (e) {
      console.error("Erreur POST message:", e);
    }
  }, [input, currentUser, projectId, prodURL]);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      <LinearGradient
        colors={["#8E44AD", "#372173"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        locations={[0, 0.3]}
        style={styles.header}
      >
        <ReturnButton onPress={() => navigation.goBack()} top={40} />
        <Text style={styles.headerTitle}>{interlocutorName}</Text>
      </LinearGradient>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.contentContainer}>
          <FlatList
            ref={flatListRef}
            data={messages}
            inverted
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
          />

          <LinearGradient
            colors={["#8E44AD", "#372173"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            locations={[0, 0.4]}
            style={styles.footer}
          >
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={input}
                onChangeText={setInput}
                placeholder="Écris un message..."
                placeholderTextColor="#DDD"
                multiline
              />
            </View>
            <TouchableOpacity
              onPress={sendMessage}
              style={styles.sendBtn}
              disabled={!input.trim()}
            >
              <Text style={styles.sendText}>Envoyer</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

MessageClient.propTypes = {
  navigation: PropTypes.shape({ goBack: PropTypes.func.isRequired }).isRequired,
};

const RADIUS = 28;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  header: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 60,
    paddingHorizontal: 16,
    paddingVertical: 35,
    alignItems: "center",
  },
  headerTitle: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  flex: { flex: 1 },
  contentContainer: {
    flex: 1,
    backgroundColor: "#FFF",
    marginTop: -RADIUS,
    borderTopLeftRadius: RADIUS,
    borderTopRightRadius: RADIUS,
    overflow: "hidden",
  },
  listContent: { paddingHorizontal: 16, paddingBottom: 0 },
  bubble: { marginVertical: 4, padding: 10, borderRadius: 16, maxWidth: "80%" },
  bubbleLeft: { alignSelf: "flex-start", backgroundColor: "#DACFF5" },
  bubbleRight: { alignSelf: "flex-end", backgroundColor: "#6F41B6" },
  bubbleText: { fontSize: 16 },
  textLeft: { color: "#000" },
  textRight: { color: "#FFF" },
  bubbleTime: { fontSize: 12, marginTop: 4, textAlign: "right" },
  timeLeft: { color: "#000" },
  timeRight: { color: "#FFF" },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  input: { fontSize: 16, maxHeight: 100 },
  sendBtn: { marginLeft: 8, padding: 10 },
  sendText: { color: "#FFF", fontWeight: "600" },
});
