import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import BottomNavBar from '../components/BottomNavBar';

const DashboardScreen = () => {
  const casesData = [
    { name: 'Em Andamento', value: 15, color: '#70615C' },
    { name: 'Arquivados', value: 7, color: '#4F4F4F' },
    { name: 'Finalizados', value: 42, color: '#1F1F1F' }
  ];

  const usersData = [
    { name: 'Peritos', value: 70, color: '#4F4F4F' },
    { name: 'Assistentes', value: 20, color: '#1F1F1F' },
    { name: 'Administradores', value: 10, color: '#E5E5E5' }
  ];

  const recentCases = [
    {
      title: 'Marcas de mordida em criança vítima de maus tratos',
      date: '24/04/2025',
      creator: 'Admin',
      status: 'Em Andamento'
    },
    // Adicione mais casos conforme necessário
  ];

  const recentActivities = [
    {
      action: 'Novo adm',
      date: '24/04/2025',
      creator: 'Admin'
    },
    // Adicione mais atividades conforme necessário
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
            <Text style={styles.notificationIcon}>🔔</Text>
            <Image 
              source={{ uri: 'https://via.placeholder.com/40' }} 
              style={styles.profilePic}
            />
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Dados Gerais */}
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
                data={casesData.map(data => ({
                  name: data.name,
                  population: data.value,
                  color: data.color,
                  legendFontColor: '#7F7F7F'
                }))}
                width={150}
                height={150}
                chartConfig={{
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="0"
                absolute
              />
            </View>
            <View style={styles.pieChartContainer}>
              <PieChart
                data={usersData.map(data => ({
                  name: data.name,
                  population: data.value,
                  color: data.color,
                  legendFontColor: '#7F7F7F'
                }))}
                width={150}
                height={150}
                chartConfig={{
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`
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
                <Text style={styles.recentDate}>Data Abertura: {item.date}</Text>
                <Text style={styles.recentCreator}>Criador: {item.creator}</Text>
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
                <Text style={styles.recentDate}>Data Abertura: {item.date}</Text>
                <Text style={styles.recentCreator}>Criador: {item.creator}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Espaço extra para garantir que o conteúdo não fique sob a navbar */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      <BottomNavBar style={styles.navbar} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    backgroundColor: '#000',
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  adminLabel: {
    color: '#fff',
    fontSize: 12
  },
  welcomeText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold'
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15
  },
  notificationIcon: {
    fontSize: 24,
    color: '#fff'
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  scrollView: {
    flex: 1
  },
  statsSection: {
    padding: 20
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000'
  },
  seeAll: {
    color: '#666',
    fontSize: 14
  },
  statsCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10
  },
  statsCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  statsNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000'
  },
  statsLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5
  },
  distributionSection: {
    padding: 20
  },
  chartsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15
  },
  pieChartContainer: {
    flex: 1,
    alignItems: 'center'
  },
  recentSection: {
    padding: 20
  },
  recentCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10
  },
  recentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10
  },
  recentDate: {
    fontSize: 12,
    color: '#666'
  },
  recentCreator: {
    fontSize: 12,
    color: '#666'
  },
  recentStatus: {
    fontSize: 12,
    color: '#666'
  },
  bottomSpacing: {
    height: 70 // Ajuste este valor conforme necessário
  },
  navbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  }
});

export default DashboardScreen;