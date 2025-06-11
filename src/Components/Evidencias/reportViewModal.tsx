"use client";

import React from "react";
import { View, StyleSheet, ScrollView, Alert, Platform } from "react-native";
import {
  Text,
  Modal,
  Portal,
  Button,
  IconButton,
  ActivityIndicator,
} from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

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

interface ReportViewModalProps {
  visible: boolean;
  onDismiss: () => void;
  report: Report | null;
  onEdit?: () => void;
}

const ReportViewModal: React.FC<ReportViewModalProps> = ({
  visible,
  onDismiss,
  report,
  onEdit,
}) => {
  const [pdfLoading, setPdfLoading] = React.useState(false);
  const [reportDetails, setReportDetails] = React.useState<any>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = () => {
    return report?.status === "finalizado" ? "#2E7D32" : "#E65100";
  };

  const getStatusBackground = () => {
    return report?.status === "finalizado" ? "#E8F5E9" : "#FFF3E0";
  };

  const sanitizeFileName = (fileName: string) => {
    return fileName
      .replace(/[^a-zA-Z0-9\s]/g, "") // Remove caracteres especiais
      .replace(/\s+/g, "_") // Substitui espaços por underscore
      .substring(0, 50); // Limita o tamanho
  };

  // Função para buscar detalhes completos do relatório
  const fetchReportDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token || !report?.id) return;

      console.log("Buscando detalhes completos do relatório...");
      const response = await fetch(
        `https://perioscan-back-end-fhhq.onrender.com/api/reports/${report.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Detalhes completos do relatório:", data);
        setReportDetails(data);
        return data;
      } else {
        console.log("Erro ao buscar detalhes:", response.status);
        return null;
      }
    } catch (error) {
      console.error("Erro ao buscar detalhes do relatório:", error);
      return null;
    }
  };

  const handleGeneratePDF = async () => {
    setPdfLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Erro", "Você precisa estar autenticado para gerar PDF");
        return;
      }

      console.log("=== INICIANDO GERAÇÃO DE PDF ===");
      console.log("Report ID:", report?.id);
      console.log("Report Title:", report?.title);

      // Verificar se o relatório tem dados necessários
      if (!report?.id) {
        throw new Error("ID do relatório não encontrado");
      }

      // Buscar detalhes completos antes de tentar gerar o PDF
      const fullReportData = await fetchReportDetails();
      if (!fullReportData) {
        throw new Error(
          "Não foi possível carregar os detalhes completos do relatório"
        );
      }

      const url = `https://perioscan-back-end-fhhq.onrender.com/api/reports/${report.id}/pdf`;
      console.log("URL da requisição:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/pdf",
        },
      });

      console.log("Status da resposta:", response.status);
      console.log(
        "Headers da resposta:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        let errorMessage = "Erro ao gerar PDF";
        try {
          const errorData = await response.json();
          console.log("Dados do erro:", errorData);

          // Tratar erro específico do backend
          if (
            errorData.message &&
            errorData.message.includes("Cannot read properties of null")
          ) {
            errorMessage =
              "Erro no servidor: Dados incompletos no relatório ou usuário não encontrado. " +
              "Isso pode acontecer se:\n" +
              "• O usuário que criou o relatório foi removido\n" +
              "• O caso associado foi excluído\n" +
              "• Há dados corrompidos no banco\n\n" +
              "Contate o administrador do sistema.";
          } else {
            errorMessage =
              errorData.message ||
              errorData.error ||
              `Erro ${response.status}: ${response.statusText}`;
          }
        } catch (parseError) {
          console.log("Erro ao fazer parse da resposta de erro:", parseError);
          errorMessage = `Erro ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      // Verificar se a resposta é realmente um PDF
      const contentType = response.headers.get("content-type");
      console.log("Content-Type:", contentType);

      if (!contentType || !contentType.includes("application/pdf")) {
        // Se não for PDF, tentar ler como JSON para ver se há erro
        try {
          const textResponse = await response.text();
          console.log("Resposta não-PDF:", textResponse);
          throw new Error(
            "O servidor retornou um formato inválido. Esperado: PDF, Recebido: " +
              contentType
          );
        } catch (textError) {
          throw new Error("Formato de resposta inválido");
        }
      }

      // Para web, usar download direto
      if (Platform.OS === "web") {
        console.log("Processando download para web...");
        const blob = await response.blob();
        console.log("Blob criado, tamanho:", blob.size);

        if (blob.size === 0) {
          throw new Error("PDF gerado está vazio");
        }

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        const fileName = `relatorio_${sanitizeFileName(
          report?.title
        )}_${new Date().getTime()}.pdf`;

        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        console.log("Download iniciado para:", fileName);
        Alert.alert("Sucesso", "PDF baixado com sucesso!");
      } else {
        // Para mobile, usar FileSystem
        console.log("Processando download para mobile...");
        const blob = await response.blob();

        if (blob.size === 0) {
          throw new Error("PDF gerado está vazio");
        }

        const reader = new FileReader();

        reader.onload = async () => {
          try {
            const base64Data = (reader.result as string).split(",")[1];
            const fileName = `relatorio_${sanitizeFileName(
              report?.title
            )}_${new Date().getTime()}.pdf`;
            const fileUri = `${FileSystem.documentDirectory}${fileName}`;

            await FileSystem.writeAsStringAsync(fileUri, base64Data, {
              encoding: FileSystem.EncodingType.Base64,
            });

            console.log("Arquivo salvo em:", fileUri);

            // Verificar se o compartilhamento está disponível
            const isAvailable = await Sharing.isAvailableAsync();
            if (isAvailable) {
              await Sharing.shareAsync(fileUri, {
                mimeType: "application/pdf",
                dialogTitle: "Salvar PDF do Relatório",
              });
            } else {
              Alert.alert("Sucesso", `PDF salvo em: ${fileUri}`);
            }
          } catch (error) {
            console.error("Erro ao salvar PDF:", error);
            Alert.alert("Erro", "Erro ao salvar o arquivo PDF");
          }
        };

        reader.onerror = () => {
          console.error("Erro ao ler blob");
          Alert.alert("Erro", "Erro ao processar o arquivo PDF");
        };

        reader.readAsDataURL(blob);
      }
    } catch (error: any) {
      console.error("=== ERRO NA GERAÇÃO DE PDF ===");
      console.error("Erro completo:", error);

      let userMessage = "Erro ao gerar PDF";

      if (error.message) {
        userMessage = error.message;
      }

      Alert.alert("Erro", userMessage);
    } finally {
      setPdfLoading(false);
      console.log("=== FIM DA GERAÇÃO DE PDF ===");
    }
  };

  const requestStoragePermission = () => {
    Alert.alert(
      "Permissão de Armazenamento",
      "Este aplicativo precisa acessar o armazenamento do seu dispositivo para salvar o PDF. Deseja continuar?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Permitir",
          onPress: handleGeneratePDF,
        },
      ]
    );
  };

  const showTechnicalDetails = () => {
    const details = `
Detalhes Técnicos do Relatório:

ID: ${report?.id}
Título: ${report?.title}
Status: ${report?.status}
Criado em: ${report?.createdAt}

${
  reportDetails
    ? `
Dados completos carregados: Sim
Usuário criador: ${reportDetails.data?.createdBy?.name || "Não encontrado"}
Caso associado: ${reportDetails.data?.case?.title || "Não encontrado"}
`
    : "Dados completos: Não carregados"
}

Este erro geralmente indica que há dados faltando no banco de dados.
    `.trim();

    Alert.alert("Detalhes Técnicos", details);
  };

  // Buscar detalhes quando o modal abrir
  React.useEffect(() => {
    if (visible && report) {
      fetchReportDetails();
    }
  }, [visible, report]);

  if (!report) return null;

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header com botão X */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <MaterialIcons name="description" size={24} color="#000" />
              <Text style={styles.modalTitle}>Visualizar Relatório</Text>
            </View>
            <View style={styles.headerRight}>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusBackground() },
                ]}
              >
                <Text style={[styles.statusText, { color: getStatusColor() }]}>
                  {report.status === "finalizado" ? "Finalizado" : "Rascunho"}
                </Text>
              </View>
              <IconButton
                icon="close"
                size={20}
                iconColor="#666"
                onPress={onDismiss}
                style={styles.closeButton}
              />
            </View>
          </View>

          {/* Título */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Título</Text>
            <View style={styles.contentBox}>
              <Text style={styles.contentText}>{report.title}</Text>
            </View>
          </View>

          {/* Conteúdo */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Conteúdo</Text>
            <View style={[styles.contentBox, styles.multilineBox]}>
              <Text style={styles.contentText}>{report.content}</Text>
            </View>
          </View>

          {/* Metodologia */}
          {report.methodology && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Metodologia</Text>
              <View style={[styles.contentBox, styles.multilineBox]}>
                <Text style={styles.contentText}>{report.methodology}</Text>
              </View>
            </View>
          )}

          {/* Conclusão */}
          {report.conclusion && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Conclusão</Text>
              <View style={[styles.contentBox, styles.multilineBox]}>
                <Text style={styles.contentText}>{report.conclusion}</Text>
              </View>
            </View>
          )}

          {/* Informações de Data */}
          <View style={styles.dateSection}>
            <View style={styles.dateItem}>
              <MaterialIcons name="schedule" size={16} color="#666" />
              <Text style={styles.dateLabel}>Criado em:</Text>
              <Text style={styles.dateText}>
                {formatDate(report.createdAt)}
              </Text>
            </View>
            {report.updatedAt && report.updatedAt !== report.createdAt && (
              <View style={styles.dateItem}>
                <MaterialIcons name="update" size={16} color="#666" />
                <Text style={styles.dateLabel}>Atualizado em:</Text>
                <Text style={styles.dateText}>
                  {formatDate(report.updatedAt)}
                </Text>
              </View>
            )}
          </View>

          {/* Botões */}
          <View style={styles.buttons}>
            {onEdit && (
              <Button
                mode="outlined"
                onPress={onEdit}
                style={styles.editButton}
                textColor="#000"
                icon="edit"
                labelStyle={{ fontWeight: "bold" }}
              >
                Editar
              </Button>
            )}

            <Button
              mode="contained"
              onPress={
                Platform.OS === "web"
                  ? handleGeneratePDF
                  : requestStoragePermission
              }
              style={styles.pdfButton}
              buttonColor="#DC2626"
              textColor="#FFF"
              icon="file-pdf-box"
              disabled={pdfLoading}
              labelStyle={{ fontWeight: "bold" }}
            >
              {pdfLoading ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                "Exportar PDF"
              )}
            </Button>
          </View>

          {/* Botão de detalhes técnicos para debug */}
          <View style={styles.debugButtons}>
            <Button
              mode="text"
              onPress={showTechnicalDetails}
              textColor="#666"
              icon="information"
              labelStyle={{ fontSize: 12 }}
            >
              Ver Detalhes Técnicos
            </Button>
          </View>
        </ScrollView>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "white",
    padding: 24,
    marginHorizontal: 20,
    marginVertical: 40,
    borderRadius: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    maxHeight: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginLeft: 8,
  },
  closeButton: {
    margin: 0,
    backgroundColor: "#F5F5F5",
    width: 32,
    height: 32,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  contentBox: {
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  multilineBox: {
    minHeight: 80,
  },
  contentText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  dateSection: {
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  dateItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  dateLabel: {
    fontSize: 13,
    color: "#666",
    marginLeft: 6,
    marginRight: 8,
    fontWeight: "500",
  },
  dateText: {
    fontSize: 13,
    color: "#333",
    flex: 1,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  editButton: {
    flex: 1,
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 8,
  },
  pdfButton: {
    flex: 1,
    borderRadius: 8,
  },
  debugButtons: {
    marginTop: 16,
    alignItems: "center",
  },
});

export default ReportViewModal;
