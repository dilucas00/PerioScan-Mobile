import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

interface NovoUsuarioModalProps {
  visivel: boolean;
  onClose: () => void;
  onSalvar: (usuario: {
    nome: string;
    email: string;
    senha: string;
    cargo: string;
  }) => void;
}

const NovoUsuarioModal: React.FC<NovoUsuarioModalProps> = ({
  visivel,
  onClose,
  onSalvar,
}) => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cargo, setCargo] = useState("");

  const limparCampos = () => {
    setNome("");
    setEmail("");
    setSenha("");
    setCargo("");
  };

  const salvar = () => {
    if (!nome || !email || !senha || !cargo) {
      alert("Preencha todos os campos!");
      return;
    }

    onSalvar({ nome, email, senha, cargo });
    limparCampos();
    onClose();
  };

  const opcoesCargo = ["Perito", "Assistente", "Administrador"];

  return (
    <Modal visible={visivel} transparent animationType="slide">
      <View style={styles.container}>
        <View style={styles.modal}>
          <Text style={styles.titulo}>Novo Usuário</Text>

          <TextInput
            style={styles.input}
            placeholder="Nome"
            value={nome}
            onChangeText={setNome}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />

          <Text style={styles.subtitulo}>Cargo:</Text>
          <View style={styles.opcoesCargo}>
            {opcoesCargo.map((opcao) => (
              <TouchableOpacity
                key={opcao}
                style={[
                  styles.bolinha,
                  cargo === opcao && styles.bolinhaSelecionada,
                ]}
                onPress={() => setCargo(opcao)}
              >
                <Text style={styles.textoOpcao}>
                  {cargo === opcao ? "✓" : ""}
                </Text>
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

          <View style={styles.botoes}>
            <TouchableOpacity style={styles.botaoCancelar} onPress={onClose}>
              <Text style={styles.textoBotao}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botaoSalvar} onPress={salvar}>
              <Text style={styles.textoBotao}>Salvar</Text>
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
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#F2F2F2",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
  },
  opcoesCargo: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 6,
  },
  bolinha: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#888",
    justifyContent: "center",
    alignItems: "center",
  },
  bolinhaSelecionada: {
    backgroundColor: "#4C9EEB",
    borderColor: "#4C9EEB",
  },
  textoOpcao: {
    color: "#FFF",
    fontWeight: "bold",
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
  },
  botoes: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    gap: 8,
  },
  botaoCancelar: {
    backgroundColor: "#AAA",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  botaoSalvar: {
    backgroundColor: "#4C9EEB",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  textoBotao: {
    color: "#FFF",
    fontWeight: "bold",
  },
});
