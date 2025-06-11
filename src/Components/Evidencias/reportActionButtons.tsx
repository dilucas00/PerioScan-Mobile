import type React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";

interface ReportActionButtonsProps {
  selectedReport: string | null;
  onViewReport: () => void;
  onDeleteReport: () => void;
  showButtons: boolean;
}

const ReportActionButtons: React.FC<ReportActionButtonsProps> = ({
  selectedReport,
  onViewReport,
  onDeleteReport,
  showButtons,
}) => {
  if (!showButtons) return null;

  return (
    <View style={styles.actionButtonsContainer}>
      <TouchableOpacity
        style={[
          styles.actionButton,
          styles.viewButton,
          !selectedReport && styles.disabledButton,
        ]}
        onPress={onViewReport}
        disabled={!selectedReport}
      >
        <MaterialIcons
          name="visibility"
          size={24}
          color={selectedReport ? "#FFF" : "#999"}
        />
        <Text
          style={[
            styles.actionButtonText,
            !selectedReport && styles.disabledButtonText,
          ]}
        >
          Visualizar
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.actionButton,
          styles.deleteButton,
          !selectedReport && styles.disabledButton,
        ]}
        onPress={onDeleteReport}
        disabled={!selectedReport}
      >
        <MaterialIcons
          name="delete"
          size={24}
          color={selectedReport ? "#FFF" : "#999"}
        />
        <Text
          style={[
            styles.actionButtonText,
            !selectedReport && styles.disabledButtonText,
          ]}
        >
          Excluir
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  viewButton: {
    backgroundColor: "#000",
  },
  deleteButton: {
    backgroundColor: "#000",
  },
  disabledButton: {
    backgroundColor: "#E0E0E0",
  },
  actionButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  disabledButtonText: {
    color: "#999",
  },
});

export default ReportActionButtons;
