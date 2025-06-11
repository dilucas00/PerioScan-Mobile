"use client";

import { useState, useEffect } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Report {
  id: string;
  title: string;
  content: string;
  methodology?: string;
  conclusion?: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

export const useReports = (caseId?: string) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReports = async () => {
    if (!caseId) return;

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert(
          "Erro",
          "Você precisa estar autenticado para visualizar relatórios"
        );
        return;
      }

      console.log("Buscando relatórios para o caso:", caseId);
      const response = await fetch(
        `https://perioscan-back-end-fhhq.onrender.com/api/reports?case=${caseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar relatórios");
      }

      const data = await response.json();
      console.log("Dados dos relatórios recebidos:", data);

      // Normalizar os dados independente da estrutura da API
      let reportsData = [];
      if (Array.isArray(data)) {
        reportsData = data;
      } else if (data.data && Array.isArray(data.data)) {
        reportsData = data.data;
      } else if (data.reports && Array.isArray(data.reports)) {
        reportsData = data.reports;
      }

      // Garantir que cada relatório tenha um ID válido
      const normalizedReports = reportsData.map((report: any) => ({
        id: report.id || report._id || Math.random().toString(36).substr(2, 9),
        title: report.title || "Relatório sem título",
        content: report.content || "",
        methodology: report.methodology || "",
        conclusion: report.conclusion || "",
        status: report.status || "rascunho",
        createdAt: report.createdAt || new Date().toISOString(),
        updatedAt:
          report.updatedAt || report.createdAt || new Date().toISOString(),
      }));

      console.log("Relatórios normalizados:", normalizedReports);
      setReports(normalizedReports);
    } catch (error: any) {
      console.error("Erro ao buscar relatórios:", error);
      Alert.alert("Erro", error.message || "Erro ao buscar relatórios");
    } finally {
      setLoading(false);
    }
  };

  const getReportById = async (reportId: string): Promise<Report | null> => {
    try {
      console.log("Buscando relatório por ID:", reportId);

      // Primeiro, tentar encontrar nos relatórios já carregados
      const existingReport = reports.find((r) => r.id === reportId);
      if (existingReport) {
        console.log("Relatório encontrado no cache:", existingReport);
        return existingReport;
      }

      // Se não encontrar, buscar na API
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        throw new Error("Você precisa estar autenticado");
      }

      const response = await fetch(
        `https://perioscan-back-end-fhhq.onrender.com/api/reports/${reportId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar relatório");
      }

      const data = await response.json();
      console.log("Dados do relatório individual:", data);

      // Normalizar o relatório individual
      const reportData = data.data || data;
      const normalizedReport = {
        id: reportData.id || reportData._id || reportId,
        title: reportData.title || "Relatório sem título",
        content: reportData.content || "",
        methodology: reportData.methodology || "",
        conclusion: reportData.conclusion || "",
        status: reportData.status || "rascunho",
        createdAt: reportData.createdAt || new Date().toISOString(),
        updatedAt:
          reportData.updatedAt ||
          reportData.createdAt ||
          new Date().toISOString(),
      };

      console.log("Relatório normalizado:", normalizedReport);
      return normalizedReport;
    } catch (error: any) {
      console.error("Erro ao buscar relatório:", error);
      Alert.alert("Erro", error.message || "Erro ao buscar relatório");
      return null;
    }
  };

  const createReport = async (reportData: {
    title: string;
    content: string;
    case: string;
    methodology?: string;
    conclusion?: string;
    status: string;
    attachments: string[];
  }) => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("Você precisa estar autenticado para gerar relatórios");
    }

    console.log("Criando relatório:", reportData);
    const response = await fetch(
      "https://perioscan-back-end-fhhq.onrender.com/api/reports",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reportData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erro ao gerar relatório");
    }

    const result = await response.json();
    console.log("Relatório criado:", result);
    return result;
  };

  const deleteReport = async (reportId: string) => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("Você precisa estar autenticado");
    }

    console.log("Excluindo relatório:", reportId);
    const response = await fetch(
      `https://perioscan-back-end-fhhq.onrender.com/api/reports/${reportId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Erro ao excluir relatório");
    }

    console.log("Relatório excluído com sucesso");
  };

  useEffect(() => {
    if (caseId) {
      fetchReports();
    }
  }, [caseId]);

  return {
    reports,
    loading,
    fetchReports,
    getReportById,
    createReport,
    deleteReport,
  };
};
