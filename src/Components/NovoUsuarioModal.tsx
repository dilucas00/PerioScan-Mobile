import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface NovoUsuarioModalProps {
  visivel: boolean;
  onClose: () => void;
  onSalvar: (usuario: {
    name: string;
    email: string;
    password: string;
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
  const [nome, setNome] = useState(usuarioParaEditar?.name || "");
  const [email, setEmail] = useState(usuarioParaEditar?.email || "");
  const [senha, setSenha] = useState("");
  const [cargo, setCargo] = useState(usuarioParaEditar?.role || "");
  const [loading, setLoading] = useState(false);
  const [erros, setErros] = useState({
    nome: "",
    email: "",
    senha: "",
    cargo: "",
  });

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

    if (!modoEdicao && !nome.trim()) novosErros.nome = "Nome é obrigatório";
    if (!email.trim()) novosErros.email = "Email é obrigatório";
    else if (!validarEmail(email)) novosErros.email = "Email inválido";
    if (!modoEdicao && !senha.trim()) novosErros.senha = "Senha é obrigatória";
    if (!cargo) novosErros.cargo = "Cargo é obrigatório";

    setErros(novosErros);
    return !Object.values(novosErros).some((erro) => erro);
  };

  const cargoMapping = {
    "Perito": "perito",
    "Assistente": "assistente",
    "Administrador": "admin"
  };

  const handleSalvar = async () => {
    if (!validarCampos()) return;

    setLoading(true);
    try {
      const dadosUsuario: any = {
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
            <Text style={styles.titulo}>
              {modoEdicao ? "Editar Usuário" : "Novo Usuário"}
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputIconContainer}>
              <MaterialIcons name="person" size={20} color="#666" />
              <TextInput
                style={[styles.input, erros.nome ? styles.inputError : null]}
                placeholder="Nome"
                value={nome}
                onChangeText={(text) => {
                  setNome(text);
                  setErros({ ...erros, nome: "" });
                }}
              />
            </View>
            {erros.nome ? <Text style={styles.erro}>{erros.nome}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputIconContainer}>
              <MaterialIcons name="email" size={20} color="#666" />
              <TextInput
                style={[styles.input, erros.email ? styles.inputError : null]}
                placeholder="Email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setErros({ ...erros, email: "" });
                }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {erros.email ? (
              <Text style={styles.erro}>{erros.email}</Text>
            ) : null}
          </View>

          {!modoEdicao && (
            <View style={styles.inputContainer}>
              <View style={styles.inputIconContainer}>
                <MaterialIcons name="lock" size={20} color="#666" />
                <TextInput
                  style={[styles.input, erros.senha ? styles.inputError : null]}
                  placeholder="Senha"
                  value={senha}
                  onChangeText={(text) => {
                    setSenha(text);
                    setErros({ ...erros, senha: "" });
                  }}
                  secureTextEntry
                />
              </View>
              {erros.senha ? (
                <Text style={styles.erro}>{erros.senha}</Text>
              ) : null}
            </View>
          )}

          <Text style={styles.subtitulo}>Cargo:</Text>
          <View style={styles.opcoesCargo}>
            {opcoesCargo.map((opcao) => (
              <TouchableOpacity
                key={opcao}
                style={[
                  styles.bolinha,
                  cargo === opcao && styles.bolinhaSelecionada,
                  erros.cargo ? styles.bolinhaError : null,
                ]}
                onPress={() => {
                  setCargo(opcao);
                  setErros({ ...erros, cargo: "" });
                }}
              >
                <MaterialIcons
                  name={cargo === opcao ? "check" : "work"}
                  size={20}
                  color={cargo === opcao ? "#FFF" : "#666"}
                />
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.labelCargoContainer}>
            {opcoesCargo.map((opcao) => (
              <Text key={opcao} style={styles.labelCargo}>
                {opcao}
              </Text>
            ))}
          </View>
          {erros.cargo ? (
            <Text style={[styles.erro, styles.erroCargo]}>{erros.cargo}</Text>
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
              <Text style={styles.textoBotao}>Cancelar</Text>
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
                  <Text style={styles.textoBotao}>
                    {modoEdicao ? "Atualizar" : "Salvar"}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default NovoUsuarioModal;

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
    marginBottom: 6,
    color: "#000",
  },
  inputContainer: {
    marginBottom: 10,
  },
  inputIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "transparent",
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  inputError: {
    borderColor: "#FF3B30",
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
  opcoesCargo: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 6,
  },
  bolinha: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#666",
    justifyContent: "center",
    alignItems: "center",
  },
  bolinhaSelecionada: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  bolinhaError: {
    borderColor: "#FF3B30",
  },
  labelCargoContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  labelCargo: {
    fontSize: 12,
    textAlign: "center",
    width: 70,
    color: "#666",
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
