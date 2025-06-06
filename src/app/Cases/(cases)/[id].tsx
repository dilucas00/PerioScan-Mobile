import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Card, Divider, Button, Appbar } from "react-native-paper";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function CaseDetails() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params?.id as string;

  const [value, setValue] = useState("geral");

  const caseData = {
    id: id || "ID não recebido",
    title: "Título do caso " + (id || ""),
    openDate: "11/05/2025",
    occurrenceDate: "02/05/2025",
    location: "Local do caso",
    status: "finalizado",
    createdBy: "Admin",
    type: "Identificação de Vítima",
  };

  return (
    <View style={styles.mainContainer}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction color="#FFF" onPress={() => router.back()} />
        <Appbar.Content
          title="Detalhes do caso"
          titleStyle={styles.headerTitle}
        />
      </Appbar.Header>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.titleCardContainer}>
          <Text style={styles.titleContainerCard}>{caseData.title}</Text>
          <Button
            icon="pencil"
            mode="contained"
            buttonColor="#000"
            textColor="#FFF"
            style={styles.buttonEditarCaso}
            onPress={() => {}}
            compact
          >
            Editar caso
          </Button>
        </View>

        <View style={styles.filtroContainer}>
          <Button
            mode={value === "geral" ? "contained" : "outlined"}
            onPress={() => setValue("geral")}
            style={[
              styles.segmentedButton,
              value === "geral" && styles.segmentedButtonActive,
            ]}
            textColor={value === "geral" ? "#FFF" : "#000"}
          >
            Geral
          </Button>
          <Button
            mode={value === "evidências" ? "contained" : "outlined"}
            onPress={() => setValue("evidências")}
            style={[
              styles.segmentedButton,
              value === "evidências" && styles.segmentedButtonActive,
            ]}
            textColor={value === "evidências" ? "#FFF" : "#000"}
          >
            Evidências
          </Button>
          <Button
            mode={value === "relatórios" ? "contained" : "outlined"}
            onPress={() => setValue("relatórios")}
            style={[
              styles.segmentedButton,
              value === "relatórios" && styles.segmentedButtonActive,
            ]}
            textColor={value === "relatórios" ? "#FFF" : "#000"}
          >
            Relatórios
          </Button>
        </View>

        {value === "geral" && (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Informações Gerais</Text>
              <Divider style={styles.divider} />

              <View style={styles.infoRow}>
                <Text style={styles.label}>ID do caso:</Text>
                <Text style={styles.value}>{caseData.id}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Título:</Text>
                <Text style={styles.value}>{caseData.title}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Data de Abertura:</Text>
                <Text style={styles.value}>{caseData.openDate}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Data da Ocorrência:</Text>
                <Text style={styles.value}>{caseData.occurrenceDate}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Local:</Text>
                <Text style={styles.value}>{caseData.location}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Status:</Text>
                <Text style={styles.value}>{caseData.status}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Criado por:</Text>
                <Text style={styles.value}>{caseData.createdBy}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Tipo:</Text>
                <Text style={styles.value}>{caseData.type}</Text>
              </View>
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#000",
    elevation: 0,
    shadowOpacity: 0,
    height: 70,
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  titleCardContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
  },
  titleContainerCard: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  buttonEditarCaso: {
    marginLeft: "auto",
    borderRadius: 5,
    paddingVertical: 2,
    paddingHorizontal: 6,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  filtroContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  segmentedButton: {
    borderRadius: 5,
    borderColor: "#000",
    marginHorizontal: 2,
    minWidth: 90,
  },
  segmentedButtonActive: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
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
});
