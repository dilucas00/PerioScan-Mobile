import type React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Text, RadioButton } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";

interface Evidence {
  id: string;
  type: string;
  description: string;
  content?: string;
  contentType?: string;
  imageType?: string;
  cloudinary?: {
    url: string;
    public_id: string;
    format: string;
    width: number;
    height: number;
    bytes: number;
  };
  location: string;
  createdAt: string;
}

interface EvidenceTableProps {
  evidences: Evidence[];
  loading: boolean;
  selectedEvidence: string | null;
  onSelectEvidence: (evidenceId: string) => void;
}

const EvidenceTable: React.FC<EvidenceTableProps> = ({
  evidences,
  loading,
  selectedEvidence,
  onSelectEvidence,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  const formatType = (evidence: Evidence) => {
    if (evidence.type === "text") {
      return evidence.contentType || "Texto";
    } else if (evidence.type === "image") {
      return evidence.imageType || "Imagem";
    }
    return evidence.type;
  };

  const getTypeIcon = (evidence: Evidence) => {
    if (evidence.type === "text") {
      return "description";
    } else if (evidence.type === "image") {
      return "photo-camera";
    }
    return "inventory";
  };

  const getTypeColor = (evidence: Evidence) => {
    if (evidence.type === "text") {
      return "#1976D2";
    } else if (evidence.type === "image") {
      return "#388E3C";
    }
    return "#666";
  };

  if (loading) {
    return (
      <View style={styles.tableContainer}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#000" />
          <Text style={styles.loadingText}>Carregando evidências...</Text>
        </View>
      </View>
    );
  }

  if (evidences.length === 0) {
    return (
      <View style={styles.tableContainer}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhuma evidência registrada</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.tableContainer}>
      <View style={styles.tableHeader}>
        <View style={styles.titleColumn}>
          <Text style={styles.columnHeader}>Descrição</Text>
        </View>
        <View style={styles.typeColumn}>
          <Text style={styles.columnHeader}>Tipo</Text>
        </View>
        <View style={styles.locationColumn}>
          <Text style={styles.columnHeader}>Localização</Text>
        </View>
        <View style={styles.dateColumn}>
          <Text style={styles.columnHeader}>Data</Text>
        </View>
        <View style={styles.selectColumn}>
          <Text style={styles.columnHeader}>Selecionar</Text>
        </View>
      </View>

      {evidences.map((evidence, index) => (
        <TouchableOpacity
          key={evidence.id}
          style={[
            styles.tableRow,
            index % 2 === 0 ? styles.evenRow : styles.oddRow,
            selectedEvidence === evidence.id && styles.selectedRow,
          ]}
          onPress={() => onSelectEvidence(evidence.id)}
          activeOpacity={0.7}
        >
          {/* Coluna da Descrição */}
          <View style={styles.titleColumn}>
            <Text style={styles.evidenceTitle} numberOfLines={2}>
              {evidence.description}
            </Text>
          </View>

          {/* Coluna do Tipo */}
          <View style={styles.typeColumn}>
            <View
              style={[
                styles.typeBadge,
                { backgroundColor: `${getTypeColor(evidence)}15` },
              ]}
            >
              <MaterialIcons
                name={getTypeIcon(evidence)}
                size={12}
                color={getTypeColor(evidence)}
                style={styles.typeIcon}
              />
              <Text
                style={[styles.typeText, { color: getTypeColor(evidence) }]}
              >
                {formatType(evidence)}
              </Text>
            </View>
          </View>

          {/* Coluna da Localização */}
          <View style={styles.locationColumn}>
            <Text style={styles.locationText} numberOfLines={1}>
              {evidence.location ? "GPS" : "N/A"}
            </Text>
          </View>

          {/* Coluna da Data */}
          <View style={styles.dateColumn}>
            <Text style={styles.dateText}>
              {formatDate(evidence.createdAt)}
            </Text>
          </View>

          {/* Coluna de Seleção */}
          <View style={styles.selectColumn}>
            <RadioButton
              value={evidence.id}
              status={
                selectedEvidence === evidence.id ? "checked" : "unchecked"
              }
              onPress={() => onSelectEvidence(evidence.id)}
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
  titleColumn: {
    flex: 2,
    paddingRight: 8,
  },
  typeColumn: {
    flex: 1.2,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  locationColumn: {
    flex: 1,
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
  evidenceTitle: {
    fontSize: 12,
    fontWeight: "500",
    color: "#333",
    lineHeight: 16,
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
    minWidth: 60,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  typeIcon: {
    marginRight: 4,
  },
  typeText: {
    fontSize: 9,
    fontWeight: "600",
    textAlign: "center",
  },
  locationText: {
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

export default EvidenceTable;
