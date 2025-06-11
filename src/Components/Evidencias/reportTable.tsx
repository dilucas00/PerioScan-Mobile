import type React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Text, RadioButton } from "react-native-paper";

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
      year: "2-digit",
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
        <View style={styles.titleColumn}>
          <Text style={styles.columnHeader}>Título</Text>
        </View>
        <View style={styles.statusColumn}>
          <Text style={styles.columnHeader}>Status</Text>
        </View>
        <View style={styles.dateColumn}>
          <Text style={styles.columnHeader}>Data</Text>
        </View>
        <View style={styles.selectColumn}>
          <Text style={styles.columnHeader}>Selecionar</Text>
        </View>
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
          {/* Coluna do Título */}
          <View style={styles.titleColumn}>
            <Text style={styles.reportTitle} numberOfLines={2}>
              {report.title}
            </Text>
          </View>

          {/* Coluna do Status */}
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

          {/* Coluna da Data */}
          <View style={styles.dateColumn}>
            <Text style={styles.dateText}>{formatDate(report.createdAt)}</Text>
          </View>

          {/* Coluna de Seleção - Movida para a direita */}
          <View style={styles.selectColumn}>
            <RadioButton
              value={report.id}
              status={selectedReport === report.id ? "checked" : "unchecked"}
              onPress={() => onSelectReport(report.id)}
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
    flex: 2.5,
    paddingRight: 8,
  },
  statusColumn: {
    flex: 1.3,
    alignItems: "center",
    justifyContent: "center",
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
  reportTitle: {
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
  },
  statusText: {
    fontSize: 9,
    fontWeight: "600",
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

export default ReportTable;
