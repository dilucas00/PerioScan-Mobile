"use client";

import React from "react";
import {
  Modal,
  Portal,
  Text,
  TextInput,
  Menu,
  Button,
} from "react-native-paper";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const darkTextTheme = {
  colors: {
    primary: "black",
    onSurfaceVariant: "black",
    onSurface: "black",
    outline: "black",
    text: "black",
    placeholder: "black",
  },
};

type NovoCasoModalProps = {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: (data: {
    titulo: string;
    localizacao: string;
    tipo: string;
    status: string;
    data: Date;
  }) => void;
};

const NovoCasoModal: React.FC<NovoCasoModalProps> = ({
  visible,
  onDismiss,
  onConfirm,
}) => {
  const [titulo, setTitulo] = React.useState("");
  const [localizacao, setLocalizacao] = React.useState("");
  const [tipoCaso, setTipoCaso] = React.useState("");
  const [statusCaso, setStatusCaso] = React.useState("");
  const [menuTipoVisible, setMenuTipoVisible] = React.useState(false);
  const [menuStatusVisible, setMenuStatusVisible] = React.useState(false);
  const [descricao, setDescricao] = React.useState("");
  const [dataCaso, setDataCaso] = React.useState<Date | undefined>(undefined);
  const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirmDate = (date: Date) => {
    setDataCaso(date);
    hideDatePicker();
  };

  const tiposCaso = [
    "Exame Criminal",
    "Identificação de Vítima",
    "Acidente",
    "Outros",
  ];

  // Adicionar um mapeamento para os valores de status
  const statusCasos = ["Em andamento", "Finalizado", "Arquivado"];

  // Função para mapear os valores de status para o formato esperado pelo backend
  const mapStatusToBackend = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      "Em andamento": "em andamento",
      Finalizado: "finalizado",
      Arquivado: "arquivado",
    };
    return statusMap[status] || "em andamento";
  };

  const handleConfirm = async () => {
    // Validação dos campos obrigatórios
    if (!titulo.trim()) {
      console.error("Título é obrigatório");
      return;
    }

    if (!descricao.trim()) {
      console.error("Descrição é obrigatória");
      return;
    }

    if (!localizacao.trim()) {
      console.error("Localização é obrigatória");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.error(
          "Token de autenticação não encontrado. Por favor, faça login novamente."
        );
        return;
      }

      // Preparar dados para envio
      const caseData = {
        title: titulo.trim(),
        description: descricao.trim(),
        location: localizacao.trim(),
        type: tipoCaso || "nao especificado",
        status: mapStatusToBackend(statusCaso) || "em andamento", // Usar a função de mapeamento aqui
        ...(dataCaso && { occurrenceDate: dataCaso.toISOString() }),
      };

      console.log("Enviando dados do caso:", caseData);

      const response = await fetch(
        "https://perioscan-back-end-fhhq.onrender.com/api/cases",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(caseData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Erro ${response.status}: ${response.statusText}`
        );
      }

      const result = await response.json();
      console.log("Caso criado com sucesso:", result);

      // Chamar callback de confirmação com os dados retornados
      onConfirm({
        titulo: result.title || titulo,
        localizacao: result.location || localizacao,
        tipo: result.type || tipoCaso,
        status: result.status || statusCaso,
        data: result.occurrenceDate
          ? new Date(result.occurrenceDate)
          : dataCaso || new Date(),
      });

      // Limpar formulário
      setTitulo("");
      setLocalizacao("");
      setTipoCaso("");
      setStatusCaso("");
      setDataCaso(undefined);
      setDescricao("");

      // Fechar modal
      onDismiss();
    } catch (error: any) {
      console.error("Erro ao criar caso:", error);
      // Aqui você pode adicionar um Alert ou outro feedback visual se desejar
      // Alert.alert("Erro", error.message || "Erro ao criar caso");
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.container}
      >
        <Text style={styles.title}>Criar Novo Caso</Text>

        <TextInput
          label="Título do caso"
          mode="outlined"
          value={titulo}
          onChangeText={setTitulo}
          keyboardType="default"
          style={[styles.input, { color: "black" }]}
          theme={darkTextTheme}
        />

        {/* Menu para Tipo do Caso */}
        <Menu
          visible={menuTipoVisible}
          onDismiss={() => setMenuTipoVisible(false)}
          anchor={
            <TextInput
              label="Tipo do caso"
              mode="outlined"
              value={tipoCaso}
              editable={false}
              style={[styles.input, { color: "black" }]}
              right={
                <TextInput.Icon
                  icon="menu-down"
                  onPress={() => setMenuTipoVisible(true)}
                  color="black"
                />
              }
              theme={darkTextTheme}
              onPressIn={() => !menuTipoVisible && setMenuTipoVisible(true)}
            />
          }
        >
          {tiposCaso.map((tipo) => (
            <Menu.Item
              key={tipo}
              onPress={() => {
                setTipoCaso(tipo);
                setMenuTipoVisible(false);
              }}
              title={tipo}
              titleStyle={{ color: "white" }}
            />
          ))}
        </Menu>

        <TextInput
          label="Localização do caso"
          mode="outlined"
          value={localizacao}
          onChangeText={setLocalizacao}
          keyboardType="default"
          style={[styles.input, { color: "black" }]}
          theme={darkTextTheme}
        />

        <TouchableOpacity onPress={showDatePicker}>
          <TextInput
            label="Data do caso"
            mode="outlined"
            value={dataCaso ? dataCaso.toLocaleDateString("pt-BR") : ""}
            editable={false}
            style={[styles.input, { color: "black" }]}
            right={
              <TextInput.Icon
                icon="calendar"
                onPress={showDatePicker}
                color="black"
              />
            }
            theme={darkTextTheme}
          />
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirmDate}
          onCancel={hideDatePicker}
          locale="pt_BR"
        />

        {/* Menu para Status do Caso */}
        <Menu
          visible={menuStatusVisible}
          onDismiss={() => setMenuStatusVisible(false)}
          anchor={
            <TextInput
              label="Status do caso"
              mode="outlined"
              value={statusCaso}
              editable={false}
              style={[styles.input, { color: "#fff" }]}
              right={
                <TextInput.Icon
                  icon="menu-down"
                  onPress={() => setMenuStatusVisible(true)}
                  color="black"
                />
              }
              theme={darkTextTheme}
              onPressIn={() => !menuStatusVisible && setMenuStatusVisible(true)}
            />
          }
        >
          {statusCasos.map((status) => (
            <Menu.Item
              key={status}
              onPress={() => {
                setStatusCaso(status);
                setMenuStatusVisible(false);
              }}
              title={status}
              titleStyle={{ color: "#fff" }}
            />
          ))}
        </Menu>
        <TextInput
          label="Descrição do caso"
          mode="outlined"
          value={descricao}
          multiline={true}
          numberOfLines={4}
          onChangeText={setDescricao}
          keyboardType="default"
          style={[styles.input, { color: "black" }]}
          theme={darkTextTheme}
        />

        <View style={styles.buttons}>
          <Button
            mode="outlined"
            onPress={onDismiss}
            style={[styles.button, styles.cancelButton]}
            textColor="#000"
            labelStyle={{ fontWeight: "bold" }}
          >
            Cancelar
          </Button>
          <Button
            mode="contained"
            onPress={handleConfirm}
            style={[styles.button, styles.confirmButton]}
            buttonColor="#000"
            textColor="#FFF"
            labelStyle={{ fontWeight: "bold" }}
          >
            Confirmar
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 25,
    marginHorizontal: 20,
    borderRadius: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    marginBottom: 18,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 25,
  },
  button: {
    marginLeft: 12,
    minWidth: 100,
    borderRadius: 8,
    borderWidth: 1,
  },
  cancelButton: {
    borderColor: "#000",
  },
  confirmButton: {
    borderColor: "#000",
  },
});

export default NovoCasoModal;
