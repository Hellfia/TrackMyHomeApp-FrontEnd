import { FontAwesome5 } from "@expo/vector-icons";
import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import GradientButton from "../../../components/GradientButton";
import InputPicture from "../../../components/InputPicture";
import ReturnButton from "../../../components/ReturnButton";
import updateDetails from "../../../schemas/UpdateDetails";
import { LinearGradient } from "expo-linear-gradient";

export default function UpdateDetails({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { data, step } = route.params;
  const clientIdProps = data.client._id;
  const [stepState, setStepState] = useState(step);
  const [status, setStatus] = useState(step.status || "");
  const [content, setContent] = useState(step.content || "");
  const [dateStart, setDateStart] = useState(
    step.date ? new Date(step.date) : new Date()
  );
  const [dateEnd, setDateEnd] = useState(
    step.dateEnd ? new Date(step.dateEnd) : new Date()
  );
  const [errors, setErrors] = useState({});

  const [isModalVisible, setModalVisible] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const scrollViewRef = useRef(null);
  const options = ["À venir", "En cours", "Terminé"];
  const prodURL = process.env.PROD_URL;

  useEffect(() => {
    const sub = Keyboard.addListener("keyboardDidShow", () => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    });
    return () => sub.remove();
  }, []);

  // Effect to re-initialize state when 'step' from route.params changes
  useEffect(() => {
    if (step) {
      console.log(
        "UpdateDetails: route.params.step received. Step properties:"
      );
      console.log("- status:", step.status);
      console.log("- content:", step.content);
      console.log("- date:", step.date);
      console.log("- dateEnd:", step.dateEnd);
      console.log("- uri:", step.uri);

      setStepState(step); // Update local copy of step, used by InputPicture
      setStatus(step.status || "");
      setContent(step.content || "");
      setDateStart(step.date ? new Date(step.date) : new Date());
      setDateEnd(step.dateEnd ? new Date(step.dateEnd) : new Date());
      setErrors({}); // Clear previous errors
    }
  }, [step]); // Dependency array includes 'step' from route.params

  const validateForm = useCallback(() => {
    const { error } = updateDetails.validate({
      status,
      date: dateStart,
      dateEnd,
      content,
    });
    if (error) {
      const errs = {};
      error.details.forEach((d) => (errs[d.path[0]] = d.message));
      setErrors(errs);
      return false;
    }
    setErrors({});
    return true;
  }, [status, dateStart, dateEnd, content]);
  const handlePress = useCallback(() => {
    if (!validateForm()) return;
    console.log("Validating form with content:", content);
    console.log("Current stepState.uri value:", stepState.uri);

    const projectId = data._id;
    const stepId = step._id; // Original step._id from route.params

    // Consolidate current values from state, including URI from stepState
    const currentStepPayload = {
      status,
      date: dateStart.toISOString(),
      dateEnd: dateEnd.toISOString(),
      content,
      uri: stepState.uri || step.uri || "", // Try to get URI from either stepState or original step
    };

    console.log(
      "Sending step update with payload:",
      JSON.stringify(currentStepPayload)
    );

    fetch(`${prodURL}/projects/updateStep/${projectId}/${stepId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentStepPayload), // Send all updatable fields
    })
      .then((res) => res.json())
      .then((responseData) => {
        console.log(
          "API response for step update:",
          JSON.stringify(responseData)
        );
        if (responseData.result) {
          // Construct the updated list of steps
          const finalUpdatedSteps = data.steps.map((originalStepInList) => {
            if (originalStepInList._id === step._id) {
              // If API returns the full updated step, use that as it's the source of truth
              if (responseData.updatedStep) {
                console.log(
                  "API returned updated step:",
                  JSON.stringify(responseData.updatedStep)
                );
                return responseData.updatedStep;
              }
              // Otherwise, merge the original step data with the new values from our payload
              // This ensures fields not in currentStepPayload (e.g., name) are preserved.
              const updatedStep = {
                ...originalStepInList, // Start with all fields from the original step
                ...currentStepPayload, // Override with the new values
              };
              console.log(
                "Merging step data. Result:",
                JSON.stringify(updatedStep)
              );
              return updatedStep;
            }
            return originalStepInList; // Return other steps unchanged
          });

          // Create the new data object to pass back
          const newData = { ...data, steps: finalUpdatedSteps };
          console.log("Navigating to ClientDetails with updated data");
          navigation.navigate("ClientDetails", { data: newData });
        } else {
          Alert.alert(
            "Erreur",
            responseData.message ||
              responseData.error ||
              "La mise à jour a échoué."
          );
        }
      })
      .catch((e) => {
        console.error("Update step error:", e);
        Alert.alert(
          "Erreur",
          "Une erreur réseau ou serveur est survenue lors de la mise à jour."
        );
      });
  }, [
    status,
    dateStart,
    dateEnd,
    content,
    stepState.uri, // Important: include stepState.uri as a dependency
    data, // Original project data
    step, // Original step data (for _id and as base)
    validateForm,
    navigation,
    prodURL,
  ]);

  return (
    <LinearGradient
      colors={["#8E44AD", "#372173"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      locations={[0, 0.1]}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <View style={styles.header}>
        <ReturnButton
          onPress={() => navigation.navigate("ClientDetails", { data })}
        />
        <Text style={styles.headerTitle}>
          {data.client.firstname} {data.client.lastname}
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.nameStepText}>{step.name}</Text>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardContainer}
        >
          <ScrollView ref={scrollViewRef}>
            <InputPicture
              step={stepState}
              clientIdProps={clientIdProps}
              style={styles.inputPicture}
              onUpload={(uri) => {
                console.log("InputPicture onUpload called with URI:", uri);
                setStepState({ ...stepState, uri });
                console.log("Updated stepState with new URI:", {
                  ...stepState,
                  uri,
                });
              }}
            />

            <View style={styles.selectContainer}>
              <View style={styles.statusContainer}>
                <Text style={styles.label}>Status :</Text>
                <Text style={styles.status}>{status}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={styles.iconButton}
              >
                <FontAwesome5
                  name="pencil-alt"
                  size={22}
                  color="#663ED9" // Changed from #fff to make it more visible
                />
              </TouchableOpacity>
            </View>
            {errors.status && (
              <Text style={styles.errorText}>{errors.status}</Text>
            )}

            <Modal
              visible={isModalVisible}
              transparent
              animationType="fade"
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <FlatList
                    data={options}
                    keyExtractor={(item, i) => i.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.option}
                        onPress={() => {
                          setStatus(item);
                          setModalVisible(false);
                        }}
                      >
                        <Text style={styles.optionText}>{item}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </View>
            </Modal>

            <View style={styles.datePickerContainer}>
              <Text style={styles.label}>Date de début :</Text>
              <TouchableOpacity onPress={() => setShowStartPicker(true)}>
                <Text style={styles.dateValue}>
                  {dateStart.toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </Text>
              </TouchableOpacity>
            </View>
            {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
            <DateTimePickerModal
              isVisible={showStartPicker}
              mode="date"
              onConfirm={(d) => {
                setShowStartPicker(false);
                setDateStart(d);
              }}
              onCancel={() => setShowStartPicker(false)}
              textColor="#000"
              isDarkModeEnabled={false}
            />

            <View style={styles.datePickerContainer}>
              <Text style={styles.label}>Date de fin prévue :</Text>
              <TouchableOpacity onPress={() => setShowEndPicker(true)}>
                <Text style={styles.dateValue}>
                  {dateEnd.toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </Text>
              </TouchableOpacity>
            </View>
            {errors.dateEnd && (
              <Text style={styles.errorText}>{errors.dateEnd}</Text>
            )}
            <DateTimePickerModal
              isVisible={showEndPicker}
              mode="date"
              onConfirm={(d) => {
                setShowEndPicker(false);
                setDateEnd(d);
              }}
              onCancel={() => setShowEndPicker(false)}
              textColor="#000"
              isDarkModeEnabled={false}
            />

            <View style={styles.textareaContainer}>
              <Text style={styles.label}>Commentaires :</Text>
              <TextInput
                style={styles.textarea}
                placeholder="Ajoutez un commentaire ici..."
                placeholderTextColor="#666"
                multiline
                numberOfLines={4}
                value={content}
                onChangeText={setContent}
                autoCapitalize="sentences"
              />
            </View>
            {errors.content && (
              <Text style={styles.errorText}>{errors.content}</Text>
            )}

            <GradientButton text="Valider" onPress={handlePress} />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginTop: -5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 50,
  },
  headerTitle: {
    position: "absolute",
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  nameStepText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "#362173",
    marginVertical: 10,
  },
  keyboardContainer: {
    flex: 1,
  },
  selectContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#362173",
  },
  status: {
    marginLeft: 10,
    fontSize: 16,
    color: "#FF6600",
  },
  iconButton: {
    padding: 10, // Added padding for a larger touch target
    borderRadius: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
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
  datePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  dateValue: {
    fontSize: 16,
    color: "#362173",
  },
  textareaContainer: {
    marginVertical: 20,
  },
  textarea: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 12,
    height: 140,
    textAlignVertical: "top",
    color: "#000",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
});
