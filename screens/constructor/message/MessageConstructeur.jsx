import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import { LinearGradient } from "expo-linear-gradient";
import ReturnButton from "../../../components/ReturnButton";

const { width } = Dimensions.get("window");
const HEADER_HEIGHT = 56;
const INPUT_HEIGHT = 50;
const HORIZONTAL_PADDING = 24;

export default function MessageConstructeur({ navigation, route }) {
  const insets = useSafeAreaInsets();
  // Add defensive checks for route and route.params
  const projectId = route?.params?.projectId;
  const clientName = route?.params?.clientName || "Client";
  const constructeur = useSelector((state) => state.constructeur.value);
  const prodURL = process.env.PROD_URL;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socket = useRef();
  const flatListRef = useRef();

  // Check if projectId exists early and redirect if needed
  useEffect(() => {
    if (!projectId) {
      // Use a timeout to avoid navigation during render
      setTimeout(() => {
        navigation.replace("ClientRoomsScreen");
      }, 0);
      return;
    }
  }, []);

  // Socket initialization - only if projectId exists
  useEffect(() => {
    if (!projectId) return;
    
    try {
      socket.current = io(prodURL);
      socket.current.emit("joinProject", projectId);
      socket.current.on("newMessage", (msg) => setMessages((prev) => [...prev, msg]));
      
      return () => {
        if (socket.current) {
          socket.current.disconnect();
        }
      };
    } catch (e) {
      console.error("Socket connection error:", e);
    }
  }, [projectId]);

  // Load history - only if projectId exists
  useEffect(() => {
    if (!projectId) return;
    
    (async () => {
      try {
        const res = await fetch(`${prodURL}/messages/${projectId}`);
        const json = await res.json();
        if (json.success) {
          const formatted = json.messages.map((m) => ({
            text: m.content,
            from: m.sender,
            date: new Date(m.date).toLocaleTimeString(),
          }));
          setMessages(formatted);
          setTimeout(() => {
            if (flatListRef.current) {
              flatListRef.current.scrollToEnd({ animated: false });
            }
          }, 100);
        }
      } catch (e) {
        console.error("Error fetching messages:", e);
      }
    })();
  }, [projectId]);

  // Auto-scroll on new messages or keyboard
  useEffect(() => {
    if (messages.length && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
    
    const show = Keyboard.addListener("keyboardDidShow", () => {
      setTimeout(() => {
        if (flatListRef.current) {
          flatListRef.current.scrollToEnd({ animated: true });
        }
      }, 100);
    });
    
    return () => show.remove();
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !projectId || !socket.current) return;
    
    const msg = { 
      text, 
      from: constructeur?.constructorName || "Utilisateur", 
      date: new Date().toLocaleTimeString(), 
      projectId 
    };
    
    try {
      socket.current.emit("sendMessage", msg);
      setMessages((prev) => [...prev, msg]);
      setInput("");
      
      await fetch(`${prodURL}/messages/${projectId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender: msg.from, content: msg.text, date: msg.date }),
      });
    } catch (e) {
      console.error("Error sending message:", e);
    }
  };

  const renderMessage = ({ item }) => {
    const isMe = item.from === constructeur?.constructorName;
    return (
      <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>  
        <Text style={[styles.bubbleText, isMe ? styles.bubbleTextMe : styles.bubbleTextOther]}>{item.text}</Text>
        <Text style={[styles.bubbleTime, isMe ? styles.bubbleTimeMe : styles.bubbleTimeOther]}>
          {item.date.slice(0,5)}
        </Text>
      </View>
    );
  };

  // If no projectId, render a minimal loading state
  if (!projectId) {
    return (
      <LinearGradient
        colors={["#8E44AD", "#372173"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.container, styles.centerContent]}
      >
        <Text style={styles.loadingText}>Chargement...</Text>
      </LinearGradient>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#8E44AD", "#372173"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.safeTopArea} style={{ height: insets.top }} />
                
        <View style={styles.header}>
          <View style={styles.headerInner}>
            <ReturnButton onPress={() => navigation.goBack()} />
            <View style={styles.headerCenter}>
              <Ionicons name="person" size={24} color="#FFF" />
              <Text style={styles.headerText}>{clientName}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        {/* CHAT */}
        <View style={styles.content}>  
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(_, i) => i.toString()}
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
        </View>

        {/* FOOTER INPUT */}
        <LinearGradient
          colors={["#372173", "#8E44AD"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.footerGradient}
        >
          <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 10) }]}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Écris un message..."
                placeholderTextColor="#BA8ECD"
                value={input}
                onChangeText={setInput}
                multiline
                textAlignVertical="center"
              />
            </View>
            <TouchableOpacity 
              style={styles.sendButton} 
              onPress={handleSend}
              disabled={!input.trim()}
            >
              <Ionicons name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </KeyboardAvoidingView>
    </View>
  );
}

MessageConstructeur.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object, // Made optional to avoid crashes
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
  },
  headerGradient: {
    width: '100%',
  },
  footerGradient: {
    width: '100%',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  safeTopArea: {
    backgroundColor: 'transparent',
  },
  header: {
    paddingTop: 8,
    paddingBottom: 12,
    minHeight: HEADER_HEIGHT,
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: HORIZONTAL_PADDING,
  },
  headerCenter: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    marginLeft: -20, // Compense la largeur du bouton de retour pour un vrai centrage
  },
  headerText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: '600', 
    marginLeft: 8 
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
  },
  messagesList: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingVertical: 16,
  },
  bubble: { 
    marginVertical: 6, 
    padding: 10, 
    borderRadius: 12, 
    maxWidth: '75%' 
  },
  bubbleMe: { 
    alignSelf: 'flex-end', 
    backgroundColor: '#6F41B6' 
  },
  bubbleOther: { 
    alignSelf: 'flex-start', 
    backgroundColor: '#DACFF5' 
  },
  bubbleText: { 
    fontSize: 16 
  },
  bubbleTextMe: { 
    color: '#fff' 
  },
  bubbleTextOther: { 
    color: '#000' 
  },
  bubbleTime: { 
    fontSize: 12, 
    marginTop: 4, 
    textAlign: 'right'
  },
  bubbleTimeMe: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  bubbleTimeOther: {
    color: '#666',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 10,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    height: INPUT_HEIGHT - 8,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  input: { 
    fontSize: 16, 
    color: '#000', 
    padding: 0, 
    flex: 1 
  },
  sendButton: {
    marginLeft: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FE5900',
    justifyContent: 'center',
    alignItems: 'center',
  },
});