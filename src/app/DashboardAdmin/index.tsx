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
    backgroundGradientFrom: "#000000", // Preto
    backgroundGradientTo: "#333333",   // Cinza escuro
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Branco para texto e linhas
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Branco para rótulos
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    style: {
      borderRadius: 16,
    },
    propsForDots: { // Para LineChart
      r: "6",
      strokeWidth: "2",
      stroke: "#ffffff"
    },
    propsForLabels: { // Para rótulos dos eixos
      fill: "#ffffff"
    }
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
      return dataCaso.getTime() >= dataInicial.getTime() && dataCaso.getTime() <= hoje.getTime();
    });

    const casosAbertos: number[] = Array(labels.length).fill(0);
    const casosFinalizados: number[] = Array(labels.length).fill(0);

    casosDoPeriodo.forEach((caso) => {
      const dataCaso = new Date(caso.openDate || caso.createdAt);
      let indice = 0;

      if (intervalo === "dia") {
        const diasDesdeInicio = Math.floor((dataCaso.getTime() - dataInicial.getTime()) / (1000 * 60 * 60 * 24));
        indice = Math.min(Math.max(diasDesdeInicio, 0), 6);
      } else if (intervalo === "semana") {
        const diasDesdeInicio = Math.floor((dataCaso.getTime() - dataInicial.getTime()) / (1000 * 60 * 60 * 24));
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
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Linha branca
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
      datasets: [{ data: dadosMensais, color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})` }], // Barras brancas
    };
  };

  // Função para gerar atividades recentes
  const gerarAtividadesRecentes = (casos: Case[], usuarios: User[]): Atividade[] => {
    const atividades: Atividade[] = [];

    casos.slice(0, 10).forEach((caso) => {
      atividades.push({
        tipo: "caso_criado",
        titulo: caso.title || "Caso sem título",
        data: caso.createdAt || caso.openDate || new Date().toISOString(),
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
        data: usuario.createdAt || new Date().toISOString(),
        status: usuario.active !== false ? "Ativo" : "Inativo",
        id: usuario._id || usuario.id,
        descricao: `Novo usuário ${formatarPapel(usuario.role)} adicionado ao sistema`,
      });
    });

    return atividades.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()).slice(0, 10);
  };

  // Função para formatar papel do usuário
  const formatarPapel = (role: string | undefined): string => {
    if (!role) return "Desconhecido";
    const mapeamento: { [key: string]: string } = {
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
    return Math.floor((hoje.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
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
        { name: "Em Andamento", population: casosEmAndamento, color: "#444444", legendFontColor: "#FFFFFF" },
        { name: "Finalizados", population: casosFinalizados, color: "#888888", legendFontColor: "#FFFFFF" },
        { name: "Arquivados", population: casosArquivados, color: "#BBBBBB", legendFontColor: "#FFFFFF" },
      ],
      distribuicaoUsuarios: [
        { name: "Peritos", population: usuariosPeritos, color: "#222222", legendFontColor: "#FFFFFF" },
        { name: "Assistentes", population: usuariosAssistentes, color: "#666666", legendFontColor: "#FFFFFF" },
        { name: "Administradores", population: usuariosAdmin, color: "#AAAAAA", legendFontColor: "#FFFFFF" },
      ],
      tendenciaCasos: gerarDadosTendencia(casos, periodoAtivo),
      desempenhoMensal: gerarDadosDesempenho(casos),
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFF" />
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
        {/* Stats Summary - Cards ajustados para ficarem do mesmo tamanho */}
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
            <Text style={styles.summarySubtext}>Identificadas: {dashboardData.vitimasIdentificadas}</Text>
          </View>
        </View>

        {/* Gráficos */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Distribuição de Casos por Status</Text>
          {chartData.distribuicaoStatus.length > 0 ? (
            <PieChart
              data={chartData.distribuicaoStatus}
              width={screenWidth - 40} // Ajuste para padding
              height={250}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="20"
              // center={[10, 50]} // Removido para melhor centralização automática
              absolute // Para mostrar valores absolutos
              hasLegend={true}
            />
          ) : (
            <Text style={styles.noDataText}>Sem dados de status para exibir.</Text>
          )}
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Distribuição de Usuários por Tipo</Text>
          {chartData.distribuicaoUsuarios.length > 0 ? (
            <PieChart
              data={chartData.distribuicaoUsuarios}
              width={screenWidth - 40}
              height={250}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="20"
              absolute
              hasLegend={true}
            />
          ) : (
            <Text style={styles.noDataText}>Sem dados de usuários para exibir.</Text>
          )}
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Tendência de Casos (Últimos {periodoAtivo === "semana" ? "7 Dias" : periodoAtivo === "mes" ? "30 Dias" : "1 Ano"})</Text>
          <View style={styles.periodoSelector}>
            <TouchableOpacity
              style={[styles.periodoButton, periodoAtivo === "semana" && styles.periodoButtonActive]}
              onPress={() => setPeriodoAtivo("semana")}
            >
              <Text style={[styles.periodoButtonText, periodoAtivo === "semana" && styles.periodoButtonTextActive]}>Semana</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.periodoButton, periodoAtivo === "mes" && styles.periodoButtonActive]}
              onPress={() => setPeriodoAtivo("mes")}
            >
              <Text style={[styles.periodoButtonText, periodoAtivo === "mes" && styles.periodoButtonTextActive]}>Mês</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.periodoButton, periodoAtivo === "ano" && styles.periodoButtonActive]}
              onPress={() => setPeriodoAtivo("ano")}
            >
              <Text style={[styles.periodoButtonText, periodoAtivo === "ano" && styles.periodoButtonTextActive]}>Ano</Text>
            </TouchableOpacity>
          </View>
          {chartData.tendenciaCasos.labels.length > 0 ? (
            <LineChart
              data={chartData.tendenciaCasos}
              width={screenWidth - 40}
              height={250}
              chartConfig={chartConfig}
              bezier
              style={styles.chartStyle}
            />
          ) : (
            <Text style={styles.noDataText}>Sem dados de tendência para exibir.</Text>
          )}
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Desempenho Mensal (Casos Finalizados/Arquivados)</Text>
          {chartData.desempenhoMensal.labels.length > 0 ? (
            <BarChart
              data={chartData.desempenhoMensal}
              width={screenWidth - 40}
              height={250}
              chartConfig={chartConfig}
              style={styles.chartStyle}
              verticalLabelRotation={30}
            />
          ) : (
            <Text style={styles.noDataText}>Sem dados de desempenho mensal para exibir.</Text>
          )}
        </View>

        {/* Atividades Recentes */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Atividades Recentes</Text>
          <View style={styles.logSelector}>
            <TouchableOpacity
              style={[styles.logButton, activeLog === "casos" && styles.logButtonActive]}
              onPress={() => setActiveLog("casos")}
            >
              <Text style={[styles.logButtonText, activeLog === "casos" && styles.logButtonTextActive]}>Casos Recentes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.logButton, activeLog === "atividades" && styles.logButtonActive]}
              onPress={() => setActiveLog("atividades")}
            >
              <Text style={[styles.logButtonText, activeLog === "atividades" && styles.logButtonTextActive]}>Todas Atividades</Text>
            </TouchableOpacity>
          </View>
          {activeLog === "casos" ? (
            dashboardData.casosRecentes.length > 0 ? (
              dashboardData.casosRecentes.map((caso, index) => (
                <View key={index} style={styles.logItem}>
                  <Text style={styles.logItemTitle}>{caso.title || "Caso sem título"}</Text>
                  <Text style={styles.logItemText}>Status: {caso.status}</Text>
                  <Text style={styles.logItemText}>Aberto em: {formatarData(caso.openDate || caso.createdAt)}</Text>
                  <Text style={styles.logItemText}>Criado por: {caso.createdBy?.name || "Desconhecido"}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>Nenhum caso recente para exibir.</Text>
            )
          ) : (
            dashboardData.atividadesRecentes.length > 0 ? (
              dashboardData.atividadesRecentes.map((atividade, index) => (
                <View key={index} style={styles.logItem}>
                  <Text style={styles.logItemTitle}>{atividade.titulo}</Text>
                  <Text style={styles.logItemText}>Tipo: {atividade.tipo}</Text>
                  <Text style={styles.logItemText}>Data: {formatarData(atividade.data)}</Text>
                  {atividade.usuario && <Text style={styles.logItemText}>Usuário: {atividade.usuario}</Text>}
                  {atividade.status && <Text style={styles.logItemText}>Status: {atividade.status}</Text>}
                  <Text style={styles.logItemText}>Descrição: {atividade.descricao}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>Nenhuma atividade recente para exibir.</Text>
            )
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000", // Fundo preto
  },
  scrollView: {
    flex: 1,
    padding: 16,
    paddingBottom: 80, // Adicionado espaço para a navbar
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
  },
  loadingText: {
    marginTop: 10,
    color: "#FFFFFF",
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF6347", // Tom de vermelho para erro
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#333333",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  statsSummary: {
    flexDirection: "row",
    justifyContent: "space-between", // Mudado de space-around para space-between
    marginBottom: 20,
    paddingHorizontal: 5, // Adicionado padding horizontal
  },
  summaryCard: {
    backgroundColor: "#1A1A1A", // Cartão cinza escuro
    padding: 18, // Aumentado de 15 para 18
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4, // Reduzido de 5 para 4
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    minHeight: 100, // Adicionado altura mínima para uniformizar
    justifyContent: "center", // Centraliza o conteúdo verticalmente
  },
  summaryTitle: {
    fontSize: 13, // Reduzido de 14 para 13 para caber melhor
    color: "#BBBBBB", // Título cinza claro
    marginBottom: 8, // Aumentado de 5 para 8
    textAlign: "center", // Centraliza o texto
    lineHeight: 16, // Adicionado para melhor espaçamento
  },
  summaryValue: {
    fontSize: 26, // Aumentado de 24 para 26
    fontWeight: "bold",
    color: "#FFFFFF", // Valor branco
    marginBottom: 6, // Aumentado de 0 para 6
  },
  summarySubtext: {
    fontSize: 11, // Reduzido de 12 para 11
    color: "#888888", // Subtexto cinza
    textAlign: "center", // Centraliza o texto
    lineHeight: 14, // Adicionado para melhor espaçamento
  },
  chartContainer: {
    backgroundColor: "#1A1A1A", // Fundo do gráfico cinza escuro
    borderRadius: 10,
    padding: 16,
    paddingVertical: 20, // Aumentado para dar mais espaço vertical
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF", // Título do gráfico branco
    marginBottom: 15,
  },
  chartStyle: {
    marginVertical: 0, // Removido, espaço agora no paddingVertical do chartContainer
    borderRadius: 16,
  },
  noDataText: {
    color: "#888888",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  periodoSelector: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
  },
  periodoButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginHorizontal: 5,
    backgroundColor: "#333333", // Botão inativo cinza escuro
  },
  periodoButtonActive: {
    backgroundColor: "#FFFFFF", // Botão ativo branco
  },
  periodoButtonText: {
    color: "#FFFFFF", // Texto do botão inativo branco
    fontWeight: "bold",
  },
  periodoButtonTextActive: {
    color: "#000000", // Texto do botão ativo preto
  },
  sectionContainer: {
    backgroundColor: "#1A1A1A",
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 15,
    textAlign: "center",
  },
  logSelector: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
  },
  logButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginHorizontal: 5,
    backgroundColor: "#333333",
  },
  logButtonActive: {
    backgroundColor: "#FFFFFF",
  },
  logButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  logButtonTextActive: {
    color: "#000000",
  },
  logItem: {
    backgroundColor: "#000000", // Fundo do item de log preto
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#333333", // Borda cinza escuro
    shadowColor: "#000", // Sombra mais aparente
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 1, // Sombra mais aparente
    shadowRadius: 5, // Sombra mais aparente
    elevation: 8, // Sombra mais aparente para Android
  },
  logItemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  logItemText: {
    fontSize: 14,
    color: "#BBBBBB",
  },
});

export default DashboardScreen;

