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

interface ReportModalProps {
  visible: boolean;
  onDismiss: () => void;
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
  methodology: string;
  setMethodology: (methodology: string) => void;
  conclusion: string;
  setConclusion: (conclusion: string) => void;
  status: string;
  setStatus: (status: string) => void;
  errors: { [key: string]: string };
  setErrors: (errors: { [key: string]: string }) => void;
  loading: boolean;
  onSubmit: () => void;
  onGenerateWithAI: () => void;
}

const ReportModal: React.FC<ReportModalProps> = ({
  visible,
  onDismiss,
  title,
  setTitle,
  content,
  setContent,
  methodology,
  setMethodology,
  conclusion,
  setConclusion,
  status,
  setStatus,
  errors,
  setErrors,
  loading,
  onSubmit,
  onGenerateWithAI,
}) => {
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        {/* Botão Gerar com IA no topo */}
        <Button
          mode="contained"
          onPress={onGenerateWithAI}
          style={styles.aiButtonTop}
          buttonColor="#000"
          textColor="#FFF"
          disabled={loading}
          icon="robot"
        >
          Gerar com IA
        </Button>

        <Text style={styles.modalTitle}>Criar Relatório</Text>

        <TextInput
          label="Título do Relatório *"
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
          theme={{ colors: { primary: "#000", onSurfaceVariant: "#000" } }}
        />
        {errors.title ? (
          <Text style={styles.errorText}>{errors.title}</Text>
        ) : null}

        <TextInput
          label="Conteúdo *"
          value={content}
          onChangeText={(text) => {
            setContent(text);
            if (errors.content) {
              setErrors({ ...errors, content: "" });
            }
          }}
          mode="outlined"
          multiline
          numberOfLines={4}
          style={styles.input}
          error={!!errors.content}
          outlineColor="#DDD"
          activeOutlineColor="#000"
          theme={{ colors: { primary: "#000", onSurfaceVariant: "#000" } }}
        />
        {errors.content ? (
          <Text style={styles.errorText}>{errors.content}</Text>
        ) : null}

        <TextInput
          label="Metodologia"
          value={methodology}
          onChangeText={setMethodology}
          mode="outlined"
          multiline
          numberOfLines={3}
          style={styles.input}
          outlineColor="#DDD"
          activeOutlineColor="#000"
          theme={{ colors: { primary: "#000", onSurfaceVariant: "#000" } }}
        />

        <TextInput
          label="Conclusão"
          value={conclusion}
          onChangeText={setConclusion}
          mode="outlined"
          multiline
          numberOfLines={3}
          style={styles.input}
          outlineColor="#DDD"
          activeOutlineColor="#000"
          theme={{ colors: { primary: "#000", onSurfaceVariant: "#000" } }}
        />

        <Text style={styles.segmentedLabel}>Status do Relatório:</Text>
        <SegmentedButtons
          value={status}
          onValueChange={setStatus}
          buttons={[
            {
              value: "rascunho",
              label: "Rascunho",
              style: {
                backgroundColor: status === "rascunho" ? "#000" : "#fff",
                borderColor: "#000",
              },
              checkedColor: "#fff",
              uncheckedColor: "#000",
            },
            {
              value: "finalizado",
              label: "Finalizado",
              style: {
                backgroundColor: status === "finalizado" ? "#000" : "#fff",
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
  aiButtonTop: {
    marginBottom: 16,
    borderRadius: 8,
    paddingVertical: 4,
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
    color: "#000",
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

export default ReportModal;
