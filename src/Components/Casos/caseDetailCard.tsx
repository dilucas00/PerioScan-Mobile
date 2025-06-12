import type React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Card, Divider } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";

type CaseDetailCardProps = {
  title: string;
  items?: { label: string; value: string }[];
  description?: string;
  showDeleteButton?: boolean;
  onDelete?: () => void;
};

const CaseDetailCard: React.FC<CaseDetailCardProps> = ({
  title,
  items,
  description,
  showDeleteButton = false,
  onDelete,
}) => (
  <Card style={styles.card}>
    <Card.Content>
      <View style={styles.headerContainer}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {showDeleteButton && onDelete && (
          <TouchableOpacity
            style={styles.deleteButtonContainer}
            onPress={onDelete}
          >
            <View style={styles.deleteButton}>
              <MaterialIcons name="delete-forever" size={25} color="#FFF" />
            </View>
            <Text style={styles.deleteButtonText}>Deletar caso</Text>
          </TouchableOpacity>
        )}
      </View>

      <Divider style={styles.divider} />

      {items && (
        <View style={styles.itemsContainer}>
          {items.map((item, idx) => (
            <View style={styles.infoRow} key={idx}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>{item.label}</Text>
              </View>
              <View style={styles.valueContainer}>
                <Text style={styles.value}>{item.value}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {description && (
        <View style={styles.descriptionContainer}>
          <Text style={styles.descricaoText}>{description}</Text>
        </View>
      )}
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
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#000",
    flex: 1,
  },
  deleteButtonContainer: {
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#DC2626",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  deleteButtonText: {
    fontSize: 10,
    color: "#666",
    marginTop: 4,
  },
  divider: {
    marginBottom: 16,
  },
  itemsContainer: {
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    minHeight: 24,
  },
  labelContainer: {
    flex: 0.4,
    paddingRight: 12,
  },
  valueContainer: {
    flex: 0.6,
  },
  label: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
    lineHeight: 20,
  },
  value: {
    fontSize: 14,
    color: "#000",
    fontWeight: "400",
    lineHeight: 20,
    flexWrap: "wrap",
  },
  descriptionContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#000",
  },
  descricaoText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    textAlign: "justify",
  },
});

export default CaseDetailCard;
