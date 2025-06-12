"use client";

import type React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import {
  Text,
  Modal,
  Portal,
  TextInput,
  SegmentedButtons,
  Button,
} from "react-native-paper";

interface EvidenceModalProps {
  visible: boolean;
  onDismiss: () => void;
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  type: string;
  setType: (type: string) => void;
  location: string;
  setLocation: (location: string) => void;
  errors: { [key: string]: string };
  setErrors: (errors: { [key: string]: string }) => void;
  loading: boolean;
  onSubmit: () => void;
}

const EvidenceModal: React.FC<EvidenceModalProps> = ({
  visible,
  onDismiss,
  title,
  setTitle,
  description,
  setDescription,
  type,
  setType,
  location,
  setLocation,
  errors,
  setErrors,
  loading,
  onSubmit,
}) => {
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <Text style={styles.modalTitle}>Registrar Evidência</Text>

        <TextInput
          label="Título da Evidência *"
          value={title}
          onChangeText={(text) => {
            setTitle(text);
            if (errors.title) {
              setErrors({ ...errors, title: "" });
            }
          }}
          mode="outlined"
          style={styles.input}
          error={!!errors.title}
          outlineColor="#DDD"
          activeOutlineColor="#000"
          theme={{ colors: { primary: "#000", onSurfaceVariant: "#666" } }}
        />
        {errors.title ? (
          <Text style={styles.errorText}>{errors.title}</Text>
        ) : null}

        <TextInput
          label="Descrição *"
          value={description}
          onChangeText={(text) => {
            setDescription(text);
            if (errors.description) {
              setErrors({ ...errors, description: "" });
            }
          }}
          mode="outlined"
          multiline
          numberOfLines={4}
          style={styles.input}
          error={!!errors.description}
          outlineColor="#DDD"
          activeOutlineColor="#000"
          theme={{ colors: { primary: "#000", onSurfaceVariant: "#666" } }}
        />
        {errors.description ? (
          <Text style={styles.errorText}>{errors.description}</Text>
        ) : null}

        <TextInput
          label="Local de Coleta *"
          value={location}
          onChangeText={(text) => {
            setLocation(text);
            if (errors.location) {
              setErrors({ ...errors, location: "" });
            }
          }}
          mode="outlined"
          style={styles.input}
          error={!!errors.location}
          outlineColor="#DDD"
          activeOutlineColor="#000"
          theme={{ colors: { primary: "#000", onSurfaceVariant: "#666" } }}
        />
        {errors.location ? (
          <Text style={styles.errorText}>{errors.location}</Text>
        ) : null}

        <Text style={styles.segmentedLabel}>Tipo de Evidência:</Text>
        <SegmentedButtons
          value={type}
          onValueChange={setType}
          buttons={[
            {
              value: "fisica",
              label: "Física",
              style: {
                backgroundColor: type === "fisica" ? "#000" : "#fff",
                borderColor: "#000",
              },
              checkedColor: "#fff",
              uncheckedColor: "#000",
            },
            {
              value: "digital",
              label: "Digital",
              style: {
                backgroundColor: type === "digital" ? "#000" : "#fff",
                borderColor: "#000",
              },
              checkedColor: "#fff",
              uncheckedColor: "#000",
            },
            {
              value: "biologica",
              label: "Biológica",
              style: {
                backgroundColor: type === "biologica" ? "#000" : "#fff",
                borderColor: "#000",
              },
              checkedColor: "#fff",
              uncheckedColor: "#000",
            },
            {
              value: "documental",
              label: "Documental",
              style: {
                backgroundColor: type === "documental" ? "#000" : "#fff",
                borderColor: "#000",
              },
              checkedColor: "#fff",
              uncheckedColor: "#000",
            },
          ]}
          style={styles.segmentedButtons}
        />

        <View style={styles.buttons}>
          <Button
            mode="outlined"
            onPress={onDismiss}
            style={styles.cancelButton}
            textColor="#000"
            labelStyle={{ fontWeight: "bold" }}
          >
            Cancelar
          </Button>

          <Button
            mode="contained"
            onPress={onSubmit}
            style={styles.confirmButton}
            buttonColor="#000"
            textColor="#FFF"
            disabled={loading}
            labelStyle={{ fontWeight: "bold" }}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              "Confirmar"
            )}
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "white",
    padding: 24,
    marginHorizontal: 20,
    borderRadius: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: -12,
    marginBottom: 12,
    marginLeft: 8,
  },
  segmentedLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  segmentedButtons: {
    marginBottom: 24,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 8,
  },
  confirmButton: {
    flex: 1,
    borderRadius: 8,
  },
});

export default EvidenceModal;
