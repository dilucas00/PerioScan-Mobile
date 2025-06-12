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

interface VictimModalProps {
  visible: boolean;
  onDismiss: () => void;
  identificationType: "identificada" | "não_identificada";
  setIdentificationType: (type: "identificada" | "não_identificada") => void;
  name: string;
  setName: (name: string) => void;
  gender: string;
  setGender: (gender: string) => void;
  age: string;
  setAge: (age: string) => void;
  documentType: string;
  setDocumentType: (type: string) => void;
  documentNumber: string;
  setDocumentNumber: (number: string) => void;
  nic: string;
  setNic: (nic: string) => void;
  referenceCode: string;
  setReferenceCode: (code: string) => void;
  errors: { [key: string]: string };
  setErrors: (errors: { [key: string]: string }) => void;
  loading: boolean;
  onSubmit: () => void;
  isEditing?: boolean;
}

const VictimModal: React.FC<VictimModalProps> = ({
  visible,
  onDismiss,
  identificationType,
  setIdentificationType,
  name,
  setName,
  gender,
  setGender,
  age,
  setAge,
  documentType,
  setDocumentType,
  documentNumber,
  setDocumentNumber,
  nic,
  setNic,
  referenceCode,
  setReferenceCode,
  errors,
  setErrors,
  loading,
  onSubmit,
  isEditing = false,
}) => {
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <Text style={styles.modalTitle}>
          {isEditing ? "Editar Vítima" : "Registrar Vítima"}
        </Text>

        {!isEditing && (
          <>
            <Text style={styles.segmentedLabel}>Tipo de Identificação:</Text>
            <SegmentedButtons
              value={identificationType}
              onValueChange={setIdentificationType}
              buttons={[
                {
                  value: "identificada",
                  label: "Identificada",
                  style: {
                    backgroundColor:
                      identificationType === "identificada" ? "#000" : "#fff",
                    borderColor: "#000",
                  },
                  checkedColor: "#fff",
                  uncheckedColor: "#000",
                },
                {
                  value: "não_identificada",
                  label: "Não Identificada",
                  style: {
                    backgroundColor:
                      identificationType === "não_identificada"
                        ? "#000"
                        : "#fff",
                    borderColor: "#000",
                  },
                  checkedColor: "#fff",
                  uncheckedColor: "#000",
                },
              ]}
              style={styles.segmentedButtons}
            />
          </>
        )}

        {identificationType === "identificada" ? (
          <>
            <TextInput
              label="Nome Completo *"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errors.name) {
                  setErrors({ ...errors, name: "" });
                }
              }}
              mode="outlined"
              style={styles.input}
              error={!!errors.name}
              outlineColor="#DDD"
              activeOutlineColor="#000"
              theme={{ colors: { primary: "#000", onSurfaceVariant: "#666" } }}
            />
            {errors.name ? (
              <Text style={styles.errorText}>{errors.name}</Text>
            ) : null}

            <Text style={styles.segmentedLabel}>Gênero:</Text>
            <SegmentedButtons
              value={gender}
              onValueChange={setGender}
              buttons={[
                {
                  value: "masculino",
                  label: "Masculino",
                  style: {
                    backgroundColor: gender === "masculino" ? "#000" : "#fff",
                    borderColor: "#000",
                  },
                  checkedColor: "#fff",
                  uncheckedColor: "#000",
                },
                {
                  value: "feminino",
                  label: "Feminino",
                  style: {
                    backgroundColor: gender === "feminino" ? "#000" : "#fff",
                    borderColor: "#000",
                  },
                  checkedColor: "#fff",
                  uncheckedColor: "#000",
                },
                {
                  value: "outro",
                  label: "Outro",
                  style: {
                    backgroundColor: gender === "outro" ? "#000" : "#fff",
                    borderColor: "#000",
                  },
                  checkedColor: "#fff",
                  uncheckedColor: "#000",
                },
              ]}
              style={styles.segmentedButtons}
            />

            <TextInput
              label="Idade"
              value={age}
              onChangeText={setAge}
              mode="outlined"
              style={styles.input}
              keyboardType="numeric"
              outlineColor="#DDD"
              activeOutlineColor="#000"
              theme={{ colors: { primary: "#000", onSurfaceVariant: "#666" } }}
            />

            <Text style={styles.segmentedLabel}>Tipo de Documento:</Text>
            <SegmentedButtons
              value={documentType}
              onValueChange={setDocumentType}
              buttons={[
                {
                  value: "rg",
                  label: "RG",
                  style: {
                    backgroundColor: documentType === "rg" ? "#000" : "#fff",
                    borderColor: "#000",
                  },
                  checkedColor: "#fff",
                  uncheckedColor: "#000",
                },
                {
                  value: "cpf",
                  label: "CPF",
                  style: {
                    backgroundColor: documentType === "cpf" ? "#000" : "#fff",
                    borderColor: "#000",
                  },
                  checkedColor: "#fff",
                  uncheckedColor: "#000",
                },
                {
                  value: "cnh",
                  label: "CNH",
                  style: {
                    backgroundColor: documentType === "cnh" ? "#000" : "#fff",
                    borderColor: "#000",
                  },
                  checkedColor: "#fff",
                  uncheckedColor: "#000",
                },
                {
                  value: "passaporte",
                  label: "Passaporte",
                  style: {
                    backgroundColor:
                      documentType === "passaporte" ? "#000" : "#fff",
                    borderColor: "#000",
                  },
                  checkedColor: "#fff",
                  uncheckedColor: "#000",
                },
              ]}
              style={styles.segmentedButtons}
            />

            <TextInput
              label="Número do Documento"
              value={documentNumber}
              onChangeText={setDocumentNumber}
              mode="outlined"
              style={styles.input}
              outlineColor="#DDD"
              activeOutlineColor="#000"
              theme={{ colors: { primary: "#000", onSurfaceVariant: "#666" } }}
            />

            <TextInput
              label="NIC (Número de Identificação Cadavérica)"
              value={nic}
              onChangeText={setNic}
              mode="outlined"
              style={styles.input}
              outlineColor="#DDD"
              activeOutlineColor="#000"
              theme={{ colors: { primary: "#000", onSurfaceVariant: "#666" } }}
            />
          </>
        ) : (
          <>
            <TextInput
              label="Código de Referência *"
              value={referenceCode}
              onChangeText={(text) => {
                setReferenceCode(text);
                if (errors.referenceCode) {
                  setErrors({ ...errors, referenceCode: "" });
                }
              }}
              mode="outlined"
              style={styles.input}
              error={!!errors.referenceCode}
              outlineColor="#DDD"
              activeOutlineColor="#000"
              theme={{ colors: { primary: "#000", onSurfaceVariant: "#666" } }}
              placeholder="Ex: CORPO-001, REF-2024-001"
            />
            {errors.referenceCode ? (
              <Text style={styles.errorText}>{errors.referenceCode}</Text>
            ) : null}

            <TextInput
              label="NIC (Número de Identificação Cadavérica)"
              value={nic}
              onChangeText={setNic}
              mode="outlined"
              style={styles.input}
              outlineColor="#DDD"
              activeOutlineColor="#000"
              theme={{ colors: { primary: "#000", onSurfaceVariant: "#666" } }}
            />
          </>
        )}

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
            ) : isEditing ? (
              "Atualizar"
            ) : (
              "Registrar"
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
    maxHeight: "90%",
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

export default VictimModal;
