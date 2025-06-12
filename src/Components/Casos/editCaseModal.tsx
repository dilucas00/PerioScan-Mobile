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
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
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

type EditCaseModalProps = {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: (updatedCase: any) => void;
  caseData: {
    id: string;
    title: string;
    description: string;
    type: string;
    location: string;
    status: string;
    occurrenceDate?: string;
  };
};

const EditCaseModal: React.FC<EditCaseModalProps> = ({
  visible,
  onDismiss,
  onConfirm,
  caseData,
}) => {
  const [titulo, setTitulo] = React.useState(caseData.title || "");
  const [localizacao, setLocalizacao] = React.useState(caseData.location || "");
  const [tipoCaso, setTipoCaso] = React.useState(caseData.type || "");
  const [statusCaso, setStatusCaso] = React.useState(caseData.status || "");
  const [menuTipoVisible, setMenuTipoVisible] = React.useState(false);
  const [menuStatusVisible, setMenuStatusVisible] = React.useState(false);
  const [descricao, setDescricao] = React.useState(caseData.description || "");
  const [dataCaso, setDataCaso] = React.useState<Date | undefined>(
    caseData.occurrenceDate ? new Date(caseData.occurrenceDate) : undefined
  );
  const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});

  // Atualizar os estados quando caseData mudar
  React.useEffect(() => {
    if (visible) {
      setTitulo(caseData.title || "");
      setLocalizacao(caseData.location || "");
      setTipoCaso(caseData.type || "");
      setStatusCaso(caseData.status || "");
      setDescricao(caseData.description || "");
      setDataCaso(
        caseData.occurrenceDate ? new Date(caseData.occurrenceDate) : undefined
      );
      setErrors({});
    }
  }, [visible, caseData]);

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

  // Função para mapear os valores de status do backend para exibição
  const mapStatusFromBackend = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      "em andamento": "Em andamento",
      finalizado: "Finalizado",
      arquivado: "Arquivado",
    };
    return statusMap[status] || status;
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!titulo.trim()) newErrors.titulo = "Título é obrigatório";
    if (!descricao.trim()) newErrors.descricao = "Descrição é obrigatória";
    if (!localizacao.trim())
      newErrors.localizacao = "Localização é obrigatória";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        throw new Error(
          "Token de autenticação não encontrado. Por favor, faça login novamente."
        );
      }

      // Preparar dados para envio (apenas campos que podem ter mudado)
      const updateData: any = {};

      if (titulo.trim() !== caseData.title) updateData.title = titulo.trim();
      if (descricao.trim() !== caseData.description)
        updateData.description = descricao.trim();
      if (localizacao.trim() !== caseData.location)
        updateData.location = localizacao.trim();
      if (tipoCaso !== caseData.type) updateData.type = tipoCaso;
      if (mapStatusToBackend(statusCaso) !== caseData.status)
        updateData.status = mapStatusToBackend(statusCaso);

      // Verificar se a data mudou
      const originalDate = caseData.occurrenceDate
        ? new Date(caseData.occurrenceDate).getTime()
        : null;
      const newDate = dataCaso ? dataCaso.getTime() : null;
      if (originalDate !== newDate) {
        updateData.occurrenceDate = dataCaso ? dataCaso.toISOString() : null;
      }

      console.log("Dados para atualização:", updateData);

      // Se não há mudanças, apenas fechar o modal
      if (Object.keys(updateData).length === 0) {
        onDismiss();
        return;
      }

      const response = await fetch(
        `https://perioscan-back-end-fhhq.onrender.com/api/cases/${caseData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Erro ${response.status}: ${response.statusText}`
        );
      }

      const result = await response.json();
      console.log("Caso atualizado com sucesso:", result);

      // Chamar callback de confirmação com os dados atualizados
      onConfirm(result);

      // Fechar modal
      onDismiss();
    } catch (error: any) {
      console.error("Erro ao atualizar caso:", error);
      // Aqui você pode adicionar um Alert se desejar
      setErrors({ geral: error.message || "Erro ao atualizar caso" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.container}
      >
        <Text style={styles.title}>Editar Caso</Text>

        <TextInput
          label="Título do caso *"
          mode="outlined"
          value={titulo}
          onChangeText={(text) => {
            setTitulo(text);
            if (errors.titulo) {
              setErrors({ ...errors, titulo: "" });
            }
          }}
          keyboardType="default"
          style={[styles.input, { color: "black" }]}
          theme={darkTextTheme}
          error={!!errors.titulo}
        />
        {errors.titulo ? (
          <Text style={styles.errorText}>{errors.titulo}</Text>
        ) : null}

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
          label="Localização do caso *"
          mode="outlined"
          value={localizacao}
          onChangeText={(text) => {
            setLocalizacao(text);
            if (errors.localizacao) {
              setErrors({ ...errors, localizacao: "" });
            }
          }}
          keyboardType="default"
          style={[styles.input, { color: "black" }]}
          theme={darkTextTheme}
          error={!!errors.localizacao}
        />
        {errors.localizacao ? (
          <Text style={styles.errorText}>{errors.localizacao}</Text>
        ) : null}

        <TouchableOpacity onPress={showDatePicker}>
          <TextInput
            label="Data da ocorrência"
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
              value={mapStatusFromBackend(statusCaso)}
              editable={false}
              style={[styles.input, { color: "black" }]}
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
          label="Descrição do caso *"
          mode="outlined"
          value={descricao}
          multiline={true}
          numberOfLines={4}
          onChangeText={(text) => {
            setDescricao(text);
            if (errors.descricao) {
              setErrors({ ...errors, descricao: "" });
            }
          }}
          keyboardType="default"
          style={[styles.input, { color: "black" }]}
          theme={darkTextTheme}
          error={!!errors.descricao}
        />
        {errors.descricao ? (
          <Text style={styles.errorText}>{errors.descricao}</Text>
        ) : null}

        {errors.geral ? (
          <Text style={[styles.errorText, styles.generalError]}>
            {errors.geral}
          </Text>
        ) : null}

        <View style={styles.buttons}>
          <Button
            mode="outlined"
            onPress={onDismiss}
            style={[styles.button, styles.cancelButton]}
            textColor="#000"
            labelStyle={{ fontWeight: "bold" }}
            disabled={loading}
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
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              "Salvar"
            )}
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
    marginBottom: 16,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: -12,
    marginBottom: 12,
    marginLeft: 8,
  },
  generalError: {
    textAlign: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 25,
    gap: 12,
  },
  button: {
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

export default EditCaseModal;
