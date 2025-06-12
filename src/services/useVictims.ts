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
    console.log("🚀 === INICIANDO BUSCA DE VÍTIMAS ===");
    console.log("📋 CaseId recebido:", caseId);
    console.log("📋 Tipo do caseId:", typeof caseId);
    console.log("📋 Tamanho do caseId:", caseId?.length);
    console.log("📋 CaseId é válido:", !!caseId);

    if (!caseId) {
      console.log("❌ CaseId não fornecido, abortando busca");
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");
      console.log("🔑 Token encontrado:", !!token);

      if (!token) {
        console.log("❌ Token não encontrado no AsyncStorage");
        Alert.alert(
          "Erro",
          "Você precisa estar autenticado para visualizar vítimas"
        );
        return;
      }

      // Testar diferentes formatos de URL
      const urls = [
        `https://perioscan-back-end-fhhq.onrender.com/api/victims?case=${caseId}`,
        `https://perioscan-back-end-fhhq.onrender.com/api/victims?caseId=${caseId}`,
        `https://perioscan-back-end-fhhq.onrender.com/api/victims?case_id=${caseId}`,
        `https://perioscan-back-end-fhhq.onrender.com/api/victims/${caseId}`,
        `https://perioscan-back-end-fhhq.onrender.com/api/cases/${caseId}/victims`,
      ];

      console.log("🧪 === TESTANDO DIFERENTES FORMATOS DE URL ===");

      for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        console.log(`\n🌐 Testando URL ${i + 1}:`, url);

        try {
          const response = await fetch(url, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          console.log(`📊 Status ${i + 1}:`, response.status);
          console.log(`📊 StatusText ${i + 1}:`, response.statusText);

          if (response.ok) {
            const responseText = await response.text();
            console.log(
              `📦 Resposta ${i + 1} (primeiros 500 chars):`,
              responseText.substring(0, 500)
            );

            let data;
            try {
              data = JSON.parse(responseText);
            } catch (e) {
              console.log(`❌ Erro de parse JSON na URL ${i + 1}`);
              continue;
            }

            console.log(`📊 Estrutura da resposta ${i + 1}:`);
            console.log(`   - Tipo:`, typeof data);
            console.log(`   - É array:`, Array.isArray(data));
            console.log(`   - Keys:`, Object.keys(data));

            if (data.success !== undefined)
              console.log(`   - success:`, data.success);
            if (data.count !== undefined)
              console.log(`   - count:`, data.count);
            if (data.data !== undefined) {
              console.log(`   - data tipo:`, typeof data.data);
              console.log(`   - data é array:`, Array.isArray(data.data));
              if (Array.isArray(data.data)) {
                console.log(`   - data length:`, data.data.length);
                if (data.data.length > 0) {
                  console.log(`   - primeiro item:`, data.data[0]);
                }
              }
            }

            // Se encontrou dados, usar esta URL
            if (
              (Array.isArray(data) && data.length > 0) ||
              (data.data && Array.isArray(data.data) && data.data.length > 0) ||
              (data.victims &&
                Array.isArray(data.victims) &&
                data.victims.length > 0)
            ) {
              console.log(`✅ ENCONTROU DADOS NA URL ${i + 1}!`);

              // Processar os dados encontrados
              let victimsData = [];
              if (Array.isArray(data)) {
                victimsData = data;
              } else if (data.data && Array.isArray(data.data)) {
                victimsData = data.data;
              } else if (data.victims && Array.isArray(data.victims)) {
                victimsData = data.victims;
              }

              const normalizedVictims = victimsData.map(
                (victim: any, index: number) => {
                  console.log(`🔄 Normalizando vítima ${index + 1}:`, victim);
                  return {
                    id:
                      victim.id ||
                      victim._id ||
                      `temp_${Math.random().toString(36).substr(2, 9)}`,
                    identificationType:
                      victim.identificationType || "não_identificada",
                    name: victim.name,
                    gender: victim.gender,
                    age: victim.age,
                    document: victim.document,
                    nic: victim.nic,
                    referenceCode: victim.referenceCode,
                    createdAt: victim.createdAt || new Date().toISOString(),
                    updatedAt:
                      victim.updatedAt ||
                      victim.createdAt ||
                      new Date().toISOString(),
                    createdBy: victim.createdBy,
                  };
                }
              );

              console.log(
                "✅ Vítimas encontradas e normalizadas:",
                normalizedVictims
              );
              setVictims(normalizedVictims);
              return; // Sair da função se encontrou dados
            }
          } else {
            console.log(`❌ URL ${i + 1} retornou erro:`, response.status);
            if (response.status !== 404) {
              const errorText = await response
                .text()
                .catch(() => "Não foi possível ler erro");
              console.log(
                `❌ Erro da URL ${i + 1}:`,
                errorText.substring(0, 200)
              );
            }
          }
        } catch (error) {
          console.log(`❌ Erro na URL ${i + 1}:`, (error as Error).message);
        }
      }

      // Se chegou até aqui, nenhuma URL funcionou
      console.log("❌ NENHUMA URL RETORNOU DADOS");
      console.log("🔍 === INFORMAÇÕES PARA DEBUG ===");
      console.log("🔍 CaseId usado:", caseId);
      console.log("🔍 Tipo do caseId:", typeof caseId);
      console.log("🔍 CaseId em diferentes formatos:");
      console.log("   - Original:", caseId);
      console.log("   - String:", String(caseId));
      console.log("   - Encoded:", encodeURIComponent(caseId));
      console.log("   - Trim:", caseId.trim());

      // Tentar buscar TODAS as vítimas para debug
      console.log("🔍 === BUSCANDO TODAS AS VÍTIMAS PARA DEBUG ===");
      try {
        const allVictimsResponse = await fetch(
          "https://perioscan-back-end-fhhq.onrender.com/api/victims",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (allVictimsResponse.ok) {
          const allVictimsData = await allVictimsResponse.json();
          console.log("📊 Todas as vítimas no sistema:");
          console.log("   - Count:", allVictimsData.count || "N/A");
          console.log(
            "   - Total de vítimas:",
            allVictimsData.data?.length || 0
          );

          if (allVictimsData.data && allVictimsData.data.length > 0) {
            console.log("📋 Primeiras 3 vítimas:");
            allVictimsData.data
              .slice(0, 3)
              .forEach((victim: any, index: number) => {
                console.log(
                  `   ${index + 1}. ID: ${victim.id}, Case: ${
                    victim.case || victim.caseId || "N/A"
                  }, Nome: ${victim.name || victim.referenceCode || "N/A"}`
                );
              });

            // Verificar se alguma vítima tem o caseId procurado
            const matchingVictims = allVictimsData.data.filter(
              (victim: any) =>
                victim.case === caseId ||
                victim.caseId === caseId ||
                victim.case_id === caseId ||
                String(victim.case) === String(caseId) ||
                String(victim.caseId) === String(caseId)
            );

            console.log(
              `🎯 Vítimas que correspondem ao caseId ${caseId}:`,
              matchingVictims.length
            );
            if (matchingVictims.length > 0) {
              console.log("✅ VÍTIMAS ENCONTRADAS COM BUSCA MANUAL:");
              matchingVictims.forEach((victim: any, index: number) => {
                console.log(`   ${index + 1}.`, victim);
              });
            }
          }
        }
      } catch (debugError) {
        console.log(
          "❌ Erro ao buscar todas as vítimas:",
          (debugError as Error).message
        );
      }

      setVictims([]);
    } catch (error: any) {
      console.log("❌ === ERRO GERAL NA BUSCA DE VÍTIMAS ===");
      console.log("❌ Erro:", error.message);
      Alert.alert("Erro", error.message || "Erro ao buscar vítimas");
    } finally {
      setLoading(false);
      console.log("🏁 === FIM DA BUSCA DE VÍTIMAS ===");
    }
  };

  const getVictimById = async (victimId: string): Promise<Victim | null> => {
    console.log("🔍 === INICIANDO BUSCA DE VÍTIMA POR ID ===");
    console.log("🎯 ID da vítima:", victimId);

    try {
      // Primeiro, tentar encontrar nas vítimas já carregadas
      const existingVictim = victims.find((v) => v.id === victimId);
      if (existingVictim) {
        console.log("✅ Vítima encontrada no cache:", existingVictim);
        return existingVictim;
      }

      console.log("🌐 Buscando na API...");
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        throw new Error("Você precisa estar autenticado");
      }

      const response = await fetch(
        `https://perioscan-back-end-fhhq.onrender.com/api/victims/${victimId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("📊 Status da resposta:", response.status);

      if (!response.ok) {
        if (response.status === 404) {
          console.log("❌ Vítima não encontrada (404)");
          return null;
        }
        throw new Error(`Erro ao buscar vítima: ${response.status}`);
      }

      const data = await response.json();
      console.log("📦 Dados da vítima:", data);

      const victimData = data.data || data.victim || data;
      if (!victimData) return null;

      const normalizedVictim: Victim = {
        id: victimData.id || victimData._id || victimId,
        identificationType: victimData.identificationType || "não_identificada",
        name: victimData.name || undefined,
        gender: victimData.gender || undefined,
        age: victimData.age || undefined,
        document: victimData.document || undefined,
        nic: victimData.nic || undefined,
        referenceCode: victimData.referenceCode || undefined,
        createdAt: victimData.createdAt || new Date().toISOString(),
        updatedAt:
          victimData.updatedAt ||
          victimData.createdAt ||
          new Date().toISOString(),
        createdBy: victimData.createdBy || undefined,
      };

      console.log("✅ Vítima normalizada:", normalizedVictim);
      return normalizedVictim;
    } catch (error: any) {
      console.log("❌ Erro ao buscar vítima:", error.message);
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

    console.log("➕ Criando vítima:", victimData);
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
    console.log("✅ Vítima criada:", result);
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
    return result;
  };

  const deleteVictim = async (victimId: string) => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("Você precisa estar autenticado");
    }

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
