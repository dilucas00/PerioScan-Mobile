import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';

interface CardEvidenceProps {
  // Defina as props necessárias para o card de evidências aqui
  // Exemplo: title: string; items: Array<{ label: string; value: string }>;
}

const CardEvidence: React.FC<CardEvidenceProps> = (props) => {
  // Adicione a lógica e a estrutura do seu card de evidências aqui
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.title}>Evidências</Text>
        {/* Conteúdo do card de evidências */}
        <Text>Detalhes sobre as evidências serão exibidos aqui.</Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
});

export default CardEvidence;