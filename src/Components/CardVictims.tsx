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

interface CardVictimsProps {
  caseId?: string;
}

const CardVictims: React.FC<CardVictimsProps> = ({ caseId }) => {
  const {
    victims,
    loading,
    fetchVictims,
    getVictimById,
    createVictim,
    updateVictim,
    deleteVictim,
  } = useVictims(caseId);

  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedVictim, setSelectedVictim] = useState<string | null>(null);
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
    console.log("handleViewVictim chamado, selectedVictim:", selectedVictim);

    if (!selectedVictim) {
      Alert.alert("Atenção", "Selecione uma vítima para visualizar");
      return;
    }

    try {
      console.log("Buscando vítima para visualização...");
      const victim = await getVictimById(selectedVictim);
      console.log("Vítima obtida:", victim);

      if (victim) {
        setViewingVictim(victim);
        setViewModalVisible(true);
        console.log("Modal de visualização aberto");
      } else {
        Alert.alert("Erro", "Não foi possível carregar a vítima");
      }
    } catch (error: any) {
      console.error("Erro ao visualizar vítima:", error);
      Alert.alert("Erro", error.message || "Erro ao carregar vítima");
    }
  };

  const handleEditVictim = async () => {
    console.log("handleEditVictim chamado, selectedVictim:", selectedVictim);

    if (!selectedVictim) {
      Alert.alert("Atenção", "Selecione uma vítima para editar");
      return;
    }

    try {
      const victim = await getVictimById(selectedVictim);
      if (victim) {
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
      } else {
        Alert.alert("Erro", "Não foi possível carregar a vítima");
      }
    } catch (error: any) {
      console.error("Erro ao carregar vítima para edição:", error);
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

  const handleSelectVictim = (victimId: string) => {
    console.log("Selecionando vítima:", victimId);
    const newSelection = selectedVictim === victimId ? null : victimId;
    setSelectedVictim(newSelection);
    console.log("Vítima selecionada:", newSelection);
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

export default CardVictims;
