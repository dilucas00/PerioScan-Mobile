"use client";

import type React from "react";
import { StyleSheet } from "react-native";
import { Text, Modal, Portal, Button, Card } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { View } from "react-native";

interface DeleteCaseModalProps {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: () => void;
  caseTitle: string;
  loading?: boolean;
}

const DeleteCaseModal: React.FC<DeleteCaseModalProps> = ({
  visible,
  onDismiss,
  onConfirm,
  caseTitle,
  loading = false,
}) => {
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <Card style={styles.card}>
          <Card.Content style={styles.content}>
            <View style={styles.iconContainer}>
              <MaterialIcons name="warning" size={48} color="#DC2626" />
            </View>

            <Text style={styles.title}>Excluir Caso</Text>
            <Text style={styles.message}>
              Tem certeza que deseja excluir o caso "{caseTitle}"?
              {"\n\n"}
              Esta ação não pode ser desfeita e todos os dados relacionados ao
              caso serão permanentemente removidos.
            </Text>

            <View style={styles.buttons}>
              <Button
                mode="outlined"
                onPress={onDismiss}
                style={styles.cancelButton}
                textColor="#666"
                disabled={loading}
                labelStyle={{ fontWeight: "bold" }}
              >
                Cancelar
              </Button>

              <Button
                mode="contained"
                onPress={onConfirm}
                style={styles.confirmButton}
                buttonColor="#DC2626"
                textColor="#FFF"
                disabled={loading}
                loading={loading}
                labelStyle={{ fontWeight: "bold" }}
              >
                Excluir
              </Button>
            </View>
          </Card.Content>
        </Card>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 16,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    backgroundColor: "#FFF",
  },
  content: {
    alignItems: "center",
    padding: 24,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  buttons: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    borderColor: "#DDD",
    borderWidth: 1,
    borderRadius: 8,
  },
  confirmButton: {
    flex: 1,
    borderRadius: 8,
  },
});

export default DeleteCaseModal;
