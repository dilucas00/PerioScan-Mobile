import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { userService } from "src/services/userService";
import UserCard from "src/Components/UserCard";
import NovoUsuarioModal, {
  NovoUsuarioModalProps,
} from "src/Components/NovoUsuarioModal";
import FiltroButton from "src/Components/FiltroButton";

interface Usuario {
  _id: string;
  name: string;
  email: string;
  role: string;
  ativo?: boolean;
}

const UserManagement = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [usuarioParaEditar, setUsuarioParaEditar] = useState<Usuario | null>(
    null
  );
  const [filtroRole, setFiltroRole] = useState<string>("todos");

  const buscarUsuarios = async (role = "todos") => {
    try {
      const data = await userService.getAll();
      const usuariosFiltrados =
        role === "todos"
          ? data
          : data.filter(
              (user) => user.role.toLowerCase() === role.toLowerCase()
            );
      setUsuarios(usuariosFiltrados);
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error.message || "Erro desconhecido ao buscar usuários"
      );
    }
  };

  const handleCriarUsuario = async (novoUsuario: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) => {
    try {
      await userService.create(novoUsuario);
      await buscarUsuarios(filtroRole);
      Alert.alert("Sucesso", "Usuário criado com sucesso!");
    } catch (error: any) {
      throw error;
    }
  };

  const handleAtualizarUsuario = async (
    id: string,
    dadosAtualizados: {
      name: string;
      email: string;
      password?: string;
      role: string;
    }
  ) => {
    try {
      await userService.update(id, dadosAtualizados);
      await buscarUsuarios(filtroRole);
      Alert.alert("Sucesso", "Usuário atualizado com sucesso!");
    } catch (error: any) {
      throw error;
    }
  };

  const handleDeletarUsuario = async (id: string) => {
    try {
      await userService.delete(id);
      setUsuarios((prev) => prev.filter((user) => user._id !== id));
      Alert.alert("Sucesso", "Usuário excluído com sucesso!");
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao excluir usuário");
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await buscarUsuarios(filtroRole);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    buscarUsuarios(filtroRole).finally(() => setLoading(false));
  }, [filtroRole]);

  const handleEditarUsuario = (usuario: Usuario) => {
    setUsuarioParaEditar(usuario);
    setModalVisivel(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <FiltroButton
        value={filtroRole}
        onValueChange={setFiltroRole}
        opcoes={[
          { value: "admin", label: "Administrador" },
          { value: "perito", label: "Perito" },
          { value: "assistente", label: "Assistente" },
        ]}
        estiloContainer={styles.filtroContainer}
      />

      <View style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#000" />
            <Text style={styles.loadingText}>Carregando usuários...</Text>
          </View>
        ) : (
          <FlatList
            data={usuarios}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <UserCard
                id={item._id}
                nome={item.name}
                email={item.email}
                cargo={item.role}
                ativo={item.ativo ?? true}
                onEdit={() => handleEditarUsuario(item)}
                onDelete={() => handleDeletarUsuario(item._id)}
              />
            )}
            contentContainerStyle={styles.lista}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <MaterialIcons name="people-outline" size={48} color="#666" />
                <Text style={styles.emptyText}>Nenhum usuário encontrado.</Text>
              </View>
            }
          />
        )}

        <TouchableOpacity
          style={styles.botaoAdicionar}
          onPress={() => {
            setUsuarioParaEditar(null);
            setModalVisivel(true);
          }}
        >
          <MaterialIcons name="person-add" size={24} color="#FFF" />
        </TouchableOpacity>

        <NovoUsuarioModal
          visivel={modalVisivel}
          onClose={() => {
            setModalVisivel(false);
            setUsuarioParaEditar(null);
          }}
          onSalvar={async (usuario) => {
            try {
              if (usuarioParaEditar) {
                await handleAtualizarUsuario(usuarioParaEditar._id, usuario);
              } else {
                await handleCriarUsuario(
                  usuario as {
                    name: string;
                    email: string;
                    password: string;
                    role: string;
                  }
                );
              }
              setModalVisivel(false);
            } catch (error) {
              console.error("Erro ao salvar usuário:", error);
            }
          }}
          usuarioParaEditar={usuarioParaEditar || undefined}
          modoEdicao={!!usuarioParaEditar}
        />
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  lista: {
    padding: 20,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 40,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
  botaoAdicionar: {
    backgroundColor: "#000",
    width: 56,
    height: 56,
    borderRadius: 28,
    position: "absolute",
    bottom: 140,
    right: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  filtroContainer: {
    padding: 16,
    backgroundColor: "#F7F7F7",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
});

export default UserManagement;
