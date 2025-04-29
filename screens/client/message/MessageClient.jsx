import React, { useEffect, useRef, useState } from "react";
import {
  View,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

const HEADER_HEIGHT = 60;

export default function MessageClient() {
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  const client = useSelector((state) => state.client.value);
  const projectId = client.projectId;
  const prodURL = process.env.PROD_URL;

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const socketRef = useRef(null);
  const flatListRef = useRef(null);

  const myIdentifier =
    client.firstname && client.lastname
      ? `${client.firstname} ${client.lastname}`
      : "Interlocuteur inconnu";

  // Socket connection & incoming messages
  useEffect(() => {
    if (!projectId) return;
    const socket = io(prodURL);
    socketRef.current = socket;
    socket.emit("joinProject", projectId);

    const onMessage = (msg) => setMessages((prev) => [...prev, msg]);
    socket.on("newMessage", onMessage);

    return () => {
      socket.off("newMessage", onMessage);
      socket.disconnect();
    };
  }, [projectId, prodURL]);

  // Load chat history once
  useEffect(() => {
    if (!projectId) return;
    let active = true;
    (async () => {
      try {
        const res = await fetch(`${prodURL}/messages/${projectId}`);
        const json = await res.json();
        if (active && json.success) {
          const formatted = json.messages.map((m) => ({
            text: m.content,
            from: m.sender,
            date: new Date(m.date).toLocaleTimeString(),
          }));
          setMessages(formatted);
        }
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      active = false;
    };
  }, [projectId, prodURL]);

  // Auto-scroll on new message or keyboard open
  useEffect(() => {
    const scrollToEnd = () =>
      flatListRef.current?.scrollToEnd({ animated: false });
    if (messages.length) scrollToEnd();

    const sub = Keyboard.addListener("keyboardDidShow", scrollToEnd);
    return () => sub.remove();
  }, [messages]);

  // Send message: emit only, no local setMessages to avoid echo
  const sendMessage = async () => {
    const text = inputValue.trim();
    if (!text || !projectId) return;

    const msg = {
      text,
      from: myIdentifier,
      date: new Date().toLocaleTimeString(),
      projectId,
    };

    socketRef.current.emit("sendMessage", msg);
    setInputValue("");
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
      console.error(e);
    }
  };

  const renderMessage = ({ item }) => {
    const isMe = item.from === myIdentifier;
    return (
      <View
        style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}
      >
        <Text
          style={[
            styles.bubbleText,
            isMe ? styles.bubbleTextMe : styles.bubbleTextOther,
          ]}
        >
          {item.text}
        </Text>
        <Text style={isMe ? styles.bubbleTimeMe : styles.bubbleTimeOther}>
          {item.date.slice(0, 5)}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#8E44AD", "#372173"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        locations={[0, 0.1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={[styles.header, { marginTop: insets.top }]}>
        <Text style={styles.headerTitle}>
          {client.constructorName || myIdentifier}
        </Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(_, i) => i.toString()}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          // Ces deux props permettent de scroll initialement tout en bas
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: false })
          }
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />

        {/* Input Area */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={tabBarHeight}
          style={styles.footerWrapper}
        >
          <LinearGradient
            colors={["#8E44AD", "#372173"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            locations={[0, 0.4]}
            style={styles.footerGradient}
          >
            <View style={[styles.footer, { marginBottom: tabBarHeight }]}>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Écris un message..."
                  placeholderTextColor="#BA8ECD"
                  value={inputValue}
                  onChangeText={setInputValue}
                  multiline
                  textAlignVertical="center"
                />
              </View>
              <TouchableOpacity
                style={styles.sendButton}
                onPress={sendMessage}
                disabled={!inputValue.trim()}
              >
                <Ionicons name="send" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
    marginTop: 5,
  },
  messagesList: {
    padding: 16,
  },
  bubble: {
    marginVertical: 6,
    padding: 12,
    borderRadius: 12,
    maxWidth: "80%",
  },
  bubbleMe: {
    alignSelf: "flex-end",
    backgroundColor: "#663ED9",
  },
  bubbleOther: {
    alignSelf: "flex-start",
    backgroundColor: "#F2F2F2",
  },
  bubbleText: {
    fontSize: 16,
  },
  bubbleTextMe: {
    color: "#fff",
  },
  bubbleTextOther: {
    color: "#000",
  },
  bubbleTimeMe: {
    fontSize: 12,
    marginTop: 4,
    textAlign: "right",
    color: "rgba(255,255,255,0.7)",
  },
  bubbleTimeOther: {
    fontSize: 12,
    marginTop: 4,
    textAlign: "right",
    color: "#666",
  },
  footerWrapper: {
    backgroundColor: "#fff",
  },
  footerGradient: {
    width: "100%",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderTopWidth: 1,
    borderColor: "#DDD",
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 20,
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  input: {
    fontSize: 16,
    color: "#000",
    padding: 0,
    flex: 1,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
    backgroundColor: "#FE5900",
    alignItems: "center",
    justifyContent: "center",
  },
});
