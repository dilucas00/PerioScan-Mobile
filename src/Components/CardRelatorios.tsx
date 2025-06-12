"use client";

import type React from "react";
import { useState } from "react";
import { StyleSheet, Alert } from "react-native";
import { Text, Card, Button } from "react-native-paper";
import ReportTable from "./Evidencias/reportTable";
import ReportActionButtons from "./Evidencias/reportActionButtons";
import ReportModal from "./Evidencias/reportModal";
import ReportViewModal from "./Evidencias/reportViewModal";
import ConfirmationModal from "./Evidencias/confirmationModal";
import { useReports } from "../services/useReports";

interface CardRelatoriosProps {
  caseId?: string;
}

const CardRelatorios: React.FC<CardRelatoriosProps> = ({ caseId }) => {
  const {
    reports,
    loading,
    fetchReports,
    getReportById,
    createReport,
    deleteReport,
  } = useReports(caseId);

  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [methodology, setMethodology] = useState("");
  const [conclusion, setConclusion] = useState("");
  const [status, setStatus] = useState("rascunho");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [viewingReport, setViewingReport] = useState<any>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) newErrors.title = "Título é obrigatório";
    if (!content.trim()) newErrors.content = "Conteúdo é obrigatório";
    if (!caseId) newErrors.case = "ID do caso é obrigatório";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitLoading(true);
    try {
      await createReport({
        title,
        content,
        case: caseId!,
        methodology: methodology || undefined,
        conclusion: conclusion || undefined,
        status,
        attachments: [],
      });

      Alert.alert("Sucesso", "Relatório gerado com sucesso!");
      resetForm();
      setModalVisible(false);
      fetchReports();
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao gerar relatório");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleGenerateWithAI = () => {
    Alert.alert(
      "Funcionalidade em desenvolvimento",
      "A geração de relatórios com IA será implementada em breve."
    );
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setMethodology("");
    setConclusion("");
    setStatus("rascunho");
    setErrors({});
  };

  const handleViewReport = async () => {
    console.log("handleViewReport chamado, selectedReport:", selectedReport);

    if (!selectedReport) {
      Alert.alert("Atenção", "Selecione um relatório para visualizar");
      return;
    }

    try {
      console.log("Buscando relatório para visualização...");
      const report = await getReportById(selectedReport);
      console.log("Relatório obtido:", report);

      if (report) {
        setViewingReport(report);
        setViewModalVisible(true);
        console.log("Modal de visualização aberto");
      } else {
        Alert.alert("Erro", "Não foi possível carregar o relatório");
      }
    } catch (error: any) {
      console.error("Erro ao visualizar relatório:", error);
      Alert.alert("Erro", error.message || "Erro ao carregar relatório");
    }
  };

  const handleDeleteReport = () => {
    console.log("handleDeleteReport chamado, selectedReport:", selectedReport);

    if (!selectedReport) {
      Alert.alert("Atenção", "Selecione um relatório para excluir");
      return;
    }

    console.log("Abrindo modal de confirmação");
    setConfirmDeleteVisible(true);
  };

  const confirmDelete = async () => {
    if (!selectedReport) return;

    console.log("Confirmando exclusão do relatório:", selectedReport);
    setDeleteLoading(true);

    try {
      await deleteReport(selectedReport);
      Alert.alert("Sucesso", "Relatório excluído com sucesso");
      setSelectedReport(null);
      setConfirmDeleteVisible(false);
      fetchReports();
    } catch (error: any) {
      console.error("Erro ao excluir relatório:", error);
      Alert.alert("Erro", error.message || "Erro ao excluir relatório");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSelectReport = (reportId: string) => {
    console.log("Selecionando relatório:", reportId);
    // Se clicar no mesmo relatório, deseleciona. Se clicar em outro, seleciona o novo
    const newSelection = selectedReport === reportId ? null : reportId;
    setSelectedReport(newSelection);
    console.log("Relatório selecionado:", newSelection);
  };

  const handleModalDismiss = () => {
    setModalVisible(false);
    resetForm();
  };

  const getSelectedReportTitle = () => {
    const report = reports.find((r) => r.id === selectedReport);
    return report?.title || "este relatório";
  };

  // Debug: Log do estado atual
  console.log("Estado atual do CardRelatorios:", {
    caseId,
    reportsCount: reports.length,
    selectedReport,
    loading,
  });

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.title}>Relatórios</Text>
        <Text style={styles.description}>
          Gerencie os relatórios periciais relacionados a este caso. Selecione
          um relatório para visualizar ou excluir.
        </Text>

        <ReportTable
          reports={reports}
          loading={loading}
          selectedReport={selectedReport}
          onSelectReport={handleSelectReport}
        />

        <ReportActionButtons
          selectedReport={selectedReport}
          onViewReport={handleViewReport}
          onDeleteReport={handleDeleteReport}
          showButtons={reports.length > 0}
        />

        <Button
          mode="contained"
          onPress={() => setModalVisible(true)}
          style={styles.generateButton}
          icon="file-document-edit"
          buttonColor="#000"
          textColor="#FFF"
        >
          Gerar Relatório
        </Button>
      </Card.Content>

      <ReportModal
        visible={modalVisible}
        onDismiss={handleModalDismiss}
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        methodology={methodology}
        setMethodology={setMethodology}
        conclusion={conclusion}
        setConclusion={setConclusion}
        status={status}
        setStatus={setStatus}
        errors={errors}
        setErrors={setErrors}
        loading={submitLoading}
        onSubmit={handleSubmit}
        onGenerateWithAI={handleGenerateWithAI}
      />

      <ReportViewModal
        visible={viewModalVisible}
        onDismiss={() => {
          console.log("Fechando modal de visualização");
          setViewModalVisible(false);
          setViewingReport(null);
        }}
        report={viewingReport}
        onEdit={() => {
          Alert.alert(
            "Em desenvolvimento",
            "Funcionalidade de edição será implementada em breve"
          );
        }}
      />

      <ConfirmationModal
        visible={confirmDeleteVisible}
        onDismiss={() => {
          console.log("Fechando modal de confirmação");
          setConfirmDeleteVisible(false);
        }}
        onConfirm={confirmDelete}
        title="Excluir Relatório"
        message={`Tem certeza que deseja excluir "${getSelectedReportTitle()}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        type="danger"
        loading={deleteLoading}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    padding: 16,
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    lineHeight: 20,
  },
  generateButton: {
    marginTop: 20,
    borderRadius: 8,
    paddingVertical: 4,
  },
});

export default CardRelatorios;
