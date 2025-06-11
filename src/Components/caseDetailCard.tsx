import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Card, Divider } from "react-native-paper";

type CaseDetailCardProps = {
  title: string;
  items?: { label: string; value: string }[];
  description?: string;
};

const CaseDetailCard: React.FC<CaseDetailCardProps> = ({
  title,
  items,
  description,
}) => (
  <Card style={styles.card}>
    <Card.Content>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Divider style={styles.divider} />
      {items &&
        items.map((item, idx) => (
          <View style={styles.infoColumn} key={idx}>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.value}>{item.value}</Text>
          </View>
        ))}
      {description && <Text style={styles.descricaoText}>{description}</Text>}
    </Card.Content>
  </Card>
);

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 24,
    marginBottom: 16,
    backgroundColor: "#fff",
    elevation: 2,
    borderRadius: 10,
    padding: 8,
  },
  sectionTitle: {
    marginBottom: 8,
    fontWeight: "bold",
    fontSize: 16,
    color: "#000",
  },
  divider: {
    marginBottom: 16,
  },
  // Agora em coluna (label em cima, value embaixo)
  infoColumn: {
    flexDirection: "column",
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    color: "#000000", // Alterado para preto
    // deixa o texto quebrar linha se for muito longo
    flexWrap: "wrap",
  },
  descricaoText: {
    fontSize: 14,
    color: "#333",
    marginTop: 8,
    lineHeight: 20,
  },
});

export default CaseDetailCard;
