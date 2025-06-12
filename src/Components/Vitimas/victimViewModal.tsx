"use client";

import type React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Modal, Portal, Button, IconButton } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";

interface Victim {
  id: string;
  identificationType: "identificada" | "não_identificada";
  name?: string;
  gender?: string;
  age?: number;
  document?: {
    type: string;
    number: string;
  };
  nic?: string;
  referenceCode?: string;
  createdAt: string;
  updatedAt?: string;
  createdBy?: {
    name: string;
  };
}

interface VictimViewModalProps {
  visible: boolean;
  onDismiss: () => void;
  victim: Victim | null;
  onEdit?: () => void;
}

const VictimViewModal: React.FC<VictimViewModalProps> = ({
  visible,
  onDismiss,
  victim,
  onEdit,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = () => {
    return victim?.identificationType === "identificada"
      ? "#2E7D32"
      : "#E65100";
  };

  const getStatusBackground = () => {
    return victim?.identificationType === "identificada"
      ? "#E8F5E9"
      : "#FFF3E0";
  };

  const getStatusIcon = () => {
    return victim?.identificationType === "identificada"
      ? "person"
      : "help-outline";
  };

  const formatDocumentType = (type: string) => {
    const types: { [key: string]: string } = {
      rg: "RG",
      cpf: "CPF",
      cnh: "CNH",
      passaporte: "Passaporte",
    };
    return types[type] || type.toUpperCase();
  };

  const formatGender = (gender: string) => {
    const genders: { [key: string]: string } = {
      masculino: "Masculino",
      feminino: "Feminino",
      outro: "Outro",
    };
    return genders[gender] || gender;
  };

  if (!victim) return null;

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
              <MaterialIcons name={getStatusIcon()} size={24} color="#000" />
              <Text style={styles.modalTitle}>Visualizar Vítima</Text>
            </View>
            <View style={styles.headerRight}>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusBackground() },
                ]}
              >
                <MaterialIcons
                  name={getStatusIcon()}
                  size={16}
                  color={getStatusColor()}
                />
                <Text style={[styles.statusText, { color: getStatusColor() }]}>
                  {victim.identificationType === "identificada"
                    ? "Identificada"
                    : "Não Identificada"}
                </Text>
              </View>
              <IconButton
                icon="close"
                size={20}
                iconColor="#666"
                onPress={onDismiss}
                style={styles.closeButton}
              />
            </View>
          </View>

          {/* Informações principais */}
          {victim.identificationType === "identificada" ? (
            <>
              {/* Nome */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Nome Completo</Text>
                <View style={styles.contentBox}>
                  <Text style={styles.contentText}>
                    {victim.name || "Não informado"}
                  </Text>
                </View>
              </View>

              {/* Informações pessoais */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Informações Pessoais</Text>
                <View style={styles.contentBox}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Gênero:</Text>
                    <Text style={styles.infoValue}>
                      {victim.gender
                        ? formatGender(victim.gender)
                        : "Não informado"}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Idade:</Text>
                    <Text style={styles.infoValue}>
                      {victim.age ? `${victim.age} anos` : "Não informada"}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Documento */}
              {victim.document && (
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>Documento</Text>
                  <View style={styles.contentBox}>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Tipo:</Text>
                      <Text style={styles.infoValue}>
                        {formatDocumentType(victim.document.type)}
                      </Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Número:</Text>
                      <Text style={styles.infoValue}>
                        {victim.document.number}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </>
          ) : (
            <>
              {/* Código de Referência */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Código de Referência</Text>
                <View style={styles.contentBox}>
                  <Text style={styles.contentText}>
                    {victim.referenceCode || "Não informado"}
                  </Text>
                </View>
              </View>
            </>
          )}

          {/* NIC */}
          {victim.nic && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>
                NIC (Número de Identificação Cadavérica)
              </Text>
              <View style={styles.contentBox}>
                <Text style={styles.contentText}>{victim.nic}</Text>
              </View>
            </View>
          )}

          {/* Informações de Data */}
          <View style={styles.dateSection}>
            <View style={styles.dateItem}>
              <MaterialIcons name="schedule" size={16} color="#666" />
              <Text style={styles.dateLabel}>Registrada em:</Text>
              <Text style={styles.dateText}>
                {formatDate(victim.createdAt)}
              </Text>
            </View>
            {victim.updatedAt && victim.updatedAt !== victim.createdAt && (
              <View style={styles.dateItem}>
                <MaterialIcons name="update" size={16} color="#666" />
                <Text style={styles.dateLabel}>Atualizada em:</Text>
                <Text style={styles.dateText}>
                  {formatDate(victim.updatedAt)}
                </Text>
              </View>
            )}
            {victim.createdBy && (
              <View style={styles.dateItem}>
                <MaterialIcons name="person" size={16} color="#666" />
                <Text style={styles.dateLabel}>Registrada por:</Text>
                <Text style={styles.dateText}>{victim.createdBy.name}</Text>
              </View>
            )}
          </View>

          {/* Botões */}
          <View style={styles.buttons}>
            <Button
              mode="contained"
              onPress={onDismiss}
              style={styles.closeButtonFull}
              buttonColor="#000"
              textColor="#FFF"
              icon="close"
              labelStyle={{ fontWeight: "bold" }}
            >
              Fechar
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
    padding: 24,
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
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginLeft: 8,
  },
  closeButton: {
    margin: 0,
    backgroundColor: "#F5F5F5",
    width: 32,
    height: 32,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  contentBox: {
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  contentText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
    width: 80,
  },
  infoValue: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  dateSection: {
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  dateItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  dateLabel: {
    fontSize: 13,
    color: "#666",
    marginLeft: 6,
    marginRight: 8,
    fontWeight: "500",
  },
  dateText: {
    fontSize: 13,
    color: "#333",
    flex: 1,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  closeButtonFull: {
    borderRadius: 8,
    width: "100%",
  },
});

export default VictimViewModal;
