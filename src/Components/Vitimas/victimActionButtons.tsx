import type React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";

interface VictimActionButtonsProps {
  selectedVictim: string | null;
  onViewVictim: () => void;
  onEditVictim: () => void;
  onDeleteVictim: () => void;
  showButtons: boolean;
}

const VictimActionButtons: React.FC<VictimActionButtonsProps> = ({
  selectedVictim,
  onViewVictim,
  onEditVictim,
  onDeleteVictim,
  showButtons,
}) => {
  if (!showButtons) return null;

  const handleViewPress = () => {
    console.log(
      "Botão Visualizar pressionado, selectedVictim:",
      selectedVictim
    );
    onViewVictim();
  };

  const handleEditPress = () => {
    console.log("Botão Editar pressionado, selectedVictim:", selectedVictim);
    onEditVictim();
  };

  const handleDeletePress = () => {
    console.log("Botão Excluir pressionado, selectedVictim:", selectedVictim);
    onDeleteVictim();
  };

  return (
    <View style={styles.actionButtonsContainer}>
      <TouchableOpacity
        style={[
          styles.actionButton,
          styles.viewButton,
          !selectedVictim && styles.disabledButton,
        ]}
        onPress={handleViewPress}
        disabled={!selectedVictim}
      >
        <MaterialIcons
          name="visibility"
          size={20}
          color={selectedVictim ? "#FFF" : "#999"}
        />
        <Text
          style={[
            styles.actionButtonText,
            !selectedVictim && styles.disabledButtonText,
          ]}
        >
          Visualizar
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.actionButton,
          styles.editButton,
          !selectedVictim && styles.disabledButton,
        ]}
        onPress={handleEditPress}
        disabled={!selectedVictim}
      >
        <MaterialIcons
          name="edit"
          size={20}
          color={selectedVictim ? "#FFF" : "#999"}
        />
        <Text
          style={[
            styles.actionButtonText,
            !selectedVictim && styles.disabledButtonText,
          ]}
        >
          Editar
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.actionButton,
          styles.deleteButton,
          !selectedVictim && styles.disabledButton,
        ]}
        onPress={handleDeletePress}
        disabled={!selectedVictim}
      >
        <MaterialIcons
          name="delete"
          size={20}
          color={selectedVictim ? "#FFF" : "#999"}
        />
        <Text
          style={[
            styles.actionButtonText,
            !selectedVictim && styles.disabledButtonText,
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
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  viewButton: {
    backgroundColor: "#000",
  },
  editButton: {
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
    fontSize: 13,
    fontWeight: "600",
  },
  disabledButtonText: {
    color: "#999",
  },
});

export default VictimActionButtons;
