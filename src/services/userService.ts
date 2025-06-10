import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://perioscan-back-end-fhhq.onrender.com/api";

interface Usuario {
  _id: string;
  name: string;
  email: string;
  role: string;
  ativo?: boolean;
}

interface NovoUsuario {
  name: string;
  email: string;
  password: string;
  role: string;
}

const getToken = async () => {
  const token = await AsyncStorage.getItem("token");
  if (!token) throw new Error("Token não encontrado");
  return token;
};

const headers = async () => ({
  Authorization: `Bearer ${await getToken()}`,
  "Content-Type": "application/json",
});

export const userService = {
  // Buscar todos os usuários
  getAll: async (): Promise<Usuario[]> => {
    const response = await fetch(`${API_URL}/users`, {
      headers: await headers(),
    });

    if (!response.ok) {
      if (response.status === 401) throw new Error("Sessão expirada");
      throw new Error(`Erro ao buscar usuários: ${response.status}`);
    }

    const data = await response.json();
    return data.data.map((u: any) => ({ ...u, ativo: true }));
  },

  // Criar novo usuário
  create: async (usuario: NovoUsuario): Promise<Usuario> => {
    const response = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: await headers(),
      body: JSON.stringify(usuario),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erro ao criar usuário");
    }

    const data = await response.json();
    return { ...data.data, ativo: true };
  },

  // Atualizar usuário
  update: async (
    id: string,
    usuario: Partial<NovoUsuario>
  ): Promise<Usuario> => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: "PUT",
      headers: await headers(),
      body: JSON.stringify(usuario),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erro ao atualizar usuário");
    }

    const data = await response.json();
    return { ...data.data, ativo: true };
  },

  // Deletar usuário
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: "DELETE",
      headers: await headers(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erro ao deletar usuário");
    }
  },
};
