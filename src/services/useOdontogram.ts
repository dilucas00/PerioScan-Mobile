"use client";

import { useState, useEffect } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ToothData {
  number: number;
  status: "presente" | "ausente" | "implante" | "protese";
  rootCanal?: boolean;
  crown?: string;
  restorations?: string[];
  wear?: string;
  fractures?: string;
  annotations?: string;
  lastUpdate?: string;
}

export const useOdontogram = (victimId?: string) => {
  const [teeth, setTeeth] = useState<ToothData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOdontogram = async () => {
    if (!victimId) {
      console.log("🦷 VictimId não fornecido, limpando odontograma");
      setTeeth([]);
      return;
    }

    console.log("🦷 Buscando odontograma para vítima:", victimId);
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        throw new Error("Token de autenticação não encontrado");
      }

      const response = await fetch(
        `https://perioscan-back-end-fhhq.onrender.com/api/victims/${victimId}/odontogram`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          // Se não existe odontograma, inicializar com dentes padrão
          console.log("🦷 Odontograma não encontrado, inicializando...");
          setTeeth([]);
          return;
        }
        throw new Error(`Erro ao buscar odontograma: ${response.status}`);
      }

      const data = await response.json();
      console.log("🦷 Odontograma recebido:", data);

      // Normalizar dados
      const teethData = data.data || data.teeth || data;
      setTeeth(Array.isArray(teethData) ? teethData : []);
    } catch (error: any) {
      console.error("❌ Erro ao buscar odontograma:", error);
      // Não mostrar alert para erro 404, apenas limpar dados
      if (!error.message.includes("404")) {
        Alert.alert("Erro", error.message || "Erro ao carregar odontograma");
      }
      setTeeth([]);
    } finally {
      setLoading(false);
    }
  };

  const updateTooth = async (
    toothNumber: number,
    toothData: Partial<ToothData>
  ) => {
    if (!victimId) return;

    console.log("🦷 Atualizando dente:", toothNumber, toothData);
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        throw new Error("Token de autenticação não encontrado");
      }

      const response = await fetch(
        `https://perioscan-back-end-fhhq.onrender.com/api/victims/${victimId}/odontogram/${toothNumber}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(toothData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Erro ao atualizar dente: ${response.status}`
        );
      }

      const result = await response.json();
      console.log("✅ Dente atualizado:", result);

      // Atualizar estado local
      setTeeth((prevTeeth) => {
        const existingIndex = prevTeeth.findIndex(
          (tooth) => tooth.number === toothNumber
        );
        const updatedTooth = {
          number: toothNumber,
          ...toothData,
          lastUpdate: new Date().toISOString(),
        } as ToothData;

        if (existingIndex >= 0) {
          // Atualizar dente existente
          const newTeeth = [...prevTeeth];
          newTeeth[existingIndex] = {
            ...newTeeth[existingIndex],
            ...updatedTooth,
          };
          return newTeeth;
        } else {
          // Adicionar novo dente
          return [...prevTeeth, updatedTooth];
        }
      });

      Alert.alert("Sucesso", "Dente atualizado com sucesso!");
    } catch (error: any) {
      console.error("❌ Erro ao atualizar dente:", error);
      Alert.alert("Erro", error.message || "Erro ao atualizar dente");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getOdontogramSummary = () => {
    const summary = {
      total: 32, // Total de dentes permanentes
      presente: 0,
      ausente: 0,
      implante: 0,
      protese: 0,
      comCanal: 0,
      comRestauracao: 0,
    };

    teeth.forEach((tooth) => {
      switch (tooth.status) {
        case "presente":
          summary.presente++;
          break;
        case "ausente":
          summary.ausente++;
          break;
        case "implante":
          summary.implante++;
          break;
        case "protese":
          summary.protese++;
          break;
      }

      if (tooth.rootCanal) summary.comCanal++;
      if (tooth.restorations && tooth.restorations.length > 0)
        summary.comRestauracao++;
    });

    return summary;
  };

  useEffect(() => {
    if (victimId) {
      fetchOdontogram();
    }
  }, [victimId]);

  return {
    teeth,
    loading,
    fetchOdontogram,
    updateTooth,
    getOdontogramSummary,
  };
};
