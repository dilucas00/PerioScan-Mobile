import type React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Text } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";

interface Report {
  id: string;
  title: string;
  status: string;
  createdAt: string;
}

interface ReportTableProps {
  reports: Report[];
  loading: boolean;
  selectedReport: string | null;
  onSelectReport: (reportId: string) => void;
}

const ReportTable: React.FC<ReportTableProps> = ({
  reports,
  loading,
  selectedReport,
  onSelectReport,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <View style={styles.tableContainer}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#000" />
          <Text style={styles.loadingText}>Carregando relatórios...</Text>
        </View>
      </View>
    );
  }

  if (reports.length === 0) {
    return (
      <View style={styles.tableContainer}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum relatório registrado</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.tableContainer}>
      <View style={styles.tableHeader}>
        <Text style={[styles.columnHeader, styles.titleColumn]}>Título</Text>
        <Text style={[styles.columnHeader, styles.statusColumn]}>Status</Text>
        <Text style={[styles.columnHeader, styles.dateColumn]}>
          Data de Criação
        </Text>
      </View>

      {reports.map((report, index) => (
        <TouchableOpacity
          key={report.id}
          style={[
            styles.tableRow,
            index % 2 === 0 ? styles.evenRow : styles.oddRow,
            selectedReport === report.id && styles.selectedRow,
          ]}
          onPress={() => onSelectReport(report.id)}
          activeOpacity={0.7}
        >
          <View style={styles.titleColumn}>
            <Text style={styles.reportTitle} numberOfLines={2}>
              {report.title}
            </Text>
          </View>
          <View style={styles.statusColumn}>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    report.status === "finalizado" ? "#E8F5E9" : "#FFF3E0",
                },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  {
                    color:
                      report.status === "finalizado" ? "#2E7D32" : "#E65100",
                  },
                ]}
              >
                {report.status === "finalizado" ? "Finalizado" : "Rascunho"}
              </Text>
            </View>
          </View>
          <View style={styles.dateColumn}>
            <Text style={styles.dateText}>{formatDate(report.createdAt)}</Text>
          </View>
          {selectedReport === report.id && (
            <View style={styles.checkIcon}>
              <MaterialIcons name="check-circle" size={20} color="#000" />
            </View>
          )}
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
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F0F0F0",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  columnHeader: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#333",
  },
  titleColumn: {
    flex: 2.5,
  },
  statusColumn: {
    flex: 1.5,
    alignItems: "center",
  },
  dateColumn: {
    flex: 1.5,
    alignItems: "center",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: "center",
    minHeight: 60,
    position: "relative",
  },
  evenRow: {
    backgroundColor: "#FFFFFF",
  },
  oddRow: {
    backgroundColor: "#F9F9F9",
  },
  selectedRow: {
    backgroundColor: "#E3F2FD",
    borderLeftWidth: 4,
    borderLeftColor: "#000",
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    lineHeight: 18,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: "center",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  dateText: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
  },
  checkIcon: {
    position: "absolute",
    right: 16,
    top: "50%",
    marginTop: -10,
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

export default ReportTable;
