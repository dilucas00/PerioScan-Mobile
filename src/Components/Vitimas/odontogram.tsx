"use client";

import type React from "react";
import { useState } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Text, Card } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import ToothModal from "./toothModal";

interface ToothData {
  number: number;
  status: "presente" | "ausente" | "implante" | "protese";
  rootCanal?: boolean;
  crown?: string;
  restorations?: string[];
  wear?: string;
  fractures?: string;
  annotations?: string;
  lastUpdate?: string;
}

interface OdontogramProps {
  victimId: string;
  teeth: ToothData[];
  onUpdateTooth: (
    toothNumber: number,
    data: Partial<ToothData>
  ) => Promise<void>;
  loading?: boolean;
}

const Odontogram: React.FC<OdontogramProps> = ({
  victimId,
  teeth,
  onUpdateTooth,
  loading = false,
}) => {
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Verificar se victimId está presente
  if (!victimId) {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Odontograma</Text>
          <Text style={styles.subtitle}>
            Selecione uma vítima para visualizar o odontograma
          </Text>
        </Card.Content>
      </Card>
    );
  }

  // Definir a estrutura dos dentes conforme notação FDI
  const upperTeeth = [
    [18, 17, 16, 15, 14, 13, 12, 11], // Quadrante superior direito
    [21, 22, 23, 24, 25, 26, 27, 28], // Quadrante superior esquerdo
  ];

  const lowerTeeth = [
    [48, 47, 46, 45, 44, 43, 42, 41], // Quadrante inferior direito
    [31, 32, 33, 34, 35, 36, 37, 38], // Quadrante inferior esquerdo
  ];

  const getToothData = (toothNumber: number): ToothData => {
    return (
      teeth.find((tooth) => tooth.number === toothNumber) || {
        number: toothNumber,
        status: "presente",
      }
    );
  };

  const getToothColor = (tooth: ToothData) => {
    switch (tooth.status) {
      case "ausente":
        return "#FF5252"; // Vermelho
      case "implante":
        return "#2196F3"; // Azul
      case "protese":
        return "#FF9800"; // Laranja
      case "presente":
      default:
        if (tooth.rootCanal) return "#9C27B0"; // Roxo para canal
        if (tooth.restorations && tooth.restorations.length > 0)
          return "#4CAF50"; // Verde para restauração
        return "#E0E0E0"; // Cinza padrão
    }
  };

  const getToothIcon = (tooth: ToothData) => {
    switch (tooth.status) {
      case "ausente":
        return "close";
      case "implante":
        return "build";
      case "protese":
        return "star";
      case "presente":
      default:
        if (tooth.rootCanal) return "healing";
        if (tooth.restorations && tooth.restorations.length > 0)
          return "check-circle";
        return null;
    }
  };

  const handleToothPress = (toothNumber: number) => {
    setSelectedTooth(toothNumber);
    setModalVisible(true);
  };

  const handleToothUpdate = async (data: Partial<ToothData>) => {
    if (selectedTooth) {
      await onUpdateTooth(selectedTooth, data);
      setModalVisible(false);
      setSelectedTooth(null);
    }
  };

  const renderTooth = (toothNumber: number) => {
    const tooth = getToothData(toothNumber);
    const color = getToothColor(tooth);
    const icon = getToothIcon(tooth);

    return (
      <TouchableOpacity
        key={toothNumber}
        style={[styles.tooth, { backgroundColor: color }]}
        onPress={() => handleToothPress(toothNumber)}
        disabled={loading}
      >
        <Text style={styles.toothNumber}>{toothNumber}</Text>
        {icon && (
          <MaterialIcons
            name={icon}
            size={12}
            color="#FFF"
            style={styles.toothIcon}
          />
        )}
      </TouchableOpacity>
    );
  };

  const renderQuadrant = (teeth: number[], title: string) => (
    <View style={styles.quadrant}>
      <Text style={styles.quadrantTitle}>{title}</Text>
      <View style={styles.teethRow}>
        {teeth.map((toothNumber) => renderTooth(toothNumber))}
      </View>
    </View>
  );

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <Text style={styles.title}>Odontograma</Text>
          <Text style={styles.subtitle}>
            Clique em um dente para editar suas informações
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scrollContainer}
        >
          <View style={styles.odontogramContainer}>
            {/* Dentes superiores */}
            <View style={styles.upperTeeth}>
              {renderQuadrant(upperTeeth[0], "Superior Direito")}
              {renderQuadrant(upperTeeth[1], "Superior Esquerdo")}
            </View>

            {/* Linha divisória */}
            <View style={styles.divider} />

            {/* Dentes inferiores */}
            <View style={styles.lowerTeeth}>
              {renderQuadrant(lowerTeeth[0], "Inferior Direito")}
              {renderQuadrant(lowerTeeth[1], "Inferior Esquerdo")}
            </View>
          </View>
        </ScrollView>

        {/* Legenda */}
        <View style={styles.legend}>
          <Text style={styles.legendTitle}>Legenda:</Text>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendColor, { backgroundColor: "#E0E0E0" }]}
              />
              <Text style={styles.legendText}>Normal</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendColor, { backgroundColor: "#4CAF50" }]}
              />
              <Text style={styles.legendText}>Restauração</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendColor, { backgroundColor: "#9C27B0" }]}
              />
              <Text style={styles.legendText}>Canal</Text>
            </View>
          </View>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendColor, { backgroundColor: "#FF5252" }]}
              />
              <Text style={styles.legendText}>Ausente</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendColor, { backgroundColor: "#2196F3" }]}
              />
              <Text style={styles.legendText}>Implante</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendColor, { backgroundColor: "#FF9800" }]}
              />
              <Text style={styles.legendText}>Prótese</Text>
            </View>
          </View>
        </View>
      </Card.Content>

      {/* Modal para editar dente */}
      <ToothModal
        visible={modalVisible}
        onDismiss={() => {
          setModalVisible(false);
          setSelectedTooth(null);
        }}
        toothNumber={selectedTooth}
        toothData={selectedTooth ? getToothData(selectedTooth) : null}
        onSave={handleToothUpdate}
        loading={loading}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  scrollContainer: {
    marginBottom: 20,
  },
  odontogramContainer: {
    alignItems: "center",
    paddingHorizontal: 10,
  },
  upperTeeth: {
    flexDirection: "row",
    marginBottom: 10,
  },
  lowerTeeth: {
    flexDirection: "row",
    marginTop: 10,
  },
  quadrant: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  quadrantTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  teethRow: {
    flexDirection: "row",
    gap: 4,
  },
  tooth: {
    width: 35,
    height: 35,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CCC",
    position: "relative",
  },
  toothNumber: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#333",
  },
  toothIcon: {
    position: "absolute",
    top: 2,
    right: 2,
  },
  divider: {
    width: "100%",
    height: 2,
    backgroundColor: "#E0E0E0",
    marginVertical: 10,
  },
  legend: {
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 4,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginRight: 6,
    borderWidth: 1,
    borderColor: "#CCC",
  },
  legendText: {
    fontSize: 11,
    color: "#666",
  },
});

export default Odontogram;
