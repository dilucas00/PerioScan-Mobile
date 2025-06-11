import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { LineChart, PieChart, BarChart } from "react-native-chart-kit";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import AppBarHeader from "src/Components/AppBarHeader";

// Add proper typing
interface Case {
  _id?: string;
  id?: string;
  title?: string;
  status?: string;
  openDate?: string;
  closeDate?: string;
  createdAt: string;
  updatedAt?: string;
  createdBy?: {
    name?: string;
  };
}

interface User {
  _id?: string;
  id?: string;
  name?: string;
  role?: string;
  active?: boolean;
  createdAt?: string;
}

interface DashboardData {
  totalCasos: number;
  casosEmAndamento: number;
  casosFinalizados: number;
  casosArquivados: number;
  casosPendentes: number;
  casosCancelados: number;
  totalUsuarios: number;
  usuariosAtivos: number;
  usuariosPeritos: number;
  usuariosAssistentes: number;
  usuariosAdmin: number;
  casosRecentes: Case[];
  atividadesRecentes: Atividade[];
  totalVitimas: number;
  vitimasIdentificadas: number;
  vitimasNaoIdentificadas: number;
  vitimasPendentes: number;
}

interface ChartDataPoint {
  name: string;
  population: number;
  color: string;
  legendFontColor: string;
}

interface LineBarChartData {
  labels: string[];
  datasets: {
    data: number[];
    color?: (opacity: number) => string;
    strokeWidth?: number;
  }[];
}

interface Atividade {
  tipo: string;
  titulo: string;
  data: string | Date;
  status?: string;
  usuario?: string;
  id?: string;
  descricao: string;
}

interface Victim {
  _id?: string;
  id?: string;
  status?: string;
  createdAt: string;
  updatedAt?: string;
}

const { width: screenWidth } = Dimensions.get("window");

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalCasos: 0,
    casosEmAndamento: 0,
    casosFinalizados: 0,
    casosArquivados: 0,
    casosPendentes: 0,
    casosCancelados: 0,
    totalUsuarios: 0,
    usuariosAtivos: 0,
    usuariosPeritos: 0,
    usuariosAssistentes: 0,
    usuariosAdmin: 0,
    casosRecentes: [],
    atividadesRecentes: [],
    totalVitimas: 0,
    vitimasIdentificadas: 0,
    vitimasNaoIdentificadas: 0,
    vitimasPendentes: 0,
  });

  const [periodoAtivo, setPeriodoAtivo] = useState<"semana" | "mes" | "ano">("mes");
  const [activeLog, setActiveLog] = useState<"casos" | "atividades">("casos");

  // Dados para gráficos
  const [chartData, setChartData] = useState<{
    distribuicaoStatus: ChartDataPoint[];
    distribuicaoUsuarios: ChartDataPoint[];
    tendenciaCasos: LineBarChartData;
    desempenhoMensal: LineBarChartData;
  }>({
    distribuicaoStatus: [],
    distribuicaoUsuarios: [],
    tendenciaCasos: { labels: [], datasets: [{ data: [] }] },
    desempenhoMensal: { labels: [], datasets: [{ data: [] }] },
  });

  // Configuração dos gráficos
  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    style: {
      borderRadius: 16,
    },
  };

  // Buscar dados do dashboard
  const fetchDashboardData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        navigation.navigate("Login" as never);
        throw new Error("Token de autenticação não encontrado");
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const [casosResponse, usuariosResponse, vitimasResponse] = await Promise.all([
        fetch("https://perioscan-back-end-fhhq.onrender.com/api/cases", { headers }),
        fetch("https://perioscan-back-end-fhhq.onrender.com/api/users", { headers }),
        fetch("https://perioscan-back-end-fhhq.onrender.com/api/victims", { headers })
      ]);

      if (casosResponse.status === 401 || usuariosResponse.status === 401) {
        await AsyncStorage.removeItem("token");
        navigation.navigate("Login" as never);
        throw new Error("Sessão expirada. Por favor, faça login novamente.");
      }

      if (!casosResponse.ok || !usuariosResponse.ok) {
        throw new Error("Erro ao buscar dados");
      }

      const [casosData, usuariosData, vitimasData] = await Promise.all([
        casosResponse.json(),
        usuariosResponse.json(),
        vitimasResponse.json()
      ]);

      const casos: Case[] = casosData.success && Array.isArray(casosData.data) ? casosData.data : [];
      const usuarios: User[] = Array.isArray(usuariosData) ? usuariosData :
                             usuariosData.data && Array.isArray(usuariosData.data) ? usuariosData.data :
                             usuariosData.users && Array.isArray(usuariosData.users) ? usuariosData.users : [];
      const vitimas: Victim[] = vitimasData.data || [];

      updateDashboardData(casos, usuarios, vitimas);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      console.error("Erro ao buscar dados do dashboard:", errorMessage);
      setError(errorMessage);
      Alert.alert("Erro", errorMessage);
    }
  };

  // useEffect para carregar dados iniciais
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (isMounted) setLoading(true);
      await fetchDashboardData();
      if (isMounted) setLoading(false);
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [periodoAtivo]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  // Função para gerar dados de tendência
  const gerarDadosTendencia = (casos: Case[], periodo: "semana" | "mes" | "ano"): LineBarChartData => {
    const hoje = new Date();
    let dataInicial: Date, labels: string[], intervalo: string;

    switch (periodo) {
      case "semana":
        dataInicial = new Date(hoje);
        dataInicial.setDate(hoje.getDate() - 7);
        labels = Array.from({ length: 7 }, (_, i) => {
          const data = new Date(hoje);
          data.setDate(hoje.getDate() - 6 + i);
          return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
        });
        intervalo = "dia";
        break;
      case "mes":
        dataInicial = new Date(hoje);
        dataInicial.setDate(hoje.getDate() - 30);
        labels = Array.from({ length: 4 }, (_, i) => `S${i + 1}`);
        intervalo = "semana";
        break;
      case "ano":
        dataInicial = new Date(hoje);
        dataInicial.setFullYear(hoje.getFullYear() - 1);
        labels = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
        intervalo = "mes";
        break;
      default:
        dataInicial = new Date(hoje);
        dataInicial.setDate(hoje.getDate() - 30);
        labels = Array.from({ length: 4 }, (_, i) => `S${i + 1}`);
        intervalo = "semana";
    }

    const casosDoPeriodo = casos.filter((caso) => {
      const dataCaso = new Date(caso.openDate || caso.createdAt);
      return dataCaso >= dataInicial && dataCaso <= hoje;
    });

    const casosAbertos: number[] = Array(labels.length).fill(0);
    const casosFinalizados: number[] = Array(labels.length).fill(0);

    casosDoPeriodo.forEach((caso) => {
      const dataCaso = new Date(caso.openDate || caso.createdAt);
      let indice = 0;

      if (intervalo === "dia") {
        const diasDesdeInicio = Math.floor((dataCaso - dataInicial) / (1000 * 60 * 60 * 24));
        indice = Math.min(Math.max(diasDesdeInicio, 0), 6);
      } else if (intervalo === "semana") {
        const diasDesdeInicio = Math.floor((dataCaso - dataInicial) / (1000 * 60 * 60 * 24));
        indice = Math.min(Math.floor(diasDesdeInicio / 7), 3);
      } else if (intervalo === "mes") {
        indice = dataCaso.getMonth();
      }

      casosAbertos[indice]++;
      if (caso.status?.toLowerCase() === "finalizado") {
        casosFinalizados[indice]++;
      }
    });

    return {
      labels,
      datasets: [
        {
          data: casosAbertos,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          strokeWidth: 2,
        },
      ],
    };
  };

  // Função para gerar dados de desempenho mensal
  const gerarDadosDesempenho = (casos: Case[]): LineBarChartData => {
    const hoje = new Date();
    const meses: string[] = [];
    const dadosMensais: number[] = [];

    for (let i = 5; i >= 0; i--) {
      const data = new Date(hoje);
      data.setMonth(hoje.getMonth() - i);
      meses.push(data.toLocaleDateString("pt-BR", { month: "short" }));

      const casosProcessados = casos.filter((caso) => {
        const dataCaso = new Date(caso.closeDate || caso.updatedAt || caso.createdAt);
        return (
          dataCaso.getMonth() === data.getMonth() &&
          dataCaso.getFullYear() === data.getFullYear() &&
          (caso.status?.toLowerCase() === "finalizado" || caso.status?.toLowerCase() === "arquivado")
        );
      }).length;

      dadosMensais.push(casosProcessados);
    }

    return {
      labels: meses,
      datasets: [{ data: dadosMensais }],
    };
  };

  // Função para gerar atividades recentes
  const gerarAtividadesRecentes = (casos: Case[], usuarios: User[]): Atividade[] => {
    const atividades: Atividade[] = [];

    casos.slice(0, 10).forEach((caso) => {
      atividades.push({
        tipo: "caso_criado",
        titulo: caso.title || "Caso sem título",
        data: caso.createdAt || caso.openDate,
        status: caso.status,
        usuario: caso.createdBy?.name || "Usuário desconhecido",
        id: caso._id || caso.id,
        descricao: `Caso criado por ${caso.createdBy?.name || "Usuário desconhecido"}`,
      });
    });

    usuarios.slice(0, 5).forEach((usuario) => {
      atividades.push({
        tipo: "usuario_criado",
        titulo: `${usuario.name || "Usuário"} (${formatarPapel(usuario.role)})`,
        data: usuario.createdAt || new Date(),
        status: usuario.active !== false ? "Ativo" : "Inativo",
        id: usuario._id || usuario.id,
        descricao: `Novo usuário ${formatarPapel(usuario.role)} adicionado ao sistema`,
      });
    });

    return atividades.sort((a, b) => new Date(b.data) - new Date(a.data)).slice(0, 10);
  };

  // Função para formatar papel do usuário
  const formatarPapel = (role: string | undefined): string => {
    if (!role) return "Desconhecido";
    const mapeamento = {
      admin: "Administrador",
      perito: "Perito",
      assistente: "Assistente",
    };
    return mapeamento[role.toLowerCase()] || role;
  };

  // Função para formatar data
  const formatarData = (dataISO: string | Date | undefined): string => {
    if (!dataISO) return "--";
    const data = new Date(dataISO);
    const dataAjustada = new Date(data.getTime() + data.getTimezoneOffset() * 60000);
    return dataAjustada.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Função para calcular dias em aberto
  const calcularDiasAberto = (dataAbertura: string | Date | undefined): string | number => {
    if (!dataAbertura) return "--";
    const inicio = new Date(dataAbertura);
    const hoje = new Date();
    return Math.floor((hoje - inicio) / (1000 * 60 * 60 * 24));
  };

  const updateDashboardData = (casos: Case[], usuarios: User[], vitimas: Victim[]) => {
    const getStatusCount = (status: string) => 
      casos.filter(caso => caso.status?.toLowerCase() === status.toLowerCase()).length;

    const getRoleCount = (role: string) =>
      usuarios.filter(usuario => usuario.role === role).length;

    const casosEmAndamento = getStatusCount("em andamento");
    const casosFinalizados = getStatusCount("finalizado");
    const casosArquivados = getStatusCount("arquivado");
    const casosPendentes = getStatusCount("pendente");
    const casosCancelados = getStatusCount("cancelado");

    const usuariosAtivos = usuarios.filter(usuario => usuario.active !== false).length;
    const usuariosPeritos = getRoleCount("perito");
    const usuariosAssistentes = getRoleCount("assistente");
    const usuariosAdmin = getRoleCount("admin");

    const casosRecentes = [...casos]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    const atividadesRecentes = gerarAtividadesRecentes(casos, usuarios);

    setDashboardData({
      totalCasos: casos.length,
      casosEmAndamento,
      casosFinalizados,
      casosArquivados,
      casosPendentes,
      casosCancelados,
      totalUsuarios: usuarios.length,
      usuariosAtivos,
      usuariosPeritos,
      usuariosAssistentes,
      usuariosAdmin,
      casosRecentes,
      atividadesRecentes,
      totalVitimas: vitimas.length,
      vitimasIdentificadas: vitimas.filter(vitima => vitima.status === "identificada").length,
      vitimasNaoIdentificadas: vitimas.filter(vitima => vitima.status === "nao identificada").length,
      vitimasPendentes: vitimas.filter(vitima => vitima.status === "pendente").length,
    });

    setChartData({
      distribuicaoStatus: [
        { name: "Em Andamento", population: casosEmAndamento, color: "#b99f81", legendFontColor: "#7F7F7F" },
        { name: "Finalizados", population: casosFinalizados, color: "#62725c", legendFontColor: "#7F7F7F" },
        { name: "Arquivados", population: casosArquivados, color: "#969696", legendFontColor: "#7F7F7F" },
      ],
      distribuicaoUsuarios: [
        { name: "Peritos", population: usuariosPeritos, color: "#706C61", legendFontColor: "#7F7F7F" },
        { name: "Assistentes", population: usuariosAssistentes, color: "#0C1618", legendFontColor: "#7F7F7F" },
        { name: "Administradores", population: usuariosAdmin, color: "#EAD2AC", legendFontColor: "#7F7F7F" },
      ],
      tendenciaCasos: gerarDadosTendencia(casos, periodoAtivo),
      desempenhoMensal: gerarDadosDesempenho(casos),
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Carregando dados do dashboard...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Erro ao carregar dados</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => fetchDashboardData()}>
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Stats Summary */}
        <View style={styles.statsSummary}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Total de Casos</Text>
            <Text style={styles.summaryValue}>{dashboardData.totalCasos}</Text>
            <Text style={styles.summarySubtext}>Ativos: {dashboardData.casosEmAndamento}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Usuários</Text>
            <Text style={styles.summaryValue}>{dashboardData.totalUsuarios}</Text>
            <Text style={styles.summarySubtext}>Peritos: {dashboardData.usuariosPeritos}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Vítimas</Text>
            <Text style={styles.summaryValue}>{dashboardData.totalVitimas}</Text>
            <Text style={styles.summarySubtext}>
              Identificadas: {dashboardData.vitimasIdentificadas}
            </Text>
          </View>
        </View>

        {/* Distribuições */}
        <View style={styles.distributionSection}>
          <Text style={styles.sectionTitle}>Distribuição de Casos</Text>
          <View style={styles.chartContainer}>
            <PieChart
              data={chartData.distribuicaoStatus}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
        </View>

        <View style={styles.distributionSection}>
          <Text style={styles.sectionTitle}>Distribuição de Usuários</Text>
          <View style={styles.chartContainer}>
            <PieChart
              data={chartData.distribuicaoUsuarios}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
        </View>

        {/* Tendência de Casos */}
        <View style={styles.distributionSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tendência de Casos</Text>
          </View>
          <View style={styles.periodSelector}>
            <TouchableOpacity
              style={[styles.periodButton, periodoAtivo === "semana" && styles.periodButtonActive]}
              onPress={() => setPeriodoAtivo("semana")}
            >
              <Text style={[styles.periodButtonText, periodoAtivo === "semana" && styles.periodButtonTextActive]}>
                Semana
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.periodButton, periodoAtivo === "mes" && styles.periodButtonActive]}
              onPress={() => setPeriodoAtivo("mes")}
            >
              <Text style={[styles.periodButtonText, periodoAtivo === "mes" && styles.periodButtonTextActive]}>
                Mês
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.periodButton, periodoAtivo === "ano" && styles.periodButtonActive]}
              onPress={() => setPeriodoAtivo("ano")}
            >
              <Text style={[styles.periodButtonText, periodoAtivo === "ano" && styles.periodButtonTextActive]}>
                Ano
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.chartContainer}>
            <LineChart
              data={chartData.tendenciaCasos}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              bezier
            />
          </View>
        </View>

        {/* Desempenho Mensal */}
        <View style={styles.distributionSection}>
          <Text style={styles.sectionTitle}>Desempenho Mensal</Text>
          <View style={styles.chartContainer}>
            <BarChart
              data={chartData.desempenhoMensal}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              yAxisLabel=""
              yAxisSuffix=""
            />
          </View>
        </View>

        {/* Registros Recentes */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Registros Recentes</Text>
            <View style={styles.logSelector}>
              <TouchableOpacity
                style={[styles.logButton, activeLog === "casos" && styles.logButtonActive]}
                onPress={() => setActiveLog("casos")}
              >
                <Text style={[styles.logButtonText, activeLog === "casos" && styles.logButtonTextActive]}>
                  Casos
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.logButton, activeLog === "atividades" && styles.logButtonActive]}
                onPress={() => setActiveLog("atividades")}
              >
                <Text style={[styles.logButtonText, activeLog === "atividades" && styles.logButtonTextActive]}>
                  Atividades
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {activeLog === "casos" ? (
            <>
              {dashboardData.casosRecentes.map((item, index) => (
                <View key={index} style={styles.recentCard}>
                  <Text style={styles.recentTitle}>{item.title}</Text>
                  <View style={styles.recentInfo}>
                    <Text style={styles.recentDate}>Data Abertura: {formatarData(item.openDate || item.createdAt)}</Text>
                    <Text style={styles.recentCreator}>Criador: {item.createdBy?.name || "Usuário desconhecido"}</Text>
                    <Text style={styles.recentStatus}>Status: {item.status}</Text>
                    <Text style={styles.recentDays}>{calcularDiasAberto(item.openDate || item.createdAt)} dias em aberto</Text>
                  </View>
                </View>
              ))}
            </>
          ) : (
            <>
              {dashboardData.atividadesRecentes.map((item, index) => (
                <View key={index} style={styles.recentCard}>
                  <Text style={styles.recentTitle}>{item.titulo}</Text>
                  <Text style={styles.activityDescription}>{item.descricao}</Text>
                  <View style={styles.recentInfo}>
                    <Text style={styles.recentDate}>Data: {formatarData(item.data)}</Text>
                    <Text style={styles.recentStatus}>Status: {item.status}</Text>
                  </View>
                </View>
              ))}
            </>
          )}
        </View>

        {/* Espaço extra para garantir que o conteúdo não fique sob a navbar */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#000",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
  },
  statsSection: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  seeAll: {
    color: "#666",
    fontSize: 14,
  },
  statsCards: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  statsCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  statsLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  statsSummary: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  summaryTitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
  },
  summarySubtext: {
    fontSize: 12,
    color: "#888",
  },
  distributionSection: {
    padding: 20,
  },
  chartContainer: {
    alignItems: "center",
    marginTop: 15,
  },
  periodSelector: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    padding: 5,
  },
  periodButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 15,
  },
  periodButtonActive: {
    backgroundColor: "#000",
  },
  periodButtonText: {
    fontSize: 14,
    color: "#666",
  },
  recentSection: {
    padding: 20,
  },
  recentCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
    color: "#000",
  },
  activityDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  recentInfo: {
    gap: 5,
  },
  recentDate: {
    fontSize: 12,
    color: "#666",
  },
  recentCreator: {
    fontSize: 12,
    color: "#666",
  },
  recentStatus: {
    fontSize: 12,
    color: "#666",
  },
  recentDays: {
    fontSize: 12,
    color: "#666",
  },
  bottomSpacing: {
    height: 70,
  },
  logSelector: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    padding: 4,
    marginLeft: 10,
  },
  logButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  logButtonActive: {
    backgroundColor: '#000',
  },
  logButtonText: {
    fontSize: 12,
    color: '#666',
  },
  logButtonTextActive: {
    color: '#fff',
  },
});
export default DashboardScreen;
