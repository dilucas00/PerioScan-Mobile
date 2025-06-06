import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Button, Appbar } from "react-native-paper";
import { useRouter, useLocalSearchParams } from "expo-router";
import CaseDetailCard from "../../../Components/caseDetailCard";

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
    descricao:
      "Descrição detalhada do caso. Aqui você pode colocar informações adicionais sobre o caso, contexto, observações ou qualquer outro detalhe relevante.",
  };

  const generalInfoItems = [
    { label: "ID do caso:", value: caseData.id },
    { label: "Título:", value: caseData.title },
    { label: "Data de Abertura:", value: caseData.openDate },
    { label: "Data da Ocorrência:", value: caseData.occurrenceDate },
    { label: "Local:", value: caseData.location },
    { label: "Status:", value: caseData.status },
    { label: "Criado por:", value: caseData.createdBy },
    { label: "Tipo:", value: caseData.type },
  ];

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
          <>
            <CaseDetailCard
              title="Informações Gerais"
              items={generalInfoItems}
            />
            <CaseDetailCard
              title="Descrição do Caso"
              description={caseData.descricao}
            />
          </>
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
});
