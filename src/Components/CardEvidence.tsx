"use client";

import type React from "react";
import { useState } from "react";
import { StyleSheet, Alert } from "react-native";
import { Text, Card, Button } from "react-native-paper";
import EvidenceTable from "../Components/Evidencias/evidenceTable";
import EvidenceActionButtons from "../Components/Evidencias/evidenceActionButtons";
import NewEvidenceModal from "../Components/Evidencias/newEvidenceModal";
import EvidenceViewModal from "../Components/Evidencias/evidenceViewModal";
import ConfirmationModal from "./confirmationModal";
import { useEvidences } from "../services/useEvidences";

interface CardEvidenceProps {
  caseId?: string;
}

const CardEvidence: React.FC<CardEvidenceProps> = ({ caseId }) => {
  const {
    evidences,
    loading,
    fetchEvidences,
    getEvidenceById,
    createTextEvidence,
    createImageEvidence,
    deleteEvidence,
  } = useEvidences(caseId);

  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<string | null>(null);
  const [viewingEvidence, setViewingEvidence] = useState<any>(null);

  const handleSubmitText = async (data: {
    description: string;
    content: string;
    contentType: string;
    location: string;
  }) => {
    try {
      await createTextEvidence({
        ...data,
        case: caseId!,
      });

      Alert.alert("Sucesso", "Evidência de texto registrada com sucesso!");
      fetchEvidences();
    } catch (error: any) {
      throw error;
    }
  };

  const handleSubmitImage = async (data: {
    description: string;
    imageType: string;
    location: string;
    cloudinary: {
      url: string;
      public_id: string;
      format: string;
      width: number;
      height: number;
      bytes: number;
    };
  }) => {
    try {
      await createImageEvidence({
        ...data,
        case: caseId!,
      });

      Alert.alert("Sucesso", "Evidência de imagem registrada com sucesso!");
      fetchEvidences();
    } catch (error: any) {
      throw error;
    }
  };

  const handleViewEvidence = async () => {
    console.log(
      "handleViewEvidence chamado, selectedEvidence:",
      selectedEvidence
    );

    if (!selectedEvidence) {
      Alert.alert("Atenção", "Selecione uma evidência para visualizar");
      return;
    }

    try {
      console.log("Buscando evidência para visualização...");
      const evidence = await getEvidenceById(selectedEvidence);
      console.log("Evidência obtida:", evidence);

      if (evidence) {
        setViewingEvidence(evidence);
        setViewModalVisible(true);
        console.log("Modal de visualização aberto");
      } else {
        Alert.alert("Erro", "Não foi possível carregar a evidência");
      }
    } catch (error: any) {
      console.error("Erro ao visualizar evidência:", error);
      Alert.alert("Erro", error.message || "Erro ao carregar evidência");
    }
  };

  const handleDeleteEvidence = () => {
    console.log(
      "handleDeleteEvidence chamado, selectedEvidence:",
      selectedEvidence
    );

    if (!selectedEvidence) {
      Alert.alert("Atenção", "Selecione uma evidência para excluir");
      return;
    }

    console.log("Abrindo modal de confirmação");
    setConfirmDeleteVisible(true);
  };

  const confirmDelete = async () => {
    if (!selectedEvidence) return;

    console.log("Confirmando exclusão da evidência:", selectedEvidence);
    setDeleteLoading(true);

    try {
      await deleteEvidence(selectedEvidence);
      Alert.alert("Sucesso", "Evidência excluída com sucesso");
      setSelectedEvidence(null);
      setConfirmDeleteVisible(false);
      fetchEvidences();
    } catch (error: any) {
      console.error("Erro ao excluir evidência:", error);
      Alert.alert("Erro", error.message || "Erro ao excluir evidência");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSelectEvidence = (evidenceId: string) => {
    console.log("Selecionando evidência:", evidenceId);
    const newSelection = selectedEvidence === evidenceId ? null : evidenceId;
    setSelectedEvidence(newSelection);
    console.log("Evidência selecionada:", newSelection);
  };

  const getSelectedEvidenceDescription = () => {
    const evidence = evidences.find((e) => e.id === selectedEvidence);
    return evidence?.description || "esta evidência";
  };

  console.log("Estado atual do CardEvidence:", {
    caseId,
    evidencesCount: evidences.length,
    selectedEvidence,
    loading,
  });

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.title}>Evidências</Text>
        <Text style={styles.description}>
          Registre evidências em texto ou imagem relacionadas a este caso. As
          evidências incluem localização GPS automática.
        </Text>

        <EvidenceTable
          evidences={evidences}
          loading={loading}
          selectedEvidence={selectedEvidence}
          onSelectEvidence={handleSelectEvidence}
        />

        <EvidenceActionButtons
          selectedEvidence={selectedEvidence}
          onViewEvidence={handleViewEvidence}
          onDeleteEvidence={handleDeleteEvidence}
          showButtons={evidences.length > 0}
        />

        <Button
          mode="contained"
          onPress={() => setModalVisible(true)}
          style={styles.generateButton}
          icon="plus"
          buttonColor="#000"
          textColor="#FFF"
        >
          Registrar Evidência
        </Button>
      </Card.Content>

      <NewEvidenceModal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        onSubmitText={handleSubmitText}
        onSubmitImage={handleSubmitImage}
      />

      <EvidenceViewModal
        visible={viewModalVisible}
        onDismiss={() => {
          console.log("Fechando modal de visualização");
          setViewModalVisible(false);
          setViewingEvidence(null);
        }}
        evidence={viewingEvidence}
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
        title="Excluir Evidência"
        message={`Tem certeza que deseja excluir "${getSelectedEvidenceDescription()}"? Esta ação não pode ser desfeita.`}
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

export default CardEvidence;
