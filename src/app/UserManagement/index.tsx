import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import UserCard from "src/Components/UserCard";
import NovoUsuarioModal from "src/Components/NovoUsuarioModal";
import AppBarHeader from "src/Components/AppBarHeader";
import FiltroButton from "src/Components/FiltroButton";

interface Usuario {
  id: number;
  nome: string;
  email: string;
  cargo: string;
  ativo: boolean;
}

const gerarId = () => Math.floor(1000000 + Math.random() * 9000000); // Gera ID com 7 dígitos

const UserManagement = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    {
      id: 1000001,
      nome: "João Silva",
      email: "joao@email.com",
      cargo: "Administrador",
      ativo: true,
    },
    {
      id: 1000002,
      nome: "Maria Souza",
      email: "maria@email.com",
      cargo: "Usuário",
      ativo: false,
    },
    {
      id: 1000002,
      nome: "Maria Souza",
      email: "maria@email.com",
      cargo: "Usuário",
      ativo: false,
    },
  ]);

  const [modalVisivel, setModalVisivel] = useState(false);
  const [filtro, setFiltro] = useState("todos"); // Estado para o filtro

  const adicionarUsuario = (novoUsuario: {
    nome: string;
    email: string;
    cargo: string;
  }) => {
    const novo = {
      id: gerarId(),
      ativo: true, // por padrão, novo usuário vem como ativo
      ...novoUsuario,
    };
    setUsuarios((prev) => [...prev, novo]);
  };

  const excluirUsuario = (id: number) => {
    setUsuarios((prev) => prev.filter((user) => user.id !== id));
  };

  const editarUsuario = (id: number) => {
    alert(`Editar usuário com ID: ${id}`);
  };

  return (
    <View style={{ flex: 1 }}>
      <AppBarHeader title="Gerenciamento de Usuario" />

      <FiltroButton
        onValueChange={setFiltro}
        opcoes={[
          { value: "todos", label: "Todos" },
          { value: "perito", label: "Perito" },
          { value: "assistente", label: "Assistente" },
        ]}
      />

      <View style={styles.container}>
        <FlatList
          data={usuarios}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <UserCard
              id={item.id}
              nome={item.nome}
              email={item.email}
              cargo={item.cargo}
              ativo={item.ativo}
              onEdit={() => editarUsuario(item.id)}
            />
          )}
          contentContainerStyle={styles.lista}
        />

        <TouchableOpacity
          style={styles.botao}
          onPress={() => setModalVisivel(true)}
        >
          <Text style={styles.textoBotao}>+ Novo Usuário</Text>
        </TouchableOpacity>

        <NovoUsuarioModal
          visivel={modalVisivel}
          onClose={() => setModalVisivel(false)}
          onSalvar={adicionarUsuario}
        />
      </View>
    </View>
  );
};

export default UserManagement;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F7F7F7",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  lista: {
    paddingBottom: 100,
  },
  botao: {
    backgroundColor: "#000000",
    padding: 16,
    borderRadius: 8,
    position: "absolute",
    bottom: 90,
    alignSelf: "center",
  },
  textoBotao: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
