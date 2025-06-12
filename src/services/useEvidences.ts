"use client";

import { useState, useEffect } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Evidence {
  id: string;
  type: string;
  description: string;
  content?: string;
  contentType?: string;
  imageType?: string;
  cloudinary?: {
    url: string;
    public_id: string;
    format: string;
    width: number;
    height: number;
    bytes: number;
  };
  location: string;
  createdAt: string;
  updatedAt?: string;
}

export const useEvidences = (caseId?: string) => {
  const [evidences, setEvidences] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEvidences = async () => {
    if (!caseId) return;

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert(
          "Erro",
          "Você precisa estar autenticado para visualizar evidências"
        );
        return;
      }

      console.log("Buscando evidências para o caso:", caseId);
      const response = await fetch(
        `https://perioscan-back-end-fhhq.onrender.com/api/evidence?case=${caseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar evidências");
      }

      const data = await response.json();
      console.log("Dados das evidências recebidos:", data);

      // Normalizar os dados independente da estrutura da API
      let evidencesData = [];
      if (Array.isArray(data)) {
        evidencesData = data;
      } else if (data.data && Array.isArray(data.data)) {
        evidencesData = data.data;
      } else if (data.evidences && Array.isArray(data.evidences)) {
        evidencesData = data.evidences;
      }

      // Garantir que cada evidência tenha um ID válido
      const normalizedEvidences = evidencesData.map((evidence: any) => ({
        id:
          evidence.id ||
          evidence._id ||
          Math.random().toString(36).substr(2, 9),
        type: evidence.type || "text",
        description: evidence.description || "Evidência sem descrição",
        content: evidence.content,
        contentType: evidence.contentType,
        imageType: evidence.imageType,
        cloudinary: evidence.cloudinary,
        location: evidence.location || "",
        createdAt: evidence.createdAt || new Date().toISOString(),
        updatedAt:
          evidence.updatedAt || evidence.createdAt || new Date().toISOString(),
      }));

      console.log("Evidências normalizadas:", normalizedEvidences);
      setEvidences(normalizedEvidences);
    } catch (error: any) {
      console.error("Erro ao buscar evidências:", error);
      Alert.alert("Erro", error.message || "Erro ao buscar evidências");
    } finally {
      setLoading(false);
    }
  };

  const getEvidenceById = async (
    evidenceId: string
  ): Promise<Evidence | null> => {
    try {
      console.log("Buscando evidência por ID:", evidenceId);

      // Primeiro, tentar encontrar nas evidências já carregadas
      const existingEvidence = evidences.find((e) => e.id === evidenceId);
      if (existingEvidence) {
        console.log("Evidência encontrada no cache:", existingEvidence);
        return existingEvidence;
      }

      // Se não encontrar, buscar na API
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        throw new Error("Você precisa estar autenticado");
      }

      const response = await fetch(
        `https://perioscan-back-end-fhhq.onrender.com/api/evidence/${evidenceId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar evidência");
      }

      const data = await response.json();
      console.log("Dados da evidência individual:", data);

      // Normalizar a evidência individual
      const evidenceData = data.data || data;
      const normalizedEvidence = {
        id: evidenceData.id || evidenceData._id || evidenceId,
        type: evidenceData.type || "text",
        description: evidenceData.description || "Evidência sem descrição",
        content: evidenceData.content,
        contentType: evidenceData.contentType,
        imageType: evidenceData.imageType,
        cloudinary: evidenceData.cloudinary,
        location: evidenceData.location || "",
        createdAt: evidenceData.createdAt || new Date().toISOString(),
        updatedAt:
          evidenceData.updatedAt ||
          evidenceData.createdAt ||
          new Date().toISOString(),
      };

      console.log("Evidência normalizada:", normalizedEvidence);
      return normalizedEvidence;
    } catch (error: any) {
      console.error("Erro ao buscar evidência:", error);
      Alert.alert("Erro", error.message || "Erro ao buscar evidência");
      return null;
    }
  };

  const createTextEvidence = async (evidenceData: {
    description: string;
    content: string;
    contentType: string;
    case: string;
    location: string;
  }) => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error(
        "Você precisa estar autenticado para registrar evidências"
      );
    }

    const payload = {
      type: "text",
      case: evidenceData.case,
      description: evidenceData.description,
      content: evidenceData.content,
      contentType: evidenceData.contentType,
      location: evidenceData.location,
    };

    console.log("Criando evidência de texto:", payload);
    const response = await fetch(
      "https://perioscan-back-end-fhhq.onrender.com/api/evidence",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erro ao registrar evidência de texto"
      );
    }

    const result = await response.json();
    console.log("Evidência de texto criada:", result);
    return result;
  };

  const createImageEvidence = async (evidenceData: {
    description: string;
    imageType: string;
    case: string;
    location: string;
    cloudinary: {
      url: string;
      public_id: string;
      format: string;
      width: number;
      height: number;
      bytes: number;
    };
  }) => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error(
        "Você precisa estar autenticado para registrar evidências"
      );
    }

    const payload = {
      type: "image",
      case: evidenceData.case,
      description: evidenceData.description,
      imageType: evidenceData.imageType,
      cloudinary: evidenceData.cloudinary,
      location: evidenceData.location,
    };

    console.log("Criando evidência de imagem:", payload);
    const response = await fetch(
      "https://perioscan-back-end-fhhq.onrender.com/api/evidence",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erro ao registrar evidência de imagem"
      );
    }

    const result = await response.json();
    console.log("Evidência de imagem criada:", result);
    return result;
  };

  const deleteEvidence = async (evidenceId: string) => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("Você precisa estar autenticado");
    }

    console.log("Excluindo evidência:", evidenceId);
    const response = await fetch(
      `https://perioscan-back-end-fhhq.onrender.com/api/evidence/${evidenceId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Erro ao excluir evidência");
    }

    console.log("Evidência excluída com sucesso");
  };

  useEffect(() => {
    if (caseId) {
      fetchEvidences();
    }
  }, [caseId]);

  return {
    evidences,
    loading,
    fetchEvidences,
    getEvidenceById,
    createTextEvidence,
    createImageEvidence,
    deleteEvidence,
  };
};
