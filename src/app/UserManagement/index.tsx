import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserCard from "src/Components/UserCard";
import NovoUsuarioModal from "src/Components/NovoUsuarioModal";
import AppBarHeader from "src/Components/AppBarHeader";

interface Usuario {
  _id: string;
  name: string;
  email: string;
  role: string;
  ativo?: boolean; // pode não vir da API
}

const UserManagement = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [loading, setLoading] = useState(false);

  const buscarUsuarios = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Erro", "Token não encontrado. Faça login novamente.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        "https://perioscan-back-end-fhhq.onrender.com/api/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          Alert.alert("Erro", "Sessão expirada. Faça login novamente.");
        } else {
          Alert.alert("Erro", `Erro ao buscar usuários: ${response.status}`);
        }
        setLoading(false);
        return;
      }

      const data = await response.json();

      // Aqui pegamos o array correto dentro de data.data
      if (data && Array.isArray(data.data)) {
        // Setar ativo sempre true (se quiser), pois não vem no retorno
        const usuariosFormatados = data.data.map((u: any) => ({
          ...u,
          ativo: true,
        }));
        setUsuarios(usuariosFormatados);
      } else {
        setUsuarios([]);
      }
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error.message || "Erro desconhecido ao buscar usuários"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarUsuarios();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <AppBarHeader title="Gerenciamento de Usuário" />

      <View style={styles.container}>
        {loading ? (
          <Text>Carregando usuários...</Text>
        ) : usuarios.length === 0 ? (
          <Text>Nenhum usuário encontrado.</Text>
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
                onEdit={() => alert(`Editar usuário: ${item.name}`)}
              />
            )}
            contentContainerStyle={styles.lista}
          />
        )}

        <TouchableOpacity
          style={styles.botao}
          onPress={() => setModalVisivel(true)}
        >
          <Text style={styles.textoBotao}>+ Novo Usuário</Text>
        </TouchableOpacity>

        <NovoUsuarioModal
          visivel={modalVisivel}
          onClose={() => setModalVisivel(false)}
          onSalvar={(novoUsuario) => {
            setUsuarios((prev) => [
              ...prev,
              { _id: Date.now().toString(), ativo: true, ...novoUsuario },
            ]);
            setModalVisivel(false);
          }}
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
