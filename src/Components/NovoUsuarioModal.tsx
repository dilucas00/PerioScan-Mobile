import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  TextInput as PaperTextInput,
  RadioButton,
  Text as PaperText,
} from "react-native-paper";

export interface NovoUsuarioModalProps {
  visivel: boolean;
  onClose: () => void;
  onSalvar: (usuario: {
    name: string;
    email: string;
    password?: string;
    role: string;
  }) => Promise<void>;
  usuarioParaEditar?: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  modoEdicao?: boolean;
}

const NovoUsuarioModal: React.FC<NovoUsuarioModalProps> = ({
  visivel,
  onClose,
  onSalvar,
  usuarioParaEditar,
  modoEdicao = false,
}) => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cargo, setCargo] = useState("");
  const [loading, setLoading] = useState(false);
  const [erros, setErros] = useState({
    nome: "",
    email: "",
    senha: "",
    cargo: "",
  });

  useEffect(() => {
    if (modoEdicao && usuarioParaEditar) {
      setNome(usuarioParaEditar.name);
      setEmail(usuarioParaEditar.email);
      setCargo(usuarioParaEditar.role);
      setSenha("");
    } else {
      limparCampos();
    }
  }, [usuarioParaEditar, modoEdicao]);

  const validarEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validarCampos = () => {
    const novosErros = {
      nome: "",
      email: "",
      senha: "",
      cargo: "",
    };

    if (!nome.trim()) novosErros.nome = "Nome é obrigatório";
    if (!email.trim()) novosErros.email = "Email é obrigatório";
    else if (!validarEmail(email)) novosErros.email = "Email inválido";
    if (!modoEdicao && !senha.trim()) novosErros.senha = "Senha é obrigatória";
    if (!cargo) novosErros.cargo = "Cargo é obrigatório";

    setErros(novosErros);
    return !Object.values(novosErros).some((erro) => erro);
  };

  const cargoMapping = {
    Perito: "perito",
    Assistente: "assistente",
    Administrador: "admin",
  };

  const handleSalvar = async () => {
    if (!validarCampos()) return;

    setLoading(true);
    try {
      const dadosUsuario: {
        name: string;
        email: string;
        role: string;
        password?: string;
      } = {
        name: nome,
        email,
        role: cargoMapping[cargo as keyof typeof cargoMapping],
      };

      if (senha.trim()) {
        dadosUsuario.password = senha;
      }

      await onSalvar(dadosUsuario);
      limparCampos();
      onClose();
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao salvar usuário");
    } finally {
      setLoading(false);
    }
  };

  const limparCampos = () => {
    setNome("");
    setEmail("");
    setSenha("");
    setCargo("");
    setErros({
      nome: "",
      email: "",
      senha: "",
      cargo: "",
    });
  };

  const opcoesCargo = ["Perito", "Assistente", "Administrador"];

  return (
    <Modal visible={visivel} transparent animationType="slide">
      <View style={styles.container}>
        <View style={styles.modal}>
          <View style={styles.headerContainer}>
            <MaterialIcons
              name={modoEdicao ? "edit" : "person-add"}
              size={24}
              color="#000"
            />
            <PaperText style={styles.titulo}>
              {modoEdicao ? "Editar Usuário" : "Novo Usuário"}
            </PaperText>
          </View>

          <View style={styles.inputContainer}>
            <PaperTextInput
              label="Nome"
              value={nome}
              onChangeText={(text) => {
                setNome(text);
                setErros({ ...erros, nome: "" });
              }}
              mode="outlined"
              style={styles.paperInput}
              error={!!erros.nome}
              left={<PaperTextInput.Icon icon="account" />}
            />
            {erros.nome ? (
              <PaperText style={styles.erro}>{erros.nome}</PaperText>
            ) : null}
          </View>

          <View style={styles.inputContainer}>
            <PaperTextInput
              label="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setErros({ ...erros, email: "" });
              }}
              mode="outlined"
              style={styles.paperInput}
              error={!!erros.email}
              keyboardType="email-address"
              autoCapitalize="none"
              left={<PaperTextInput.Icon icon="email" />}
            />
            {erros.email ? (
              <PaperText style={styles.erro}>{erros.email}</PaperText>
            ) : null}
          </View>

          {!modoEdicao && (
            <View style={styles.inputContainer}>
              <PaperTextInput
                label="Senha"
                value={senha}
                onChangeText={(text) => {
                  setSenha(text);
                  setErros({ ...erros, senha: "" });
                }}
                mode="outlined"
                style={styles.paperInput}
                error={!!erros.senha}
                secureTextEntry
                left={<PaperTextInput.Icon icon="lock" />}
              />
              {erros.senha ? (
                <PaperText style={styles.erro}>{erros.senha}</PaperText>
              ) : null}
            </View>
          )}

          <PaperText style={styles.subtitulo}>Cargo:</PaperText>
          <RadioButton.Group
            onValueChange={(newValue) => {
              setCargo(newValue);
              setErros({ ...erros, cargo: "" });
            }}
            value={cargo}
          >
            <View style={styles.radioGroup}>
              {opcoesCargo.map((opcao) => (
                <View key={opcao} style={styles.radioItem}>
                  <RadioButton value={opcao} />
                  <PaperText style={{ marginTop: -5 }}>{opcao}</PaperText>
                </View>
              ))}
            </View>
          </RadioButton.Group>
          {erros.cargo ? (
            <PaperText style={[styles.erro, styles.erroCargo]}>
              {erros.cargo}
            </PaperText>
          ) : null}

          <View style={styles.botoes}>
            <TouchableOpacity
              style={styles.botaoCancelar}
              onPress={() => {
                limparCampos();
                onClose();
              }}
              disabled={loading}
            >
              <MaterialIcons name="close" size={20} color="#FFF" />
              <PaperText style={styles.textoBotao}>Cancelar</PaperText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.botaoSalvar, loading && styles.botaoDesabilitado]}
              onPress={handleSalvar}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <>
                  <MaterialIcons
                    name={modoEdicao ? "check" : "save"}
                    size={20}
                    color="#FFF"
                  />
                  <PaperText style={styles.textoBotao}>
                    {modoEdicao ? "Atualizar" : "Salvar"}
                  </PaperText>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#FFF",
    width: "90%",
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    gap: 8,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
    color: "#000",
  },
  inputContainer: {
    marginBottom: 10,
  },
  paperInput: {
    marginBottom: 0,
  },
  erro: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: 4,
  },
  erroCargo: {
    textAlign: "center",
    marginBottom: 10,
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
    flexWrap: "wrap",
  },
  radioItem: {
    flexDirection: "column",
    alignItems: "center",
    marginHorizontal: 10,
    marginBottom: 10,
  },
  botoes: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
    gap: 8,
  },
  botaoCancelar: {
    backgroundColor: "#000",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  botaoSalvar: {
    backgroundColor: "#000",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  botaoDesabilitado: {
    opacity: 0.7,
  },
  textoBotao: {
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default NovoUsuarioModal;
