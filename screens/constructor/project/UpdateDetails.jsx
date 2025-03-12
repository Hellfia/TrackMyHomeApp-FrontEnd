import { FontAwesome5 } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import Joi from "joi"; // Import de Joi
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import GradientButton from "../../../components/GradientButton";
import InputFiles from "../../../components/InputFiles";
import ReturnButton from "../../../components/ReturnButton";
import globalStyles from "../../../styles/globalStyles";

export default function UpdateDetails({ route, navigation }) {
  const { data, step } = route.params;

  const [status, setStatus] = useState(step.status || "");
  const [isModalVisible, setModalVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [dateEnd, setDateEnd] = useState(new Date());
  const [content, setContent] = useState("");

  const [errors, setErrors] = useState({});
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }
    );

    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  const options = ["À venir", "En cours", "Terminé"];

  const handleSelect = (value) => {
    setStatus(value);
    setModalVisible(false);
  };

  const onChangeDate = (event, selectedDate) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const onChangeDateEnd = (event, selectedDate) => {
    if (selectedDate) {
      setDateEnd(selectedDate);
    }
  };

  const devUrl = process.env.DEV_URL;

  // Fonction de validation du formulaire avec Joi
  const validateForm = () => {
    const schema = Joi.object({
      status: Joi.string()
        .valid("À venir", "En cours", "Terminé")
        .optional()
        .messages({
          "any.only":
            'Le statut doit être l\'un des suivants : "À venir", "En cours", "Terminé".',
        }),
      date: Joi.date().iso().optional().messages({
        "date.base": "La date de début doit être une date valide.",
      }),
      dateEnd: Joi.date().iso().optional().min(Joi.ref("date")).messages({
        "date.min":
          'La "Date de fin prévue" doit être au même jour ou après la "Date de début".',
      }),
      content: Joi.string().min(0).max(500).optional().messages({
        "string.max": "Le commentaire ne peut pas dépasser 500 caractères.",
      }),
    });

    const { error } = schema.validate({
      status,
      date,
      dateEnd,
      content,
    });

    if (error) {
      const formattedErrors = error.details.reduce((acc, curr) => {
        acc[curr.path[0]] = curr.message; // Mappe chaque erreur par champ
        return acc;
      }, {});
      setErrors(formattedErrors);
      return false;
    }

    // Si pas d'erreur, on réinitialise les erreurs
    setErrors({});
    return true;
  };

  const handlePress = () => {
    // Valider le formulaire avant d'envoyer la requête
    if (!validateForm()) {
      return; // Ne pas envoyer la requête si la validation échoue
    }

    const projectId = data._id;
    const stepId = step._id;

    fetch(`${devUrl}/projects/updateStep/${projectId}/${stepId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: status,
        date: date.toISOString(),
        dateEnd: dateEnd.toISOString(),
        content: content,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          navigation.navigate("Projet");
        }
      })
      .catch((error) => {
        console.error("Erreur de mise à jour :", error);
      });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={globalStyles.header}>
        <ReturnButton onPress={() => navigation.goBack()} />
        <Text style={globalStyles.title}>{data.client.firstname}</Text>
      </View>
      <Text style={styles.nameStepText}>{step.name}</Text>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={20}
      >
        <ScrollView ref={scrollViewRef}>
          <InputFiles />

          <View style={styles.selectContainer}>
            <View style={styles.statusContainer}>
              <Text style={styles.label}>Status :</Text>
              <Text style={styles.status}>{status}</Text>
            </View>
            <FontAwesome5
              name="pencil-alt"
              size={22}
              color="#663ED9"
              style={styles.icon}
              onPress={() => setModalVisible(true)}
            />
          </View>
          <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <FlatList
                  data={options}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.option}
                      onPress={() => handleSelect(item)}
                    >
                      <Text style={styles.optionText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          </Modal>

          {/* Affichage de l'erreur pour le statut */}
          {errors.status && (
            <Text style={styles.errorText}>{errors.status}</Text>
          )}

          <View style={styles.datePickerContainer}>
            <Text style={styles.label}>Date de début :</Text>
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onChangeDate}
            />
          </View>

          {/* Affichage de l'erreur pour la date de début */}
          {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}

          <View style={styles.datePickerContainer}>
            <Text style={styles.label}>Date de fin prévu :</Text>
            <DateTimePicker
              value={dateEnd}
              mode="date"
              display="default"
              onChange={onChangeDateEnd}
            />
          </View>

          {/* Affichage de l'erreur pour la date de fin */}
          {errors.dateEnd && (
            <Text style={styles.errorText}>{errors.dateEnd}</Text>
          )}

          <View style={styles.textareaContainer}>
            <Text style={styles.label}>Commentaires :</Text>
            <TextInput
              style={styles.textarea}
              placeholder="Ajoutez un commentaire ici..."
              multiline={true}
              numberOfLines={4}
              value={content}
              onChangeText={setContent}
            />
          </View>

          {/* Affichage de l'erreur pour le commentaire */}
          {errors.content && (
            <Text style={styles.errorText}>{errors.content}</Text>
          )}

          <GradientButton text="Valider" onPress={handlePress} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    margin: 20,
  },
  nameStepText: {
    margin: 30,
    fontSize: 18,
    fontWeight: "600",
    color: "#362173",
  },
  selectContainer: {
    width: "100%",
    marginTop: 30,
    marginBottom: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statusContainer: {
    display: "flex",
    flexDirection: "row",
  },
  datePickerContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  textareaContainer: {
    marginVertical: 20,
    width: "100%",
  },
  textarea: {
    width: "100%",
    textAlignVertical: "top",
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#663ED9",
    borderRadius: 8,
    backgroundColor: "#fff",
    padding: 12,
    height: 140,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#362173",
  },
  status: {
    fontSize: 16,
    marginLeft: 15,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
    paddingHorizontal: 10,
  },
  icon: {
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    maxHeight: "50%",
  },
  option: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  optionText: {
    fontSize: 18,
    color: "#663ED9",
  },
});
