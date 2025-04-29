import PropTypes from "prop-types";
import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import ReturnButton from "../../../components/ReturnButton";

const HEADER_HEIGHT = 56;
const INPUT_HEIGHT = 50;
const H_PADDING = 24;

const MessageBubble = memo(({ text, date, isMe }) => (
  <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
    <Text
      style={[
        styles.bubbleText,
        isMe ? styles.bubbleTextMe : styles.bubbleTextOther,
      ]}
    >
      {" "}
      {text}{" "}
    </Text>
    <Text
      style={[
        styles.bubbleTime,
        isMe ? styles.bubbleTimeMe : styles.bubbleTimeOther,
      ]}
    >
      {" "}
      {date.slice(0, 5)}{" "}
    </Text>
  </View>
));

export default function MessageConstructeur({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const projectId = route?.params?.projectId;
  const clientName = route?.params?.clientName || "Client";
  const constructeurName = useSelector(
    (state) => state.constructeur.value.constructorName
  );
  const prodURL = process.env.PROD_URL;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const socketRef = useRef(null);
  const flatListRef = useRef(null);

  // Track keyboard height
  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", (e) =>
      setKeyboardHeight(e.endCoordinates.height)
    );
    const hide = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardHeight(0)
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  useEffect(() => {
    if (!projectId) navigation.replace("ClientRoomsScreen");
  }, [projectId, navigation]);

  useEffect(() => {
    if (!projectId) return;
    const sock = io(prodURL);
    socketRef.current = sock;
    sock.emit("joinProject", projectId);
    sock.on("newMessage", (msg) => setMessages((prev) => [msg, ...prev]));
    return () => sock.disconnect();
  }, [projectId, prodURL]);

  useEffect(() => {
    if (!projectId) return;
    (async () => {
      try {
        const res = await fetch(`${prodURL}/messages/${projectId}`);
        const { success, messages: msgs } = await res.json();
        if (success) {
          setMessages(
            msgs
              .map((m) => ({
                text: m.content,
                from: m.sender,
                date: new Date(m.date).toLocaleTimeString(),
              }))
              .reverse()
          );
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, [projectId, prodURL]);

  useEffect(() => {
    if (flatListRef.current && messages.length) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  }, [messages]);

  const renderItem = useCallback(
    ({ item }) => {
      const isMe = item.from === constructeurName;
      return <MessageBubble text={item.text} date={item.date} isMe={isMe} />;
    },
    [constructeurName]
  );

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text) return;
    const msg = {
      text,
      from: constructeurName,
      date: new Date().toLocaleTimeString(),
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
      console.error(e);
    }
  }, [input, constructeurName, projectId, prodURL]);

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <LinearGradient
        colors={["#8E44AD", "#372173"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.headerGradient}
      >
        <SafeAreaView style={styles.safeTop} />
        <View style={styles.headerBar}>
          <ReturnButton onPress={() => navigation.goBack()} top={-6} left={0} />
          <View style={styles.headerTitleWrap}>
            <Ionicons name="person" size={24} color="#FFF" />
            <Text style={styles.headerTitle}>{clientName}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* CHAT LIST */}
      <View style={styles.content}>
        <FlatList
          ref={flatListRef}
          data={messages}
          inverted
          keyExtractor={(_, i) => i.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          initialNumToRender={20}
          windowSize={5}
          removeClippedSubviews
          contentContainerStyle={{ padding: H_PADDING, paddingBottom: 0 }}
        />
      </View>

      {/* FOOTER INPUT */}
      <LinearGradient
        colors={["#8E44AD", "#372173"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.footerGradient, { bottom: keyboardHeight }]}
      >
        <View style={[styles.footer, { paddingBottom: insets.bottom || 8 }]}>
          <TextInput
            style={styles.input}
            placeholder="Écris un message..."
            placeholderTextColor="#BA8ECD"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={styles.sendBtn}
            onPress={handleSend}
            disabled={!input.trim()}
          >
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

MessageConstructeur.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object,
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#372173" },
  headerGradient: { width: "100%" },
  safeTop: { backgroundColor: "transparent" },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: H_PADDING,
    paddingVertical: 8,
  },
  headerTitleWrap: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 40,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },

  content: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
  },

  bubble: { marginVertical: 6, padding: 12, borderRadius: 12, maxWidth: "80%" },
  bubbleMe: { alignSelf: "flex-end", backgroundColor: "#6F41B6" },
  bubbleOther: { alignSelf: "flex-start", backgroundColor: "#DACFF5" },
  bubbleText: { fontSize: 16 },
  bubbleTextMe: { color: "#fff" },
  bubbleTextOther: { color: "#000" },
  bubbleTime: { fontSize: 12, marginTop: 4, textAlign: "right" },
  bubbleTimeMe: { color: "rgba(255,255,255,0.7)" },
  bubbleTimeOther: { color: "#666" },

  footerGradient: { position: "absolute", left: 0, right: 0 },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: H_PADDING,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    height: INPUT_HEIGHT,
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  sendBtn: {
    width: INPUT_HEIGHT,
    height: INPUT_HEIGHT,
    borderRadius: INPUT_HEIGHT / 2,
    backgroundColor: "#FE5900",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
});
