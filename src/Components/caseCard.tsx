import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card, Button } from "react-native-paper";
import { useRouter } from "expo-router";

interface CaseCardProps {
  title: string;
  type: string;
  creator: string;
  status: string;
  openingdate: string;
  id?: string;
}

const CaseCard: React.FC<CaseCardProps> = ({
  title,
  type,
  creator,
  status,
  openingdate,
  id,
}) => {
  const router = useRouter();

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
        params: { id },
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
            <Text style={styles.detailLabel}>Status:</Text>
            <Text style={[styles.statusValue, { color: getStatusColor() }]}>
              {status}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Data de abertura:</Text>
            <Text style={styles.detailValue}>{openingdate}</Text>
          </View>
        </View>

        <Card.Actions style={styles.actions}>
          <Button
            icon="eye"
            mode="contained"
            buttonColor="#000"
            textColor="#FFF"
            style={styles.button}
            labelStyle={styles.buttonLabel}
            compact
            onPress={handleViewCase} // Adicione o evento de navegação
          >
            Ver caso
          </Button>
        </Card.Actions>
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
    padding: 16,
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
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
  actions: {
    justifyContent: "center",
    padding: 0,
    margin: 0,
    minWidth: 100,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 2,
    height: 40,
  },
  buttonLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
});

export default CaseCard;
