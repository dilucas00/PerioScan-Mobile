import type React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Text, RadioButton } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";

interface Victim {
  id: string;
  identificationType: "identificada" | "não_identificada";
  name?: string;
  gender?: string;
  age?: number;
  nic?: string;
  referenceCode?: string;
  createdAt: string;
}

interface VictimTableProps {
  victims: Victim[];
  loading: boolean;
  selectedVictim: string | null;
  onSelectVictim: (victimId: string) => void;
}

const VictimTable: React.FC<VictimTableProps> = ({
  victims,
  loading,
  selectedVictim,
  onSelectVictim,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  const getDisplayName = (victim: Victim) => {
    if (victim.identificationType === "identificada") {
      return victim.name || "Nome não informado";
    } else {
      return victim.referenceCode || "Código não informado";
    }
  };

  const getStatusColor = (identificationType: string) => {
    return identificationType === "identificada" ? "#2E7D32" : "#E65100";
  };

  const getStatusBackground = (identificationType: string) => {
    return identificationType === "identificada" ? "#E8F5E9" : "#FFF3E0";
  };

  const getStatusIcon = (identificationType: string) => {
    return identificationType === "identificada" ? "person" : "help-outline";
  };

  if (loading) {
    return (
      <View style={styles.tableContainer}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#000" />
          <Text style={styles.loadingText}>Carregando vítimas...</Text>
        </View>
      </View>
    );
  }

  if (victims.length === 0) {
    return (
      <View style={styles.tableContainer}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhuma vítima registrada</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.tableContainer}>
      <View style={styles.tableHeader}>
        <View style={styles.nameColumn}>
          <Text style={styles.columnHeader}>Nome/Código</Text>
        </View>
        <View style={styles.statusColumn}>
          <Text style={styles.columnHeader}>Status</Text>
        </View>
        <View style={styles.infoColumn}>
          <Text style={styles.columnHeader}>Info</Text>
        </View>
        <View style={styles.dateColumn}>
          <Text style={styles.columnHeader}>Data</Text>
        </View>
        <View style={styles.selectColumn}>
          <Text style={styles.columnHeader}>Selecionar</Text>
        </View>
      </View>

      {victims.map((victim, index) => (
        <TouchableOpacity
          key={victim.id}
          style={[
            styles.tableRow,
            index % 2 === 0 ? styles.evenRow : styles.oddRow,
            selectedVictim === victim.id && styles.selectedRow,
          ]}
          onPress={() => onSelectVictim(victim.id)}
          activeOpacity={0.7}
        >
          {/* Coluna do Nome/Código */}
          <View style={styles.nameColumn}>
            <Text style={styles.victimName} numberOfLines={2}>
              {getDisplayName(victim)}
            </Text>
          </View>

          {/* Coluna do Status */}
          <View style={styles.statusColumn}>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: getStatusBackground(
                    victim.identificationType
                  ),
                },
              ]}
            >
              <MaterialIcons
                name={getStatusIcon(victim.identificationType)}
                size={12}
                color={getStatusColor(victim.identificationType)}
              />
              <Text
                style={[
                  styles.statusText,
                  { color: getStatusColor(victim.identificationType) },
                ]}
              >
                {victim.identificationType === "identificada"
                  ? "Identificada"
                  : "Não Identificada"}
              </Text>
            </View>
          </View>

          {/* Coluna de Informações */}
          <View style={styles.infoColumn}>
            <Text style={styles.infoText} numberOfLines={1}>
              {victim.identificationType === "identificada"
                ? victim.gender && victim.age
                  ? `${victim.gender}, ${victim.age}a`
                  : victim.gender || victim.age
                  ? `${victim.gender || ""}${
                      victim.age ? victim.age + "a" : ""
                    }`
                  : "N/A"
                : victim.nic || "N/A"}
            </Text>
          </View>

          {/* Coluna da Data */}
          <View style={styles.dateColumn}>
            <Text style={styles.dateText}>{formatDate(victim.createdAt)}</Text>
          </View>

          {/* Coluna de Seleção */}
          <View style={styles.selectColumn}>
            <RadioButton
              value={victim.id}
              status={selectedVictim === victim.id ? "checked" : "unchecked"}
              onPress={() => onSelectVictim(victim.id)}
              color="#000"
              uncheckedColor="#CCC"
            />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tableContainer: {
    backgroundColor: "#FAFAFA",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F0F0F0",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    alignItems: "center",
  },
  columnHeader: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  nameColumn: {
    flex: 2,
    paddingRight: 8,
  },
  statusColumn: {
    flex: 1.3,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  infoColumn: {
    flex: 1.2,
    paddingHorizontal: 4,
  },
  dateColumn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  selectColumn: {
    width: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: "center",
    minHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  evenRow: {
    backgroundColor: "#FFFFFF",
  },
  oddRow: {
    backgroundColor: "#F9F9F9",
  },
  selectedRow: {
    backgroundColor: "#E3F2FD",
    borderRightWidth: 4,
    borderRightColor: "#000",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  victimName: {
    fontSize: 12,
    fontWeight: "500",
    color: "#333",
    lineHeight: 16,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
    minWidth: 70,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 2,
  },
  statusText: {
    fontSize: 9,
    fontWeight: "600",
    textAlign: "center",
  },
  infoText: {
    fontSize: 10,
    color: "#666",
    textAlign: "center",
  },
  dateText: {
    fontSize: 10,
    color: "#666",
    textAlign: "center",
  },
  loadingContainer: {
    padding: 24,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    color: "#666",
    fontSize: 14,
  },
  emptyContainer: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: "#999",
    fontStyle: "italic",
    fontSize: 14,
  },
});

export default VictimTable;
