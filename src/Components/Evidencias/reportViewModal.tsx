"use client";

import type React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Modal, Portal, Button } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";

interface Report {
  id: string;
  title: string;
  content: string;
  methodology?: string;
  conclusion?: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

interface ReportViewModalProps {
  visible: boolean;
  onDismiss: () => void;
  report: Report | null;
  onEdit?: () => void;
}

const ReportViewModal: React.FC<ReportViewModalProps> = ({
  visible,
  onDismiss,
  report,
  onEdit,
}) => {
  if (!report) return null;

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
    return report.status === "finalizado" ? "#2E7D32" : "#E65100";
  };

  const getStatusBackground = () => {
    return report.status === "finalizado" ? "#E8F5E9" : "#FFF3E0";
  };

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
              <MaterialIcons name="description" size={24} color="#000" />
              <Text style={styles.modalTitle}>Visualizar Relatório</Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusBackground() },
              ]}
            >
              <Text style={[styles.statusText, { color: getStatusColor() }]}>
                {report.status === "finalizado" ? "Finalizado" : "Rascunho"}
              </Text>
            </View>
          </View>

          {/* Título */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Título</Text>
            <View style={styles.contentBox}>
              <Text style={styles.contentText}>{report.title}</Text>
            </View>
          </View>

          {/* Conteúdo */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Conteúdo</Text>
            <View style={[styles.contentBox, styles.multilineBox]}>
              <Text style={styles.contentText}>{report.content}</Text>
            </View>
          </View>

          {/* Metodologia */}
          {report.methodology && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Metodologia</Text>
              <View style={[styles.contentBox, styles.multilineBox]}>
                <Text style={styles.contentText}>{report.methodology}</Text>
              </View>
            </View>
          )}

          {/* Conclusão */}
          {report.conclusion && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Conclusão</Text>
              <View style={[styles.contentBox, styles.multilineBox]}>
                <Text style={styles.contentText}>{report.conclusion}</Text>
              </View>
            </View>
          )}

          {/* Informações de Data */}
          <View style={styles.dateSection}>
            <View style={styles.dateItem}>
              <MaterialIcons name="schedule" size={16} color="#666" />
              <Text style={styles.dateLabel}>Criado em:</Text>
              <Text style={styles.dateText}>
                {formatDate(report.createdAt)}
              </Text>
            </View>
            {report.updatedAt && report.updatedAt !== report.createdAt && (
              <View style={styles.dateItem}>
                <MaterialIcons name="update" size={16} color="#666" />
                <Text style={styles.dateLabel}>Atualizado em:</Text>
                <Text style={styles.dateText}>
                  {formatDate(report.updatedAt)}
                </Text>
              </View>
            )}
          </View>

          {/* Botões */}
          <View style={styles.buttons}>
            {onEdit && (
              <Button
                mode="outlined"
                onPress={onEdit}
                style={styles.editButton}
                textColor="#000"
                icon="edit"
                labelStyle={{ fontWeight: "bold" }}
              >
                Editar
              </Button>
            )}
            <Button
              mode="contained"
              onPress={onDismiss}
              style={styles.closeButton}
              buttonColor="#000"
              textColor="#FFF"
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
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
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
  multilineBox: {
    minHeight: 80,
  },
  contentText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
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
  editButton: {
    flex: 1,
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 8,
  },
  closeButton: {
    flex: 1,
    borderRadius: 8,
  },
});

export default ReportViewModal;
