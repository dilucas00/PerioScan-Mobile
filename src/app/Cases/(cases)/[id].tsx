"use client";

import { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Appbar } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import CaseDetailCard from "../../../Components/caseDetailCard";
import FiltroButton from "../../../Components/FiltroButton";
import CardEvidence from "../../../Components/CardEvidence";
import CardRelatorios from "../../../Components/CardRelatorios";

export default function CaseDetails() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const {
    id,
    title,
    openDate,
    occurrenceDate,
    location,
    status,
    createdBy,
    type,
    descricao,
  } = params as {
    id: string;
    title: string;
    openDate: string;
    occurrenceDate: string;
    location: string;
    status: string;
    createdBy: string;
    type: string;
    descricao: string;
  };

  const [value, setValue] = useState("geral");

  const caseData = {
    id: id || "ID não recebido",
    title: title || "Título não recebido",
    openDate: openDate || "Data de abertura não recebida",
    occurrenceDate: occurrenceDate || "Data de ocorrência não recebida",
    location: location || "Local não recebido",
    status: status || "Status não recebido",
    createdBy: createdBy || "Criador não recebido",
    type: type || "Tipo não recebido",
    descricao: descricao || "Descrição não recebida",
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
        <Appbar.BackAction
          color="#000000"
          onPress={() => router.replace("/Cases")}
        />
        <Appbar.Content
          title="Detalhes do caso"
          titleStyle={[
            styles.headerTitle,
            {
              textAlign: "center",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 30,
            },
          ]}
        />
      </Appbar.Header>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
      >
        <FiltroButton
          value={value}
          onValueChange={setValue}
          opcoes={[
            { value: "geral", label: "Geral" },
            { value: "evidências", label: "Evidências" },
            { value: "relatórios", label: "Relatórios" },
          ]}
        />

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

        {value === "evidências" && <CardEvidence />}

        {value === "relatórios" && <CardRelatorios caseId={caseData.id} />}
      </ScrollView>

      {/* Botão flutuante de editar */}
      <TouchableOpacity
        style={styles.floatingEditButton}
        onPress={() => {
          console.log("Editar caso clicado");
        }}
      >
        <MaterialIcons name="edit" size={28} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#F7F7F7f",
    marginBottom: 60,
  },
  header: {
    backgroundColor: "#F7F7F7",
    elevation: 0,
    shadowOpacity: 0,
    height: 70,
  },
  headerTitle: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "bold",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  // titleCardContainer: {
  //   paddingHorizontal: 24,
  //   paddingBottom: 16,
  //   marginTop: 24,
  //   alignItems: "center",
  // },
  // titleContainerCard: {
  //   fontSize: 15,
  //   fontWeight: "600",
  //   color: "#333",
  //   textAlign: "center",
  // },

  // Estilo do botão flutuante de editar
  floatingEditButton: {
    backgroundColor: "#000",
    width: 56,
    height: 56,
    borderRadius: 28,
    position: "absolute",
    bottom: 40,
    right: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
});
