"use client";

import React from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Searchbar, PaperProvider, FAB } from "react-native-paper";
import CaseCard from "../../Components/Casos/caseCard";
import NovoCasoModal from "../../Components/Casos/novoCasoModal";
import FiltroButton from "src/Components/FiltroButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

export default function Cases() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [value, setValue] = React.useState("todos");
  const [showSearch, setShowSearch] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [cases, setCases] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function getToken() {
    try {
      const token = await AsyncStorage.getItem("token");
      return token;
    } catch (e) {
      console.error("Erro ao acessar o token no AsyncStorage", e);
      return null;
    }
  }

  async function fetchCases(status: string) {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();

      let url = "https://perioscan-back-end-fhhq.onrender.com/api/cases";
      let statusApi = status;
      if (statusApi === "finalizados") statusApi = "finalizado";
      if (statusApi === "em andamento") statusApi = "em andamento";
      if (statusApi && statusApi !== "todos") {
        url += `?status=${encodeURIComponent(statusApi)}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const contentType = response.headers.get("content-type");
      if (!response.ok) throw new Error("Erro ao buscar casos");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Resposta da API não é JSON. Verifique a URL da API.");
      }

      const data = await response.json();
      console.log("Resposta da API:", data);

      if (Array.isArray(data.data)) {
        setCases(data.data);
      } else if (Array.isArray(data)) {
        setCases(data);
      } else if (Array.isArray(data.cases)) {
        setCases(data.cases);
      } else {
        setCases([]);
      }
    } catch (err: any) {
      setError(err.message || "Erro desconhecido");
      setCases([]);
    } finally {
      setLoading(false);
    }
  }

  // Remover o useEffect atual e substituir por:
  useFocusEffect(
    React.useCallback(() => {
      fetchCases(value);
    }, [value])
  );

  // Manter o useEffect original também para mudanças de filtro
  React.useEffect(() => {
    fetchCases(value);
  }, [value]);

  const filteredCases = cases.filter((c: any) =>
    c.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showModal = () => setVisible(true);
  function hideModal(): void {
    setVisible(false);
  }

  return (
    <PaperProvider>
      <View style={styles.mainContainer}>
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
        >
          {showSearch && (
            <View style={styles.searchContainer}>
              <Searchbar
                placeholder="Buscar caso"
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchbar}
                iconColor="#000"
                inputStyle={styles.searchInput}
                placeholderTextColor="#888"
                autoFocus
              />
            </View>
          )}

          <FiltroButton
            value={value}
            onValueChange={setValue}
            opcoes={[
              { value: "todos", label: "Todos" },
              { value: "em andamento", label: "Em andamento" },
              { value: "finalizado", label: "Finalizados" },
            ]}
          />

          <View style={styles.cardContainer}>
            <View style={styles.titleCardContainer}>
              <Text style={styles.titleContainerCard}>
                {value === "todos"
                  ? `Todos os casos (${filteredCases.length})`
                  : `Casos (${filteredCases.length})`}
              </Text>
            </View>

            {loading && (
              <ActivityIndicator
                size="large"
                color="#000"
                style={{ marginTop: 20 }}
              />
            )}
            {error && (
              <Text style={{ color: "red", padding: 16 }}>{error}</Text>
            )}
            {!loading && !error && filteredCases.length === 0 && (
              <View style={{ padding: 16 }}>
                <Text style={{ color: "#888" }}>Nenhum caso encontrado.</Text>
                <Text style={{ color: "#888", fontSize: 10 }}>
                  {JSON.stringify(cases)}
                </Text>
              </View>
            )}
            {!loading &&
              !error &&
              filteredCases.map((c: any) => (
                <CaseCard
                  key={c.id}
                  id={c.id}
                  title={c.title}
                  type={c.type}
                  creator={c.createdBy?.name || "N/A"}
                  status={c.status}
                  openingdate={c.openDate}
                  occurrenceDate={c.occurrenceDate || "N/A"}
                  location={c.location || "N/A"}
                  descricao={c.description || "N/A"}
                />
              ))}
          </View>
        </ScrollView>

        <NovoCasoModal
          visible={visible}
          onDismiss={hideModal}
          onConfirm={(novoCaso) => {
            fetchCases(value);
            hideModal();
          }}
        />

        {/* FAB flutuante para criar novo caso */}
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={showModal}
          color="#FFF"
          customSize={56}
          mode="flat"
          variant="surface"
        />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: "#000",
    elevation: 0,
    shadowOpacity: 0,
    height: 70,
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  searchContainer: {
    padding: 16,
    backgroundColor: "#000",
    paddingBottom: 20,
  },
  searchbar: {
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
  },
  searchInput: {
    color: "#000",
    minHeight: 40,
  },
  filtroContainer: {
    padding: 10,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 20,
    width: "100%",
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  segmentedButtons: {
    borderRadius: 5,
    overflow: "hidden",
    width: "90%",
    fontSize: 10,
  },
  cardContainer: {
    backgroundColor: "#f5f5f5",
    flex: 1,
    paddingTop: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  titleCardContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  titleContainerCard: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 140,
    backgroundColor: "#000",
    zIndex: 10,
  },
});
