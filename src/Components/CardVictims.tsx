"use client";

import type React from "react";
import { useState } from "react";
import { StyleSheet, Alert } from "react-native";
import { Text, Card, Button } from "react-native-paper";
import VictimTable from "../Components/Vitimas/victimTable";
import VictimActionButtons from "../Components/Vitimas/victimActionButtons";
import VictimModal from "../Components/Vitimas/victimModal";
import VictimViewModal from "../Components/Vitimas/victimViewModal";
import ConfirmationModal from "../Components/confirmationModal";
import { useVictims } from "../services/useVictims";
import Odontogram from "../Components/Vitimas/odontogram";
import { useOdontogram } from "../services/useOdontogram";

interface CardVictimsProps {
  caseId?: string;
}

const CardVictims: React.FC<CardVictimsProps> = ({ caseId }) => {
  const [selectedVictim, setSelectedVictim] = useState<string | null>(null);
  const {
    victims,
    loading,
    fetchVictims,
    getVictimById,
    createVictim,
    updateVictim,
    deleteVictim,
  } = useVictims(caseId);
  const {
    teeth,
    loading: odontogramLoading,
    updateTooth,
    fetchOdontogram,
  } = useOdontogram(selectedVictim || undefined);

  // Adicionar estado para controlar visibilidade do odontograma
  const [showOdontogram, setShowOdontogram] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [viewingVictim, setViewingVictim] = useState<any>(null);
  const [editingVictim, setEditingVictim] = useState<any>(null);

  // Estados do formulário
  const [identificationType, setIdentificationType] = useState<
    "identificada" | "não_identificada"
  >("identificada");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [documentType, setDocumentType] = useState("rg");
  const [documentNumber, setDocumentNumber] = useState("");
  const [nic, setNic] = useState("");
  const [referenceCode, setReferenceCode] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const resetForm = () => {
    setIdentificationType("identificada");
    setName("");
    setGender("");
    setAge("");
    setDocumentType("rg");
    setDocumentNumber("");
    setNic("");
    setReferenceCode("");
    setErrors({});
    setEditMode(false);
    setEditingVictim(null);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (identificationType === "identificada") {
      if (!name.trim())
        newErrors.name = "Nome é obrigatório para vítimas identificadas";
    } else {
      if (!referenceCode.trim())
        newErrors.referenceCode =
          "Código de referência é obrigatório para vítimas não identificadas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitLoading(true);
    try {
      const victimData: any = {
        identificationType,
        case: caseId!,
      };

      if (identificationType === "identificada") {
        victimData.name = name.trim();
        if (gender) victimData.gender = gender;
        if (age) victimData.age = Number.parseInt(age);
        if (documentType && documentNumber) {
          victimData.document = {
            type: documentType,
            number: documentNumber.trim(),
          };
        }
      } else {
        victimData.referenceCode = referenceCode.trim();
      }

      if (nic) victimData.nic = nic.trim();

      if (editMode && editingVictim) {
        // Remover campos que não podem ser editados
        delete victimData.identificationType;
        delete victimData.case;

        await updateVictim(editingVictim.id, victimData);
        Alert.alert("Sucesso", "Vítima atualizada com sucesso!");
      } else {
        await createVictim(victimData);
        Alert.alert("Sucesso", "Vítima registrada com sucesso!");
      }

      resetForm();
      setModalVisible(false);
      fetchVictims();
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao salvar vítima");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleViewVictim = async () => {
    console.log("👁️ handleViewVictim chamado");
    console.log("🎯 selectedVictim:", selectedVictim);
    console.log("📊 Total de vítimas carregadas:", victims.length);

    if (!selectedVictim) {
      Alert.alert("Atenção", "Selecione uma vítima para visualizar");
      return;
    }

    try {
      console.log("🔍 Buscando vítima para visualização...");

      // Adicionar loading visual se necessário
      const victim = await getVictimById(selectedVictim);
      console.log("📦 Vítima obtida:", victim);

      if (victim) {
        setViewingVictim(victim);
        setViewModalVisible(true);
        console.log("✅ Modal de visualização aberto");
      } else {
        console.log("❌ Vítima não encontrada");
        Alert.alert(
          "Erro",
          "Vítima não encontrada ou não foi possível carregá-la"
        );
      }
    } catch (error: any) {
      console.error("❌ Erro ao visualizar vítima:", error);
      Alert.alert("Erro", error.message || "Erro ao carregar vítima");
    }
  };

  const handleEditVictim = async () => {
    console.log("✏️ handleEditVictim chamado");
    console.log("🎯 selectedVictim:", selectedVictim);

    if (!selectedVictim) {
      Alert.alert("Atenção", "Selecione uma vítima para editar");
      return;
    }

    try {
      console.log("🔍 Carregando vítima para edição...");
      const victim = await getVictimById(selectedVictim);

      if (victim) {
        console.log("📝 Preparando formulário de edição...");
        setEditingVictim(victim);
        setEditMode(true);

        // Preencher formulário com dados da vítima
        setIdentificationType(victim.identificationType);
        setName(victim.name || "");
        setGender(victim.gender || "");
        setAge(victim.age ? victim.age.toString() : "");
        setDocumentType(victim.document?.type || "rg");
        setDocumentNumber(victim.document?.number || "");
        setNic(victim.nic || "");
        setReferenceCode(victim.referenceCode || "");

        setModalVisible(true);
        console.log("✅ Modal de edição aberto");
      } else {
        console.log("❌ Vítima não encontrada para edição");
        Alert.alert(
          "Erro",
          "Vítima não encontrada ou não foi possível carregá-la"
        );
      }
    } catch (error: any) {
      console.error("❌ Erro ao carregar vítima para edição:", error);
      Alert.alert("Erro", error.message || "Erro ao carregar vítima");
    }
  };

  const handleDeleteVictim = () => {
    console.log("handleDeleteVictim chamado, selectedVictim:", selectedVictim);

    if (!selectedVictim) {
      Alert.alert("Atenção", "Selecione uma vítima para excluir");
      return;
    }

    console.log("Abrindo modal de confirmação");
    setConfirmDeleteVisible(true);
  };

  const confirmDelete = async () => {
    if (!selectedVictim) return;

    console.log("Confirmando exclusão da vítima:", selectedVictim);
    setDeleteLoading(true);

    try {
      await deleteVictim(selectedVictim);
      Alert.alert("Sucesso", "Vítima excluída com sucesso");
      setSelectedVictim(null);
      setConfirmDeleteVisible(false);
      fetchVictims();
    } catch (error: any) {
      console.error("Erro ao excluir vítima:", error);
      Alert.alert("Erro", error.message || "Erro ao excluir vítima");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Atualizar handleSelectVictim para recarregar odontograma
  const handleSelectVictim = (victimId: string) => {
    console.log("Selecionando vítima:", victimId);
    const newSelection = selectedVictim === victimId ? null : victimId;
    setSelectedVictim(newSelection);

    // Se odontograma estiver visível, recarregar dados
    if (showOdontogram && newSelection) {
      fetchOdontogram();
    }

    console.log("Vítima selecionada:", newSelection);
  };

  // Função para alternar visibilidade do odontograma
  const toggleOdontogram = () => {
    if (!selectedVictim) {
      Alert.alert(
        "Atenção",
        "Selecione uma vítima para visualizar o odontograma"
      );
      return;
    }

    const newShowState = !showOdontogram;
    setShowOdontogram(newShowState);

    // Se estiver mostrando, carregar dados
    if (newShowState) {
      fetchOdontogram();
    }
  };

  const getSelectedVictimName = () => {
    const victim = victims.find((v) => v.id === selectedVictim);
    if (victim?.identificationType === "identificada") {
      return victim.name || "esta vítima";
    } else {
      return victim?.referenceCode || "esta vítima";
    }
  };

  const handleModalDismiss = () => {
    setModalVisible(false);
    resetForm();
  };

  console.log("Estado atual do CardVictims:", {
    caseId,
    victimsCount: victims.length,
    selectedVictim,
    loading,
  });

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.title}>Vítimas</Text>
        <Text style={styles.description}>
          Registre e gerencie informações sobre as vítimas relacionadas a este
          caso. Vítimas podem ser identificadas ou não identificadas.
        </Text>

        <VictimTable
          victims={victims}
          loading={loading}
          selectedVictim={selectedVictim}
          onSelectVictim={handleSelectVictim}
        />

        <VictimActionButtons
          selectedVictim={selectedVictim}
          onViewVictim={handleViewVictim}
          onEditVictim={handleEditVictim}
          onDeleteVictim={handleDeleteVictim}
          showButtons={victims.length > 0}
        />

        {/* Botão para mostrar/ocultar odontograma */}
        {victims.length > 0 && (
          <Button
            mode={showOdontogram ? "contained" : "outlined"}
            onPress={toggleOdontogram}
            style={[
              styles.odontogramButton,
              showOdontogram && styles.odontogramButtonActive,
            ]}
            icon={showOdontogram ? "tooth-outline" : "tooth"}
            buttonColor={showOdontogram ? "#4CAF50" : undefined}
            textColor={showOdontogram ? "#FFF" : "#4CAF50"}
            disabled={!selectedVictim}
          >
            {showOdontogram ? "Ocultar Odontograma" : "Mostrar Odontograma"}
          </Button>
        )}

        {/* Odontograma - só aparece se showOdontogram for true e tiver vítima selecionada */}
        {showOdontogram && selectedVictim && (
          <Odontogram
            victimId={selectedVictim}
            teeth={teeth}
            onUpdateTooth={updateTooth}
            loading={odontogramLoading}
          />
        )}

        <Button
          mode="contained"
          onPress={() => setModalVisible(true)}
          style={styles.generateButton}
          icon="plus"
          buttonColor="#000"
          textColor="#FFF"
        >
          Registrar Vítima
        </Button>
      </Card.Content>

      <VictimModal
        visible={modalVisible}
        onDismiss={handleModalDismiss}
        identificationType={identificationType}
        setIdentificationType={setIdentificationType}
        name={name}
        setName={setName}
        gender={gender}
        setGender={setGender}
        age={age}
        setAge={setAge}
        documentType={documentType}
        setDocumentType={setDocumentType}
        documentNumber={documentNumber}
        setDocumentNumber={setDocumentNumber}
        nic={nic}
        setNic={setNic}
        referenceCode={referenceCode}
        setReferenceCode={setReferenceCode}
        errors={errors}
        setErrors={setErrors}
        loading={submitLoading}
        onSubmit={handleSubmit}
        isEditing={editMode}
      />

      <VictimViewModal
        visible={viewModalVisible}
        onDismiss={() => {
          console.log("Fechando modal de visualização");
          setViewModalVisible(false);
          setViewingVictim(null);
        }}
        victim={viewingVictim}
        onEdit={() => {
          setViewModalVisible(false);
          handleEditVictim();
        }}
      />

      <ConfirmationModal
        visible={confirmDeleteVisible}
        onDismiss={() => {
          console.log("Fechando modal de confirmação");
          setConfirmDeleteVisible(false);
        }}
        onConfirm={confirmDelete}
        title="Excluir Vítima"
        message={`Tem certeza que deseja excluir "${getSelectedVictimName()}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        type="danger"
        loading={deleteLoading}
      />
    </Card>
  );
};

// Adicionar estilos para o botão do odontograma:
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
  odontogramButton: {
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 8,
    paddingVertical: 4,
    borderColor: "#4CAF50",
  },
  odontogramButtonActive: {
    backgroundColor: "#4CAF50",
  },
});

export default CardVictims;
