"use client";

import { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Appbar, Text } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CaseDetailCard from "../../../Components/Casos/caseDetailCard";
import FiltroButton from "../../../Components/FiltroButton";
import CardEvidence from "../../../Components/CardEvidence";
import CardRelatorios from "../../../Components/CardRelatorios";
import DeleteCaseModal from "../../../Components/Casos/deleteCaseModal";
import EditCaseModal from "../../../Components/Casos/editCaseModal";

export default function CaseDetails() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id } = params as { id: string };

  const [value, setValue] = useState("geral");
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [caseData, setCaseData] = useState({
    id: id || "ID não recebido",
    title: "Carregando...",
    openDate: "Carregando...",
    occurrenceDate: "Carregando...",
    location: "Carregando...",
    status: "Carregando...",
    createdBy: "Carregando...",
    type: "Carregando...",
    description: "Carregando...",
  });

  // Função para formatar data do servidor para exibição
  const formatDateForDisplay = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "N/A";
      return date.toLocaleDateString("pt-BR");
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return "N/A";
    }
  };

  // Função para buscar dados atualizados do servidor
  const fetchCaseData = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Erro", "Você precisa estar autenticado");
        router.replace("/Login");
        return;
      }

      console.log("Buscando dados do caso:", id);
      const response = await fetch(
        `https://perioscan-back-end-fhhq.onrender.com/api/cases/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Dados do caso recebidos:", data);

      // Normalizar os dados recebidos
      const caseInfo = data.data || data;
      const updatedCaseData = {
        id: caseInfo.id || caseInfo._id || id,
        title: caseInfo.title || "Título não disponível",
        openDate: formatDateForDisplay(caseInfo.openDate || caseInfo.createdAt),
        occurrenceDate: formatDateForDisplay(caseInfo.occurrenceDate),
        location: caseInfo.location || "Local não disponível",
        status: caseInfo.status || "Status não disponível",
        createdBy: caseInfo.createdBy?.name || "Criador não disponível",
        type: caseInfo.type || "Tipo não disponível",
        description: caseInfo.description || "Descrição não disponível",
      };

      setCaseData(updatedCaseData);
    } catch (error: any) {
      console.error("Erro ao buscar dados do caso:", error);
      Alert.alert("Erro", error.message || "Erro ao carregar dados do caso");
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados quando o componente montar
  useEffect(() => {
    if (id) {
      fetchCaseData();
    }
  }, [id]);

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

  const handleEditCase = async (updatedCase: any) => {
    console.log("Caso atualizado:", updatedCase);

    try {
      // Primeiro, recarregar os dados do servidor para garantir que temos as informações mais atuais
      await fetchCaseData();

      // Depois de atualizar os dados, mostrar a mensagem de sucesso
      Alert.alert("Sucesso", "Caso atualizado com sucesso!", [
        {
          text: "OK",
        },
      ]);
    } catch (error) {
      console.error("Erro ao recarregar dados após edição:", error);
      Alert.alert(
        "Aviso",
        "Caso foi editado, mas houve um problema ao recarregar os dados. Tente atualizar a página."
      );
    }
  };

  // Função para converter data de exibição para formato ISO (para o modal de edição)
  const convertDateForEdit = (displayDate: string): string | undefined => {
    if (
      !displayDate ||
      displayDate === "N/A" ||
      displayDate === "Carregando..."
    ) {
      return undefined;
    }

    try {
      // Se a data está no formato dd/mm/yyyy, converter para ISO
      const parts = displayDate.split("/");
      if (parts.length === 3) {
        const [day, month, year] = parts;
        const isoDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
          2,
          "0"
        )}`;
        const date = new Date(isoDate);
        if (!isNaN(date.getTime())) {
          return date.toISOString();
        }
      }
      return undefined;
    } catch (error) {
      console.error("Erro ao converter data:", error);
      return undefined;
    }
  };

  // Preparar dados para o modal de edição
  const getEditCaseData = () => ({
    id: caseData.id,
    title: caseData.title,
    description: caseData.description,
    type: caseData.type,
    location: caseData.location,
    status: caseData.status,
    occurrenceDate: convertDateForEdit(caseData.occurrenceDate),
  });

  if (loading) {
    return (
      <View style={styles.mainContainer}>
        <Appbar.Header style={styles.header}>
          <Appbar.BackAction
            color="#000000"
            onPress={() => router.replace("/Cases")}
          />
          <Appbar.Content
            title="Carregando..."
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
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loadingText}>Carregando dados do caso...</Text>
        </View>
      </View>
    );
  }

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
              description={caseData.description}
            />
          </>
        )}

        {value === "evidências" && <CardEvidence caseId={caseData.id} />}

        {value === "relatórios" && <CardRelatorios caseId={caseData.id} />}
      </ScrollView>

      {/* Botão flutuante de editar - só aparece na aba "geral" */}
      {value === "geral" && (
        <TouchableOpacity
          style={styles.floatingEditButton}
          onPress={() => setEditModalVisible(true)}
        >
          <MaterialIcons name="edit" size={28} color="#FFF" />
        </TouchableOpacity>
      )}

      {/* Modal de confirmação de exclusão */}
      <DeleteCaseModal
        visible={deleteModalVisible}
        onDismiss={() => setDeleteModalVisible(false)}
        onConfirm={handleDeleteCase}
        caseTitle={caseData.title}
        loading={deleteLoading}
      />

      {/* Modal de edição de caso */}
      <EditCaseModal
        visible={editModalVisible}
        onDismiss={() => setEditModalVisible(false)}
        onConfirm={handleEditCase}
        caseData={getEditCaseData()}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
  },
  loadingText: {
    marginTop: 16,
    color: "#666",
    fontSize: 16,
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
