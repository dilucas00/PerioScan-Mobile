"use client";

import { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Appbar } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CaseDetailCard from "../../../Components/Casos/caseDetailCard";
import FiltroButton from "../../../Components/FiltroButton";
import CardEvidence from "../../../Components/CardEvidence";
import CardRelatorios from "../../../Components/CardRelatorios";
import DeleteCaseModal from "../../../Components/Casos/deleteCaseModal";

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
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

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

  const handleDeleteCase = async () => {
    setDeleteLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert(
          "Erro",
          "Você precisa estar autenticado para excluir casos"
        );
        return;
      }

      console.log("Excluindo caso:", caseData.id);
      const response = await fetch(
        `https://perioscan-back-end-fhhq.onrender.com/api/cases/${caseData.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Erro ${response.status}: ${response.statusText}`
        );
      }

      console.log("Caso excluído com sucesso");

      // Fechar modal imediatamente
      setDeleteModalVisible(false);

      // Navegar de volta para a lista de casos
      router.replace("/Cases");

      // Mostrar mensagem de sucesso após um pequeno delay para garantir que a navegação aconteceu
      setTimeout(() => {
        Alert.alert(
          "Sucesso",
          `O caso "${caseData.title}" foi excluído com sucesso!`,
          [{ text: "OK" }]
        );
      }, 500);
    } catch (error: any) {
      console.error("Erro ao excluir caso:", error);
      let userMessage = "Erro ao excluir caso";

      if (error.message) {
        if (error.message.includes("Failed to fetch")) {
          userMessage =
            "Erro de conexão. Verifique sua internet e tente novamente.";
        } else if (error.message.includes("401")) {
          userMessage = "Sessão expirada. Faça login novamente.";
        } else if (error.message.includes("403")) {
          userMessage = "Você não tem permissão para excluir este caso.";
        } else if (error.message.includes("404")) {
          userMessage = "Caso não encontrado.";
        } else if (error.message.includes("500")) {
          userMessage =
            "Erro interno do servidor. Tente novamente em alguns minutos.";
        } else {
          userMessage = error.message;
        }
      }

      Alert.alert("Erro", userMessage);
    } finally {
      setDeleteLoading(false);
    }
  };

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
              showDeleteButton={true}
              onDelete={() => setDeleteModalVisible(true)}
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

      {/* Modal de confirmação de exclusão */}
      <DeleteCaseModal
        visible={deleteModalVisible}
        onDismiss={() => setDeleteModalVisible(false)}
        onConfirm={handleDeleteCase}
        caseTitle={caseData.title}
        loading={deleteLoading}
      />
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
