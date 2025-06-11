"use client";

import type React from "react";
import { useState } from "react";
import { StyleSheet, Alert } from "react-native";
import { Text, Card, Button } from "react-native-paper";
import ReportTable from "./Evidencias/reportTable";
import ReportActionButtons from "./Evidencias/reportActionButtons";
import ReportModal from "./Evidencias/ReportModal";
import { useReports } from "../services/useReports";

interface CardRelatoriosProps {
  caseId?: string;
}

const CardRelatorios: React.FC<CardRelatoriosProps> = ({ caseId }) => {
  const { reports, loading, fetchReports, createReport, deleteReport } =
    useReports(caseId);

  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [methodology, setMethodology] = useState("");
  const [conclusion, setConclusion] = useState("");
  const [status, setStatus] = useState("rascunho");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
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

  const handleViewReport = () => {
    if (!selectedReport) {
      Alert.alert("Atenção", "Selecione um relatório para visualizar");
      return;
    }
    Alert.alert(
      "Visualizar Relatório",
      `Visualizando relatório ${selectedReport}`
    );
  };

  const handleDeleteReport = () => {
    if (!selectedReport) {
      Alert.alert("Atenção", "Selecione um relatório para excluir");
      return;
    }

    Alert.alert(
      "Excluir Relatório",
      "Tem certeza que deseja excluir este relatório?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteReport(selectedReport);
              Alert.alert("Sucesso", "Relatório excluído com sucesso");
              setSelectedReport(null);
              fetchReports();
            } catch (error: any) {
              Alert.alert("Erro", error.message || "Erro ao excluir relatório");
            }
          },
        },
      ]
    );
  };

  const handleSelectReport = (reportId: string) => {
    setSelectedReport(selectedReport === reportId ? null : reportId);
  };

  const handleModalDismiss = () => {
    setModalVisible(false);
    resetForm();
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.title}>Relatórios</Text>
        <Text style={styles.description}>
          Gerencie os relatórios periciais relacionados a este caso.
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
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    paddingBottom: 16,
    marginTop: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
