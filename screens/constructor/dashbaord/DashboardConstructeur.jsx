// DashboardConstructeur.js
import { FontAwesome5 } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useFocusEffect } from "@react-navigation/native";
import * as Calendar from "expo-calendar";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  Keyboard,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import avatar from "../../../assets/avatar.png";
import GradientButton from "../../../components/GradientButton";
import PlusButton from "../../../components/PlusButton";
import { hp, rfs, scale } from "../../../utils/scale";

const DateTimeModal = ({ visible, onClose, date, onConfirm }) => {
  const [tempDate, setTempDate] = useState(date);

  useEffect(() => {
    setTempDate(date);
  }, [date]);

  if (!visible) return null; // Simplifié : ne rend rien si pas visible

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <DateTimePicker
          value={tempDate}
          mode="datetime"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, selectedDate) => {
            if (selectedDate) {
              setTempDate(selectedDate);
            }
            // Fermeture automatique sur Android
            if (Platform.OS === "android") {
              onConfirm(selectedDate || tempDate);
              onClose();
            }
          }}
          style={{ width: "100%", marginBottom: scale(16) }}
        />
        {Platform.OS === "ios" && (
          <>
            <GradientButton
              text="Valider"
              onPress={() => {
                onConfirm(tempDate);
                onClose();
              }}
              style={{ width: "100%" }}
            />
            <TouchableOpacity
              onPress={onClose}
              style={{ marginTop: scale(12) }}
            >
              <Text style={styles.cancelText}>Annuler</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

export default function DashboardConstructeur({ navigation }) {
  const insets = useSafeAreaInsets();
  const prodURL = process.env.PROD_URL;
  const constructeur = useSelector((s) => s.constructeur.value);

  const [events, setEvents] = useState([]);
  const [clientsData, setClientsData] = useState([]);
  const [craftsmenData, setCraftsmenData] = useState([]);
  const [projectsCount, setProjectsCount] = useState(0);

  const [modalVisible, setModalVisible] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDetails, setNewEventDetails] = useState("");
  const [newEventLocation, setNewEventLocation] = useState("");
  const [newEventStart, setNewEventStart] = useState(new Date());
  const [newEventEnd, setNewEventEnd] = useState(
    new Date(Date.now() + 3600000)
  );
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // Lance l'appel téléphonique
  const callClient = (phone) =>
    phone && phone !== "Non renseigné"
      ? Linking.openURL(`tel:${phone}`)
      : alert("Numéro non renseigné");

  // Ouvre Google Maps en mode itinéraire voiture vers la destination
  const openNavigation = (latitude, longitude) => {
    if (!latitude || !longitude) {
      return alert("Coordonnées du chantier non disponibles");
    }
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
    Linking.openURL(url).catch((err) =>
      console.error("Impossible d’ouvrir Google Maps", err)
    );
  };

  // Récupération artisans
  useFocusEffect(
    useCallback(() => {
      fetch(`${prodURL}/constructors/${constructeur.token}`)
        .then((r) => r.json())
        .then((d) => setCraftsmenData(d.data.craftsmen || []))
        .catch(console.error);
    }, [constructeur.token])
  );

  // Récupération clients, on stocke aussi lat/lng
  useFocusEffect(
    useCallback(() => {
      fetch(
        `${prodURL}/projects/clients/${constructeur.constructorId}/${constructeur.token}`
      )
        .then((r) => r.json())
        .then((d) => {
          if (d.result) {
            setClientsData(
              d.data.map((item, i) => ({
                id: i,
                logo: item.client.profilePicture,
                firstname: item.client.firstname,
                lastname: item.client.lastname,
                phoneNumber: item.client.phoneNumber || "Non renseigné",
                latitude: parseFloat(item.client.constructionLat),
                longitude: parseFloat(item.client.constructionLong),
              }))
            );
          } else setClientsData([]);
        })
        .catch(console.error);
    }, [constructeur.constructorId])
  );

  // Fetch tasks today from ALL calendars
  const fetchEventsForToday = async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status !== "granted") {
      console.warn("Permission calendrier non accordée");
      return;
    }
    const calendars = await Calendar.getCalendarsAsync(
      Calendar.EntityTypes.EVENT
    );
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0
    );
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59
    );
    const allIds = calendars.map((c) => c.id);
    const allEvents = await Calendar.getEventsAsync(
      allIds,
      startOfDay,
      endOfDay
    );
    const upcoming = allEvents
      .filter((e) => new Date(e.startDate) > now)
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      )
      .slice(0, 3);
    setEvents(upcoming);
  };

  // run on focus
  useFocusEffect(
    useCallback(() => {
      fetchEventsForToday();
    }, [])
  );

  // create event and re-fetch
  const createCalendarEvent = async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status !== "granted") {
      alert("Permission refusée");
      return;
    }
    const cals = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    const editable = cals.find((c) => c.allowsModifications);
    if (!editable) {
      alert("Aucun calendrier modifiable trouvé.");
      return;
    }
    try {
      await Calendar.createEventAsync(editable.id, {
        title: newEventTitle || "Nouvelle tâche",
        startDate: newEventStart,
        endDate: newEventEnd,
        location: newEventLocation,
        notes: newEventDetails,
        timeZone: "Europe/Paris",
      });
      await fetchEventsForToday();
      setModalVisible(false);
      setNewEventTitle("");
      setNewEventDetails("");
      setNewEventLocation("");
      alert("Événement ajouté !");
    } catch (err) {
      console.error(err);
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
                placeholder="Titre"
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
                  style={styles.dateBoxRight}
                  onPress={() => {
                    Keyboard.dismiss();
                    setShowStartPicker(true);
                  }}
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
                  style={styles.dateBoxRight}
                  onPress={() => {
                    Keyboard.dismiss();
                    setShowEndPicker(true);
                  }}
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
              {/* Picker pour date de début */}
              {Platform.OS === "ios" ? (
                <DateTimeModal
                  visible={showStartPicker}
                  date={newEventStart}
                  onClose={() => setShowStartPicker(false)}
                  onConfirm={setNewEventStart}
                />
              ) : (
                showStartPicker && (
                  <DateTimePicker
                    value={newEventStart}
                    mode="datetime"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowStartPicker(false);
                      if (selectedDate) {
                        setNewEventStart(selectedDate);
                      }
                    }}
                  />
                )
              )}

              {/* Picker pour date de fin */}
              {Platform.OS === "ios" ? (
                <DateTimeModal
                  visible={showEndPicker}
                  date={newEventEnd}
                  onClose={() => setShowEndPicker(false)}
                  onConfirm={setNewEventEnd}
                />
              ) : (
                showEndPicker && (
                  <DateTimePicker
                    value={newEventEnd}
                    mode="datetime"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowEndPicker(false);
                      if (selectedDate) {
                        setNewEventEnd(selectedDate);
                      }
                    }}
                  />
                )
              )}
              <GradientButton
                text="Ajouter"
                onPress={createCalendarEvent}
                style={{ width: "100%", marginTop: scale(10) }}
              />
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{ marginTop: scale(10) }}
              >
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

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.sectionWrapper}
          showsVerticalScrollIndicator={false}
        >
          {/* Tâches */}
          <View style={styles.taskHeader}>
            <Text style={styles.sectionTitle}>Mes tâches</Text>
            <PlusButton
              onPress={() => setModalVisible(true)}
              icon="plus"
              style={{ width: scale(35), height: scale(35) }}
            />
          </View>
          <View style={styles.taskContainer}>
            {events.length === 0 ? (
              <Text style={styles.NoTask}>Aucune tâche pour aujourd'hui</Text>
            ) : (
              events.map((ev, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => {
                    const d = new Date(ev.startDate);
                    if (Platform.OS === "ios") {
                      const appleEpoch = new Date(
                        "2001-01-01T00:00:00Z"
                      ).getTime();
                      const ts = Math.floor((d.getTime() - appleEpoch) / 1000);
                      Linking.openURL(`calshow:${ts}`);
                    } else {
                      const iso = (dt) =>
                        dt.toISOString().replace(/[-:]|\.\d{3}/g, "");
                      Linking.openURL(
                        `https://www.google.com/calendar/render?action=TEMPLATE&dates=${iso(
                          d
                        )}/${iso(
                          new Date(ev.endDate || d.getTime() + 3600000)
                        )}`
                      );
                    }
                  }}
                >
                  <LinearGradient
                    colors={
                      i % 2 === 0
                        ? ["#C49DD4", "#8E44AD", "#372173"]
                        : ["#F8D5C0", "#fb9b6b", "#f67360"]
                    }
                    start={{ x: 1, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    locations={[0, 0.5, 1]}
                    style={styles.taskCard}
                  >
                    <View style={styles.taskTimeContainer}>
                      <FontAwesome5
                        name="clock"
                        size={scale(14)}
                        color="#fff"
                      />
                      <Text style={styles.taskTime}>
                        {new Date(ev.startDate).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                    </View>
                    <Text numberOfLines={1} style={styles.taskText}>
                      {ev.title}
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
              clientsData.map((c) => (
                <View key={c.id} style={styles.clientCard}>
                  <Image
                    source={c.logo ? { uri: c.logo } : avatar}
                    style={styles.clientAvatar}
                  />
                  <Text style={styles.clientName} numberOfLines={2}>
                    {c.firstname} {c.lastname}
                  </Text>
                  <View style={styles.iconRow}>
                    <TouchableOpacity onPress={() => callClient(c.phoneNumber)}>
                      <View style={styles.phoneIcon}>
                        <FontAwesome5
                          name="phone-alt"
                          size={scale(16)}
                          color="#f67360"
                        />
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => openNavigation(c.latitude, c.longitude)}
                    >
                      <View style={styles.pinIcon}>
                        <Image
                          source={require("../../../assets/mappin.png")}
                          style={{ width: scale(25), height: scale(25) }}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
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
              craftsmenData.map((c, i) => (
                <TouchableOpacity
                  key={c._id || i}
                  style={styles.artisanCard}
                  onPress={() => callClient(c.phoneNumber)}
                >
                  <Image
                    source={require("../../../assets/artisan.png")}
                    style={styles.artisanAvatar}
                  />
                  <Text style={styles.clientName} numberOfLines={2}>
                    {c.craftsmanName}
                  </Text>
                  <View style={styles.iconRow}>
                    <View style={styles.phoneIcon}>
                      <FontAwesome5
                        name="phone-alt"
                        size={scale(16)}
                        color="#f67360"
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>

          <Text style={{ textAlign: "center", marginTop: scale(10) }}>-</Text>
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  pageContainer: { flex: 1 },
  header: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: scale(5),
  },
  headerTitle: {
    marginTop: scale(5),
    fontSize: rfs(24),
    color: "#fff",
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: scale(28),
    borderTopRightRadius: scale(28),
    paddingTop: scale(20),
    paddingBottom: scale(30),
  },
  sectionWrapper: {
    paddingHorizontal: scale(10),
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  taskHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: scale(10),
  },
  taskContainer: {
    height: hp(15),
    marginBottom: scale(20),
    gap: scale(5),
    display: "flex",
  },
  taskCard: {
    padding: scale(12),
    borderRadius: scale(12),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: scale(2) },
    shadowOpacity: 0.1,
    shadowRadius: scale(4),
    elevation: scale(3),
  },
  taskTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(6),
  },
  taskTime: {
    color: "#fff",
    fontWeight: "600",
    fontSize: rfs(14),
  },
  taskText: {
    color: "#fff",
    fontWeight: "500",
    flex: 1,
    marginLeft: scale(12),
    fontSize: rfs(14),
  },
  clientScroll: {
    paddingVertical: scale(12),
  },
  clientCard: {
    backgroundColor: "#fff",
    borderRadius: scale(16),
    shadowColor: "#FE5900",
    shadowOffset: { width: scale(2), height: scale(4) },
    shadowOpacity: 0.2,
    shadowRadius: scale(4),
    elevation: scale(5),
    marginRight: scale(12),
    padding: scale(12),
    alignItems: "center",
    width: scale(120),
    height: scale(170),
  },
  artisanCard: {
    backgroundColor: "#fff",
    borderRadius: scale(16),
    shadowColor: "#673ED9",
    shadowOffset: { width: scale(2), height: scale(4) },
    shadowOpacity: 0.2,
    shadowRadius: scale(4),
    elevation: scale(5),
    marginRight: scale(12),
    padding: scale(12),
    alignItems: "center",
    width: scale(120),
    height: scale(170),
  },
  clientAvatar: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
    marginBottom: scale(6),
  },
  artisanAvatar: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
    resizeMode: "contain",
  },
  clientName: {
    fontSize: rfs(14),
    color: "#663ED9",
    fontWeight: "600",
    textAlign: "center",
    minHeight: scale(36),
    lineHeight: scale(18),
    marginBottom: scale(8),
  },
  iconRow: {
    flexDirection: "row",
    gap: scale(25),
  },
  phoneIcon: {
    backgroundColor: "#F8D5C0",
    width: scale(35),
    height: scale(35),
    borderRadius: scale(20),
    justifyContent: "center",
    alignItems: "center",
  },
  pinIcon: {
    backgroundColor: "#DACFF5",
    width: scale(35),
    height: scale(35),
    borderRadius: scale(20),
    justifyContent: "center",
    alignItems: "center",
  },
  emptyCard: {
    height: scale(130),
    width: scale(200),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#663ED9",
    borderRadius: scale(12),
    backgroundColor: "#fff",
    elevation: scale(2),
  },
  NoTask: {
    fontSize: rfs(16),
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: rfs(16),
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
    padding: scale(24),
    borderRadius: scale(20),
    width: "90%",
    maxWidth: scale(400),
    alignItems: "center",
  },
  modalTitle: {
    color: "#8E44AD",
    fontSize: rfs(18),
    fontWeight: "bold",
    marginBottom: scale(12),
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#663ED9",
    width: "100%",
    padding: scale(10),
    borderRadius: scale(8),
    marginBottom: scale(10),
    fontSize: rfs(14),
  },
  cancelText: {
    color: "#FE5900",
    fontSize: rfs(14),
  },
  dateLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: scale(12),
  },
  dateLabel: {
    fontSize: rfs(14),
    color: "#8E44AD",
    fontWeight: "600",
  },
  dateBoxRight: {
    borderWidth: 1,
    borderColor: "#663ED9",
    borderRadius: scale(10),
    paddingVertical: scale(10),
    paddingHorizontal: scale(12),
    minWidth: "60%",
    alignItems: "center",
  },
  dateValue: {
    fontSize: rfs(14),
    fontWeight: "600",
    color: "#8E44AD",
  },
});
