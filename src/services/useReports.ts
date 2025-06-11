"use client";

import { useState, useEffect } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Report {
  id: string;
  title: string;
  status: string;
  createdAt: string;
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
      setReports(Array.isArray(data.data) ? data.data : []);
    } catch (error: any) {
      console.error("Erro ao buscar relatórios:", error);
    } finally {
      setLoading(false);
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

    return response.json();
  };

  const deleteReport = async (reportId: string) => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("Você precisa estar autenticado");
    }

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
      throw new Error("Erro ao excluir relatório");
    }
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
    createReport,
    deleteReport,
  };
};
