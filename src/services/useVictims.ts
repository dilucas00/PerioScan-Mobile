"use client";

import { useState, useEffect } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Victim {
  id: string;
  identificationType: "identificada" | "não_identificada";
  name?: string;
  gender?: string;
  age?: number;
  document?: {
    type: string;
    number: string;
  };
  nic?: string;
  referenceCode?: string;
  createdAt: string;
  updatedAt?: string;
  createdBy?: {
    name: string;
  };
}

export const useVictims = (caseId?: string) => {
  const [victims, setVictims] = useState<Victim[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchVictims = async () => {
    if (!caseId) return;

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert(
          "Erro",
          "Você precisa estar autenticado para visualizar vítimas"
        );
        return;
      }

      console.log("Buscando vítimas para o caso:", caseId);
      const response = await fetch(
        `https://perioscan-back-end-fhhq.onrender.com/api/victims?case=${caseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar vítimas");
      }

      const data = await response.json();
      console.log("Dados das vítimas recebidos:", data);

      // Normalizar os dados independente da estrutura da API
      let victimsData = [];
      if (Array.isArray(data)) {
        victimsData = data;
      } else if (data.data && Array.isArray(data.data)) {
        victimsData = data.data;
      } else if (data.victims && Array.isArray(data.victims)) {
        victimsData = data.victims;
      }

      // Garantir que cada vítima tenha um ID válido
      const normalizedVictims = victimsData.map((victim: any) => ({
        id: victim.id || victim._id || Math.random().toString(36).substr(2, 9),
        identificationType: victim.identificationType || "não_identificada",
        name: victim.name,
        gender: victim.gender,
        age: victim.age,
        document: victim.document,
        nic: victim.nic,
        referenceCode: victim.referenceCode,
        createdAt: victim.createdAt || new Date().toISOString(),
        updatedAt:
          victim.updatedAt || victim.createdAt || new Date().toISOString(),
        createdBy: victim.createdBy,
      }));

      console.log("Vítimas normalizadas:", normalizedVictims);
      setVictims(normalizedVictims);
    } catch (error: any) {
      console.error("Erro ao buscar vítimas:", error);
      Alert.alert("Erro", error.message || "Erro ao buscar vítimas");
    } finally {
      setLoading(false);
    }
  };

  const getVictimById = async (victimId: string): Promise<Victim | null> => {
    try {
      console.log("Buscando vítima por ID:", victimId);

      // Primeiro, tentar encontrar nas vítimas já carregadas
      const existingVictim = victims.find((v) => v.id === victimId);
      if (existingVictim) {
        console.log("Vítima encontrada no cache:", existingVictim);
        return existingVictim;
      }

      // Se não encontrar, buscar na API
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        throw new Error("Você precisa estar autenticado");
      }

      const response = await fetch(
        `https://perioscan-back-end-fhhq.onrender.com/api/victims/${victimId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar vítima");
      }

      const data = await response.json();
      console.log("Dados da vítima individual:", data);

      // Normalizar a vítima individual
      const victimData = data.data || data;
      const normalizedVictim = {
        id: victimData.id || victimData._id || victimId,
        identificationType: victimData.identificationType || "não_identificada",
        name: victimData.name,
        gender: victimData.gender,
        age: victimData.age,
        document: victimData.document,
        nic: victimData.nic,
        referenceCode: victimData.referenceCode,
        createdAt: victimData.createdAt || new Date().toISOString(),
        updatedAt:
          victimData.updatedAt ||
          victimData.createdAt ||
          new Date().toISOString(),
        createdBy: victimData.createdBy,
      };

      console.log("Vítima normalizada:", normalizedVictim);
      return normalizedVictim;
    } catch (error: any) {
      console.error("Erro ao buscar vítima:", error);
      Alert.alert("Erro", error.message || "Erro ao buscar vítima");
      return null;
    }
  };

  const createVictim = async (victimData: {
    identificationType: "identificada" | "não_identificada";
    name?: string;
    gender?: string;
    age?: number;
    document?: {
      type: string;
      number: string;
    };
    nic?: string;
    referenceCode?: string;
    case: string;
  }) => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("Você precisa estar autenticado para registrar vítimas");
    }

    console.log("Criando vítima:", victimData);
    const response = await fetch(
      "https://perioscan-back-end-fhhq.onrender.com/api/victims",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(victimData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erro ao registrar vítima");
    }

    const result = await response.json();
    console.log("Vítima criada:", result);
    return result;
  };

  const updateVictim = async (
    victimId: string,
    victimData: Partial<{
      name: string;
      gender: string;
      age: number;
      document: {
        type: string;
        number: string;
      };
      nic: string;
      referenceCode: string;
    }>
  ) => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("Você precisa estar autenticado");
    }

    console.log("Atualizando vítima:", victimId, victimData);
    const response = await fetch(
      `https://perioscan-back-end-fhhq.onrender.com/api/victims/${victimId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(victimData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erro ao atualizar vítima");
    }

    const result = await response.json();
    console.log("Vítima atualizada:", result);
    return result;
  };

  const deleteVictim = async (victimId: string) => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("Você precisa estar autenticado");
    }

    console.log("Excluindo vítima:", victimId);
    const response = await fetch(
      `https://perioscan-back-end-fhhq.onrender.com/api/victims/${victimId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Erro ao excluir vítima");
    }

    console.log("Vítima excluída com sucesso");
  };

  useEffect(() => {
    if (caseId) {
      fetchVictims();
    }
  }, [caseId]);

  return {
    victims,
    loading,
    fetchVictims,
    getVictimById,
    createVictim,
    updateVictim,
    deleteVictim,
  };
};
