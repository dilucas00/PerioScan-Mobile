import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card, Button } from "react-native-paper";
import { useRouter } from "expo-router";

// Função para formatar a data
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Data inválida";
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Data inválida";
  }
};

interface CaseCardProps {
  id?: string;
  title: string;
  type: string;
  creator: string;
  status: string;
  openingdate: string;
  occurrenceDate?: string;
  location?: string;
  descricao?: string;
}

const CaseCard: React.FC<CaseCardProps> = ({
  title,
  type,
  creator,
  status,
  openingdate: rawOpeningDate,
  id,
  occurrenceDate: rawOccurrenceDate,
  location,
  descricao,
}) => {
  const router = useRouter();

  const openingdate = formatDate(rawOpeningDate);
  const occurrenceDate = formatDate(rawOccurrenceDate);

  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case "em andamento":
        return "#B99F81";
      case "finalizado":
        return "#9BBA78";
    }
  };

  const handleViewCase = () => {
    if (id) {
      router.push({
        pathname: "/Cases/(cases)/[id]",
        params: {
          id,
          title,
          openDate: openingdate,
          occurrenceDate: occurrenceDate,
          location: location || "N/A",
          status,
          createdBy: creator,
          type,
          descricao: descricao || "N/A",
        },
      });
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
            {title}
          </Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Tipo:</Text>
            <Text style={styles.detailValue}>{type}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Criador:</Text>
            <Text style={styles.detailValue}>{creator}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Data de abertura:</Text>
            <Text style={styles.detailValue}>{openingdate}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status:</Text>
            <Text style={[styles.statusValue, { color: getStatusColor() }]}>
              {status}
            </Text>
          </View>
        </View>
        <View style={styles.actionsContainer}>
          <Button
            icon="eye"
            mode="contained"
            buttonColor="#000"
            textColor="#FFF"
            style={styles.button}
            labelStyle={styles.buttonLabel}
            compact
            onPress={handleViewCase}
          >
            Ver caso
          </Button>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  textContainer: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
    lineHeight: 18,
    width: "100%",
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 6,
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 13,
    color: "#666",
    width: 70,
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 13,
    color: "#333",
    flex: 1,
  },
  statusValue: {
    fontSize: 13,
    fontWeight: "bold",
    flex: 1,
  },
  actionsContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    borderRadius: 8,
    height: 40,
    justifyContent: "center",
  },
  buttonLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginHorizontal: 8,
  },
});

export default CaseCard;
