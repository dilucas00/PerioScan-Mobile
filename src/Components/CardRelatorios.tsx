import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Card } from "react-native-paper";

interface CardRelatoriosProps {}

const CardRelatorios: React.FC<CardRelatoriosProps> = (props) => {
  // Adicione a lógica e a estrutura do seu card de relatórios aqui
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.title}>Relatórios</Text>

        <Text>Detalhes sobre os relatórios serão exibidos aqui.</Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
});

export default CardRelatorios;
