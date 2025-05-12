import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

/**
 * Wrapper pour DateTimePicker qui utilise react-native-modal-datetime-picker
 * pour éviter les problèmes liés à la propriété 'dismiss' sur Android
 */
const DatePickerWrapper = ({
  value,
  onChange,
  mode = "date",
  style,
  label,
}) => {
  const [date, setDate] = useState(value || new Date());
  const [isPickerVisible, setPickerVisible] = useState(false);

  // Synchroniser date avec value si elle change depuis l'extérieur
  useEffect(() => {
    if (value && value.getTime() !== date.getTime()) {
      setDate(value);
    }
  }, [value]);

  const formatDate = (date) => {
    if (!date) return "";

    if (mode === "time") {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (mode === "datetime") {
      return `${date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })} ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const showPicker = () => {
    setPickerVisible(true);
  };

  const hidePicker = () => {
    setPickerVisible(false);
  };

  const handleConfirm = (selectedDate) => {
    setPickerVisible(false);

    if (selectedDate) {
      setDate(selectedDate);
      if (onChange) {
        onChange(selectedDate);
      }
    }
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity onPress={showPicker} style={[styles.dateButton, style]}>
        <Text style={styles.dateText}>{formatDate(date)}</Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isPickerVisible}
        mode={mode}
        date={date}
        onConfirm={handleConfirm}
        onCancel={hidePicker}
        locale="fr-FR"
        cancelTextIOS="Annuler"
        confirmTextIOS="Confirmer"
        headerTextIOS={label || "Sélectionnez une date"}
        is24Hour={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 8,
    fontWeight: "600",
  },
  dateButton: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  dateText: {
    fontSize: 16,
    color: "#663ED9",
    fontWeight: "500",
  },
});

export default DatePickerWrapper;
