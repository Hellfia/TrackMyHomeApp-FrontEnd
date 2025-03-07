import React, { useState } from "react";
import {
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { FontAwesome5 } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import GradientButton from "../../components/GradientButton";
import InputFiles from "../../components/InputFiles";
import ReturnButton from "../../components/ReturnButton";
import globalStyles from "../../styles/globalStyles";

export default function UpdateDetails({ route, navigation }) {
  const { step, client } = route.params;

  const [status, setStatus] = useState("À venir");
  const [isModalVisible, setModalVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [dateEnd, setDateEnd] = useState(new Date());
  const [content, setContent] = useState("");

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

  const handlePress = () => {
    console.log("cliké");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={globalStyles.header}>
        <ReturnButton onPress={() => navigation.goBack()} />
        <Text style={globalStyles.title}>{client.firstname}</Text>
      </View>
      <Text style={styles.nameStepText}>{step.name}</Text>
      <InputFiles />

      {/* Sélect personnalisé */}
      <View style={styles.selectContainer}>
        <View style={styles.statusContainer}>
          <Text style={styles.label}>Status :</Text>
          <Text style={styles.status}>{status}</Text>
        </View>
        <FontAwesome5
          name="pencil-alt"
          size="22"
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

      {/* Input date */}
      <View style={styles.datePickerContainer}>
        <Text style={styles.label}>Date de début :</Text>
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      </View>

      {/* Input dateEnd */}
      <View style={styles.datePickerContainer}>
        <Text style={styles.label}>Date de fin prévu :</Text>
        <DateTimePicker
          value={dateEnd}
          mode="date"
          display="default"
          onChange={onChangeDateEnd}
        />
      </View>

      {/* Textarea */}
      <View style={styles.textareaContainer}>
        <Text style={styles.label}>Commentaires :</Text>
        <TextInput
          style={styles.textarea}
          multiline={true}
          numberOfLines={4}
          placeholder="Ajoutez un commentaire ici..."
          value={content}
          onChangeText={setContent}
        />
      </View>

      <GradientButton text="Valider" onPress={handlePress} />
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
    marginVertical: 10,
    borderWidth: 2,
    borderColor: "#663ED9",
    borderRadius: 8,
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
  select: {
    height: 50,
    justifyContent: "center",
    backgroundColor: "#663ED9",
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  selectText: {
    fontSize: 16,
    color: "#fff",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(16, 16, 16, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  option: {
    paddingVertical: 10,
    backgroundColor: "#663ED9",
    borderRadius: 8,
    marginVertical: 8,
  },
  optionText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },
});
