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
          <View style={styles.infoRow} key={idx}>
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
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
    width: 120,
  },
  value: {
    fontSize: 14,
    color: "#333",
    flex: 1,
    textAlign: "right",
  },
  descricaoText: {
    fontSize: 14,
    color: "#333",
    marginTop: 8,
    lineHeight: 20,
  },
});

export default CaseDetailCard;
