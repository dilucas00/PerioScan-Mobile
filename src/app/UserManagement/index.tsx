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
import NovoUsuarioModal from "src/Components/NovoUsuarioModal";

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

  const buscarUsuarios = async () => {
    try {
      const data = await userService.getAll();
      setUsuarios(data);
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
      await buscarUsuarios();
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
      await buscarUsuarios();
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
      await buscarUsuarios();
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    buscarUsuarios().finally(() => setLoading(false));
  }, []);

  const handleEditarUsuario = (usuario: Usuario) => {
    setUsuarioParaEditar(usuario);
    setModalVisivel(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
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
            if (usuarioParaEditar) {
              await handleAtualizarUsuario(usuarioParaEditar._id, usuario);
            } else {
              await handleCriarUsuario(usuario);
            }
          }}
          usuarioParaEditar={usuarioParaEditar || undefined}
          modoEdicao={!!usuarioParaEditar}
        />
      </View>
    </SafeAreaView>
  );
};

export default UserManagement;

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
    bottom: 100,
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
});
