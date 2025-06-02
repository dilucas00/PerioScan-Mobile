import React from "react";
import { View, Text, ScrollView, Image } from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";
import { styles } from "./styles";

const DashboardScreen = () => {
  const casesData = [
    { name: "Em Andamento", value: 15, color: "#70615C" },
    { name: "Arquivados", value: 7, color: "#4F4F4F" },
    { name: "Finalizados", value: 42, color: "#1F1F1F" },
  ];

  const usersData = [
    { name: "Peritos", value: 70, color: "#4F4F4F" },
    { name: "Assistentes", value: 20, color: "#1F1F1F" },
    { name: "Administradores", value: 10, color: "#E5E5E5" },
  ];

  const recentCases = [
    {
      title: "Marcas de mordida em criança vítima de maus tratos",
      date: "24/04/2025",
      creator: "Admin",
      status: "Em Andamento",
    },
  ];

  const recentActivities = [
    {
      action: "Novo adm",
      date: "24/04/2025",
      creator: "Admin",
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.adminLabel}>(Administrador)</Text>
            <Text style={styles.welcomeText}>Olá, Pedro Victor</Text>
          </View>
          <View style={styles.headerRight}>
            <Image
              source={require("../../../assets/NotificacaoIcon.png")}
              style={styles.notificationIcon}
            />
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.statsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Dados Gerais</Text>
            <Text style={styles.seeAll}>Ver tudo</Text>
          </View>
          <View style={styles.statsCards}>
            <View style={styles.statsCard}>
              <Text style={styles.statsNumber}>15</Text>
              <Text style={styles.statsLabel}>Em andamento</Text>
            </View>
            <View style={styles.statsCard}>
              <Text style={styles.statsNumber}>7</Text>
              <Text style={styles.statsLabel}>Arquivados</Text>
            </View>
            <View style={styles.statsCard}>
              <Text style={styles.statsNumber}>42</Text>
              <Text style={styles.statsLabel}>Finalizados</Text>
            </View>
          </View>
        </View>

        {/* Distribuições */}
        <View style={styles.distributionSection}>
          <Text style={styles.sectionTitle}>Distribuições</Text>
          <View style={styles.chartsContainer}>
            <View style={styles.pieChartContainer}>
              <PieChart
                data={casesData.map((data) => ({
                  name: data.name,
                  population: data.value,
                  color: data.color,
                  legendFontColor: "#7F7F7F",
                }))}
                width={150}
                height={150}
                chartConfig={{
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="0"
                absolute
              />
            </View>
            <View style={styles.pieChartContainer}>
              <PieChart
                data={usersData.map((data) => ({
                  name: data.name,
                  population: data.value,
                  color: data.color,
                  legendFontColor: "#7F7F7F",
                }))}
                width={150}
                height={150}
                chartConfig={{
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="0"
                absolute
              />
            </View>
          </View>
        </View>

        {/* Casos Recentes */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Casos Recentes</Text>
            <Text style={styles.seeAll}>Ver tudo</Text>
          </View>
          {recentCases.map((item, index) => (
            <View key={index} style={styles.recentCard}>
              <Text style={styles.recentTitle}>{item.title}</Text>
              <View style={styles.recentInfo}>
                <Text style={styles.recentDate}>
                  Data Abertura: {item.date}
                </Text>
                <Text style={styles.recentCreator}>
                  Criador: {item.creator}
                </Text>
                <Text style={styles.recentStatus}>Status: {item.status}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Atividades Recentes */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Atividades Recentes</Text>
            <Text style={styles.seeAll}>Ver tudo</Text>
          </View>
          {recentActivities.map((item, index) => (
            <View key={index} style={styles.recentCard}>
              <Text style={styles.recentTitle}>{item.action}</Text>
              <View style={styles.recentInfo}>
                <Text style={styles.recentDate}>
                  Data Abertura: {item.date}
                </Text>
                <Text style={styles.recentCreator}>
                  Criador: {item.creator}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Espaço extra para garantir que o conteúdo não fique sob a navbar */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

export default DashboardScreen;
