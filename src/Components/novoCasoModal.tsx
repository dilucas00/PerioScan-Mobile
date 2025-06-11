import React from "react";
import {
  Modal,
  Portal,
  Text,
  TextInput,
  Menu,
  Button,
  useTheme,
  IconButton,
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

  const statusCasos = ["Em andamento", "Finalizado", "Arquivado"];

  const handleConfirm = async () => {
    if (!titulo || !localizacao || !descricao) {
      console.error("Por favor, preencha todos os campos obrigatórios: Título, Localização e Descrição.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.error("Token de autenticação não encontrado. Por favor, faça login novamente.");
        return;
      }

      const caseData = {
        title: titulo,
        description: descricao,
        location: localizacao,
        type: tipoCaso || "nao especificado",
        occurrenceDate: dataCaso ? dataCaso.toISOString() : undefined,
        status: statusCaso || "em andamento",
      };

      const response = await fetch(
        "https://perioscan-back-end-fhhq.onrender.com/api/cases",
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(caseData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao criar caso");
      }

      const data = await response.json();
      console.log("Caso criado com sucesso:", data);
      onConfirm({
        titulo,
        localizacao,
        tipo: tipoCaso,
        status: statusCaso,
        data: dataCaso || new Date(),
      });
      setTitulo("");
      setLocalizacao("");
      setTipoCaso("");
      setStatusCaso("");
      setDataCaso(undefined);
      setDescricao("");
      onDismiss(); // Fecha o modal após o sucesso
    } catch (error: any) {
      console.error("Erro ao criar caso:", error.message);
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
