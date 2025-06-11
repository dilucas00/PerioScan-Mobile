"use client";

import type React from "react";
import { StyleSheet } from "react-native";
import { Text, Modal, Portal, Button, Card } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { View } from "react-native";

interface ConfirmationModalProps {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
  loading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  onDismiss,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = "danger",
  loading = false,
}) => {
  const getIconName = () => {
    switch (type) {
      case "danger":
        return "warning";
      case "warning":
        return "info";
      case "info":
        return "info";
      default:
        return "warning";
    }
  };

  const getIconColor = () => {
    switch (type) {
      case "danger":
        return "#F44336";
      case "warning":
        return "#FF9800";
      case "info":
        return "#2196F3";
      default:
        return "#F44336";
    }
  };

  const getConfirmButtonColor = () => {
    switch (type) {
      case "danger":
        return "#F44336";
      case "warning":
        return "#FF9800";
      case "info":
        return "#2196F3";
      default:
        return "#F44336";
    }
  };

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
              <MaterialIcons
                name={getIconName()}
                size={48}
                color={getIconColor()}
              />
            </View>

            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>

            <View style={styles.buttons}>
              <Button
                mode="outlined"
                onPress={onDismiss}
                style={styles.cancelButton}
                textColor="#666"
                disabled={loading}
                labelStyle={{ fontWeight: "bold" }}
              >
                {cancelText}
              </Button>

              <Button
                mode="contained"
                onPress={onConfirm}
                style={styles.confirmButton}
                buttonColor={getConfirmButtonColor()}
                textColor="#FFF"
                disabled={loading}
                loading={loading}
                labelStyle={{ fontWeight: "bold" }}
              >
                {confirmText}
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
    backgroundColor: "#fff",
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

export default ConfirmationModal;
