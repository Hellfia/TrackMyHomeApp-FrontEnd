import { FontAwesome5 } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Platform
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import * as Calendar from 'expo-calendar';
import { useEffect } from 'react';
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import GradientButton from "../../../components/GradientButton";
import DateTimePicker from "@react-native-community/datetimepicker";
import logo from "../../../assets/logo.png";
import avatar from "../../../assets/avatar.png";
import PlusButton from "../../../components/PlusButton";

const DateTimeModal = ({ visible, onClose, date, onConfirm }) => {
  const [tempDate, setTempDate] = useState(date);

  useEffect(() => {
    setTempDate(date);
  }, [date]);

  if (!visible) return null;

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <DateTimePicker
          value={tempDate}
          mode="datetime"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, selectedDate) => {
            if (selectedDate) setTempDate(selectedDate);
          }}
          style={{ width: "100%", marginBottom: 16 }} // ✅ Ajouté ici
        />
        <GradientButton
  text="Valider"
  onPress={() => {
    onConfirm(tempDate);
    onClose();
  }}
  style={{ width: "100%" }}
/>

        <TouchableOpacity onPress={onClose}>
          <Text style={styles.cancelText}>Annuler</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function DashboardConstructeur({ navigation }) {
  const [newEventDetails, setNewEventDetails] = useState("");
const [newEventLocation, setNewEventLocation] = useState("");
const [newEventStart, setNewEventStart] = useState(new Date());
const [newEventEnd, setNewEventEnd] = useState(new Date(Date.now() + 60 * 60 * 1000));
const [showStartPicker, setShowStartPicker] = useState(false);
const [showEndPicker, setShowEndPicker] = useState(false);

  const [projectsData, setProjectsData] = useState(0);
  const [clientsData, setClientsData] = useState([]);
  const [craftsmenData, setCraftsmenData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const insets = useSafeAreaInsets();
  const prodURL = process.env.PROD_URL;
  const constructeur = useSelector((state) => state.constructeur.value);
  const [events, setEvents] = useState([]);


  const callClient = (phoneNumber) => {
    if (phoneNumber && phoneNumber !== "Non renseigné") {
      Linking.openURL(`tel:${phoneNumber}`);
    } else {
      alert("Numéro de téléphone non renseigné");
    }
  };

  // API calls
  useFocusEffect(
    useCallback(() => {
      fetch(`${prodURL}/constructors/${constructeur.token}`)
        .then((res) => res.json())
        .then((data) => {
          setCraftsmenData(data.data.craftsmen);
          console.log("Craftsmen data:", data.data.craftsmen);
        })
        .catch(console.error);
    }, [constructeur.token])
  );

  useFocusEffect(
    useCallback(() => {
      fetch(`${prodURL}/projects/${constructeur.constructorId}/${constructeur.token}`)
        .then((res) => res.json())
        .then((data) => setProjectsData(data.data?.length || 0))
        .catch(console.error);
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      fetch(`${prodURL}/projects/clients/${constructeur.constructorId}/${constructeur.token}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.result) {
            setClientsData(data.data.map((item, index) => ({
              id: index,
              logo: item.client.profilePicture,
              firstname: item.client.firstname,
              lastname: item.client.lastname,
              phoneNumber: item.client.phoneNumber || "Non renseigné",
            })));
          } else {
            setClientsData([]);
          }
        })
        .catch(console.error);
    }, [constructeur.constructorId])
  );

  const fetchEventsForToday = async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status !== "granted") return;
  
    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
  
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
  
    let allEvents = [];
  
    for (const cal of calendars) {
      if (cal.allowsModifications) {
        const events = await Calendar.getEventsAsync([cal.id], startOfDay, endOfDay);
        allEvents = allEvents.concat(events);
      }
    }
  
    const upcoming = allEvents
      .filter((event) => new Date(event.startDate) > now)
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
      .slice(0, 3);
  
    setEvents(upcoming);
  };
  
  useEffect(() => {
    fetchEventsForToday();
  }, []);
  
  const createCalendarEvent = async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status !== "granted") {
      alert("Permission refusée");
      return;
    }
  
    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    const editableCalendar = calendars.find(cal => cal.allowsModifications);
  
    if (!editableCalendar) {
      alert("Aucun calendrier modifiable trouvé.");
      return;
    }
  
    try {
      await Calendar.createEventAsync(editableCalendar.id, {
        title: newEventTitle || "Nouvelle tâche",
        startDate: newEventStart,
        endDate: newEventEnd,
        location: newEventLocation,
        notes: newEventDetails,
        timeZone: "Europe/Paris",
      });
  
      setModalVisible(false);
      setNewEventTitle("");
      setNewEventDetails("");
      setNewEventLocation("");
      await fetchEventsForToday();
      alert("Événement ajouté !");
    } catch (err) {
      console.error("Erreur création :", err);
      alert("Erreur lors de la création de l'événement.");
    }
  };
  

  
  return (
    
    <LinearGradient
    colors={["#8E44AD", "#372173"]}
    start={{ x: 0, y: 0 }}
    end={{ x: 0, y: 1 }}
    locations={[0, 0.1]}
    style={[styles.pageContainer, { paddingTop: insets.top }]}
    >
     {modalVisible && (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Ajouter une tâche</Text>

        <TextInput
          style={styles.modalInput}
          placeholder="Titre de la tâche"
          placeholderTextColor="#BB8ECE"
          value={newEventTitle}
          onChangeText={setNewEventTitle}
        />

        <TextInput
          style={styles.modalInput}
          placeholder="Détails"
          placeholderTextColor="#BB8ECE"
          value={newEventDetails}
          onChangeText={setNewEventDetails}
        />

        <TextInput
          style={styles.modalInput}
          placeholder="Lieu"
          placeholderTextColor="#BB8ECE"
          value={newEventLocation}
          onChangeText={setNewEventLocation}
          returnKeyType="done"
          onSubmitEditing={Keyboard.dismiss}
        />

        <View style={styles.dateLine}>
          <Text style={styles.dateLabel}>Début</Text>
          <TouchableOpacity
  onPress={() => {
    Keyboard.dismiss();
    setShowStartPicker(true);
  }}
  style={styles.dateBoxRight}
>
            <Text style={styles.dateValue}>
              {newEventStart.toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}{" "}
              {newEventStart.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dateLine}>
          <Text style={styles.dateLabel}>Fin</Text>
          <TouchableOpacity
  onPress={() => {
    Keyboard.dismiss();
    setShowEndPicker(true);
  }}
  style={styles.dateBoxRight}
>

            <Text style={styles.dateValue}>
              {newEventEnd.toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}{" "}
              {newEventEnd.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </TouchableOpacity>
        </View>

        <DateTimeModal
          visible={showStartPicker}
          date={newEventStart}
          onClose={() => setShowStartPicker(false)}
          onConfirm={setNewEventStart}
        />

        <DateTimeModal
          visible={showEndPicker}
          date={newEventEnd}
          onClose={() => setShowEndPicker(false)}
          onConfirm={setNewEventEnd}
        />

        <GradientButton text="Ajouter" onPress={createCalendarEvent} style={{ width: "100%" }} />

        <TouchableOpacity onPress={() => setModalVisible(false)}>
          <Text style={styles.cancelText}>Annuler</Text>
        </TouchableOpacity>
      </View>
    </View>
  </TouchableWithoutFeedback>
)}

    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mon tableau de bord</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.sectionWrapper}>

            {/* Tâches du jour depuis le calendrier */}
            <View style={styles.taskHeader}>
  <Text style={styles.sectionTitle}>Mes tâches</Text>
              <PlusButton
                onPress={() => setModalVisible(true)}
      icon="plus"
      style={{
        bottom: 4,
        left: 300,
        width: 40,
        height: 40,
        borderRadius: 20,
      }}
/>
</View>

<View style={styles.taskContainer}>
  {events.length === 0 ? (
    <Text style={styles.emptyText}>Aucune tâche pour aujourd'hui</Text>
  ) : (
    events.map((event, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => {
          const startDate = new Date(event.startDate);

          if (Platform.OS === "ios") {
            const appleEpoch = new Date("2001-01-01T00:00:00Z").getTime(); // référence Apple
            const targetTimestamp = Math.floor((new Date(event.startDate).getTime() - appleEpoch) / 1000);
            Linking.openURL(`calshow:${targetTimestamp}`);
          } else {
            const isoStart = startDate.toISOString().replace(/[-:]|\.\d{3}/g, "");
            const isoEnd = new Date(event.endDate || startDate.getTime() + 3600000)
              .toISOString()
              .replace(/[-:]|\.\d{3}/g, "");

            Linking.openURL(
              `https://www.google.com/calendar/render?action=TEMPLATE&dates=${isoStart}/${isoEnd}`
            );
          }
        }}
      >
        <LinearGradient
          colors={
            index % 2 === 0
              ? ["#C49DD4", "#8E44AD", "#372173"]
              : ["#F8D5C0", "#fb9b6b", "#f67360"]
          }
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          locations={[0, 0.5, 1]}
          style={styles.taskCard}
        >
          <View style={styles.taskTimeContainer}>
            <FontAwesome5 name="clock" size={14} color="#fff" />
            <Text style={styles.taskTime}>
              {new Date(event.startDate).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
          <Text numberOfLines={1} style={styles.taskText}>
            {event.title}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    ))
  )}
</View>

  
            {/* Clients */}
            <Text style={styles.sectionTitle}>Mes clients</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.clientScroll}
            >
              {clientsData.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyText}>Aucun client</Text>
                </View>
              ) : (
                clientsData.map((client) => (
                  <TouchableOpacity
                    key={client.id}
                    style={styles.clientCard}
                    onPress={() => callClient(client.phoneNumber)}
                  >
                    <Image
                      source={client.logo ? { uri: client.logo } : avatar}
                      style={styles.clientAvatar}
                    />
                    <Text style={styles.clientName} numberOfLines={2}>
                      {client.firstname} {client.lastname}
                    </Text>
                    <View style={styles.iconRow}>
                      <View style={styles.phoneIcon}>
                        <FontAwesome5 name="phone-alt" size={16} color="#f67360" />
                      </View>
                      <View style={styles.pinIcon}>
                        <Image
                          source={require("../../../assets/mappin.png")}
                          style={{ width: 25, height: 25 }}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
  
            {/* Artisans */}
            <Text style={styles.sectionTitle}>Mes artisans</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.clientScroll}
            >
              {craftsmenData.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyText}>Aucun artisan</Text>
                </View>
              ) : (
                craftsmenData.map((craft, index) => (
                  <TouchableOpacity
                    key={craft._id || index}
                    style={styles.artisanCard}
                    onPress={() => callClient(craft.phoneNumber)}
                  >
                    <Image
                      source={require('../../../assets/artisan.png')}
                      style={styles.artisanAvatar}
                      accessibilityLabel="Photo de l'artisan"
                    />
                    <Text style={styles.clientName} numberOfLines={2}>
                      {craft.craftsmanName}
                    </Text>
                    <View style={styles.iconRow}>
                      <View style={styles.phoneIcon}>
                        <FontAwesome5 name="phone-alt" size={16} color="#f67360" />
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
  
            <Text style={{ textAlign: "center", marginTop: 10 }}>-</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 10,
  },
  headerLogo: {
    marginTop: -20,
    shadowColor: "#FFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 7,
    elevation: 2,
    width: 100,
    height: 100,
  },
  headerTitle: {
    marginTop: 10,
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 20,
    paddingBottom: 30,
  },taskHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  taskContainer: {
    marginBottom: 30,
    gap: 5,
  },
  taskCard: {
    backgroundColor: "#663ED9",
    padding: 12,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  taskTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  
  taskTime: {
    color: "#fff",
    fontWeight: "600",
  },
  
  taskText: {
    color: "#fff",
    fontWeight: "500",
    flex: 1,
    marginLeft: 12,
  },
  
  sectionWrapper: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 10,
  },
  card: {
    marginBottom: 30,
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#f6f6f6",
    borderWidth: 1,
    borderColor: "#663ED9",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
  },
  cardSubtitle: {
    fontSize: 15,
    color: "#444",
    textAlign: "center",
  },
  cardHighlight: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FE5900",
    paddingTop: 10,
  },
  clientScroll: {
    paddingVertical: 10,
  },
  clientCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
  
    // 💡 Ombre vers le bas + droite
    shadowColor: "#FE5900",
    shadowOffset: { width: 2, height: 4 }, 
    shadowOpacity: 0.20,
    shadowRadius: 4,
  
    // Android
    elevation: 5, 
  
    marginRight: 12,
    padding: 12,
    alignItems: "center",
    width: 120,
    height: 170,
  },
  artisanCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#673ED9",
    shadowOffset: { width: 2, height: 4 }, 
    shadowOpacity: 0.20,
    shadowRadius: 4,
    elevation: 5, 
    marginRight: 12,
    padding: 12,
    alignItems: "center",
    width: 120,
    height: 170,
  },
  clientAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 6,
  },
  artisanAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    resizeMode: "contain", 
  },
  clientName: {
    fontSize: 14,
    color: "#663ED9",
    fontWeight: "600",
    textAlign: "center",
    minHeight: 36,
    lineHeight: 18,
    marginBottom: 8,
  },
  iconRow: {
    flexDirection: "row",
    gap: 25,
  },
  phoneIcon: {
    backgroundColor: "#F8D5C0",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  pinIcon: {
    backgroundColor: "#DACFF5",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyCard: {
    height: 130,
    width: 200,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#663ED9",
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 2,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99,

  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 20,
    width: "90%", // ✅ Plus large que 80%
    maxWidth: 400, // ✅ Pour éviter trop large sur tablettes
    alignItems: "center",
  },
  modalTitle: {
    color: "#8E44AD",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#663ED9",
    width: "100%",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: "#FE5900",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 8,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cancelText: {
    color: "#FE5900",
  },
  dateLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 12,
  },
  
  dateLabel: {
    fontSize: 14,
    color: "#8E44AD",
    fontWeight: "600",
  },
  
  dateBoxRight: {
    borderWidth: 1,
    borderColor: "#663ED9",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    minWidth: "60%",
    alignItems: "center",
  },
  dateValue: {
    fontSize: 14,
    fontWeight: "semi-bold",
    color: "#8E44AD",
  },
  
});
