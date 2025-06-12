"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Text,
  Modal,
  Portal,
  Button,
  TextInput,
  RadioButton,
  Checkbox,
  Chip,
} from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";

interface ToothData {
  number: number;
  status: "presente" | "ausente" | "implante" | "protese";
  rootCanal?: boolean;
  crown?: string;
  restorations?: string[];
  wear?: string;
  fractures?: string;
  annotations?: string;
  lastUpdate?: string;
}

interface ToothModalProps {
  visible: boolean;
  onDismiss: () => void;
  toothNumber: number | null;
  toothData: ToothData | null;
  onSave: (data: Partial<ToothData>) => Promise<void>;
  loading?: boolean;
}

const ToothModal: React.FC<ToothModalProps> = ({
  visible,
  onDismiss,
  toothNumber,
  toothData,
  onSave,
  loading,
}) => {
  const [status, setStatus] = useState<
    "presente" | "ausente" | "implante" | "protese"
  >("presente");
  const [rootCanal, setRootCanal] = useState(false);
  const [crown, setCrown] = useState("");
  const [restorations, setRestorations] = useState<string[]>([]);
  const [wear, setWear] = useState("");
  const [fractures, setFractures] = useState("");
  const [annotations, setAnnotations] = useState("");

  const restorationOptions = [
    "Amálgama",
    "Resina",
    "Cerâmica",
    "Ouro",
    "Porcelana",
    "Compósito",
  ];
  const crownOptions = ["Cerâmica", "Porcelana", "Metal", "Zircônia", "Resina"];
  const wearOptions = ["Leve", "Moderado", "Severo"];

  useEffect(() => {
    if (toothData) {
      setStatus(toothData.status);
      setRootCanal(toothData.rootCanal || false);
      setCrown(toothData.crown || "");
      setRestorations(toothData.restorations || []);
      setWear(toothData.wear || "");
      setFractures(toothData.fractures || "");
      setAnnotations(toothData.annotations || "");
    } else {
      // Reset form
      setStatus("presente");
      setRootCanal(false);
      setCrown("");
      setRestorations([]);
      setWear("");
      setFractures("");
      setAnnotations("");
    }
  }, [toothData, visible]);

  const handleSave = async () => {
    const data: Partial<ToothData> = {
      status,
      rootCanal,
      crown: crown || undefined,
      restorations: restorations.length > 0 ? restorations : undefined,
      wear: wear || undefined,
      fractures: fractures || undefined,
      annotations: annotations || undefined,
    };

    await onSave(data);
  };

  const toggleRestoration = (restoration: string) => {
    setRestorations((prev) =>
      prev.includes(restoration)
        ? prev.filter((r) => r !== restoration)
        : [...prev, restoration]
    );
  };

  if (!toothNumber) return null;

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <MaterialIcons name="medical-services" size={24} color="#000" />
              <Text style={styles.modalTitle}>Dente {toothNumber}</Text>
            </View>
            <Button mode="text" onPress={onDismiss} textColor="#666">
              <MaterialIcons name="close" size={20} />
            </Button>
          </View>

          {/* Status do Dente */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Status do Dente</Text>
            <View style={styles.radioGroup}>
              {[
                { value: "presente", label: "Presente" },
                { value: "ausente", label: "Ausente" },
                { value: "implante", label: "Implante" },
                { value: "protese", label: "Prótese" },
              ].map((option) => (
                <View key={option.value} style={styles.radioItem}>
                  <RadioButton
                    value={option.value}
                    status={status === option.value ? "checked" : "unchecked"}
                    onPress={() => setStatus(option.value as any)}
                    color="#000"
                  />
                  <Text style={styles.radioLabel}>{option.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Opções para dentes presentes */}
          {status === "presente" && (
            <>
              {/* Tratamento Endodôntico */}
              <View style={styles.section}>
                <View style={styles.checkboxRow}>
                  <Checkbox
                    status={rootCanal ? "checked" : "unchecked"}
                    onPress={() => setRootCanal(!rootCanal)}
                    color="#000"
                  />
                  <Text style={styles.checkboxLabel}>Tratamento de Canal</Text>
                </View>
              </View>

              {/* Coroa */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Tipo de Coroa</Text>
                <View style={styles.chipContainer}>
                  {crownOptions.map((option) => (
                    <Chip
                      key={option}
                      selected={crown === option}
                      onPress={() => setCrown(crown === option ? "" : option)}
                      style={[
                        styles.chip,
                        crown === option && styles.chipSelected,
                      ]}
                      textStyle={
                        crown === option
                          ? styles.chipTextSelected
                          : styles.chipText
                      }
                    >
                      {option}
                    </Chip>
                  ))}
                </View>
              </View>

              {/* Restaurações */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Restaurações</Text>
                <View style={styles.chipContainer}>
                  {restorationOptions.map((option) => (
                    <Chip
                      key={option}
                      selected={restorations.includes(option)}
                      onPress={() => toggleRestoration(option)}
                      style={[
                        styles.chip,
                        restorations.includes(option) && styles.chipSelected,
                      ]}
                      textStyle={
                        restorations.includes(option)
                          ? styles.chipTextSelected
                          : styles.chipText
                      }
                    >
                      {option}
                    </Chip>
                  ))}
                </View>
              </View>

              {/* Desgaste */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Nível de Desgaste</Text>
                <View style={styles.chipContainer}>
                  {wearOptions.map((option) => (
                    <Chip
                      key={option}
                      selected={wear === option}
                      onPress={() => setWear(wear === option ? "" : option)}
                      style={[
                        styles.chip,
                        wear === option && styles.chipSelected,
                      ]}
                      textStyle={
                        wear === option
                          ? styles.chipTextSelected
                          : styles.chipText
                      }
                    >
                      {option}
                    </Chip>
                  ))}
                </View>
              </View>

              {/* Fraturas */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Fraturas</Text>
                <TextInput
                  mode="outlined"
                  value={fractures}
                  onChangeText={setFractures}
                  placeholder="Descreva as fraturas observadas"
                  multiline
                  numberOfLines={2}
                  style={styles.textInput}
                  outlineColor="#E0E0E0"
                  activeOutlineColor="#000"
                />
              </View>
            </>
          )}

          {/* Observações */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Observações</Text>
            <TextInput
              mode="outlined"
              value={annotations}
              onChangeText={setAnnotations}
              placeholder="Observações adicionais sobre o dente"
              multiline
              numberOfLines={3}
              style={styles.textInput}
              outlineColor="#E0E0E0"
              activeOutlineColor="#000"
            />
          </View>

          {/* Botões */}
          <View style={styles.buttons}>
            <Button
              mode="outlined"
              onPress={onDismiss}
              style={styles.cancelButton}
              textColor="#666"
            >
              Cancelar
            </Button>
            <Button
              mode="contained"
              onPress={handleSave}
              style={styles.saveButton}
              buttonColor="#000"
              textColor="#FFF"
              loading={loading}
              disabled={loading}
            >
              Salvar
            </Button>
          </View>
        </ScrollView>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 40,
    borderRadius: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    maxHeight: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginLeft: 8,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  radioGroup: {
    gap: 8,
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioLabel: {
    fontSize: 14,
    color: "#333",
    marginLeft: 8,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#333",
    marginLeft: 8,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  chipSelected: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  chipText: {
    color: "#666",
  },
  chipTextSelected: {
    color: "#FFF",
  },
  textInput: {
    backgroundColor: "#FFF",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    borderColor: "#E0E0E0",
  },
  saveButton: {
    flex: 1,
  },
});

export default ToothModal;
