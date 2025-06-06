import React from "react";
import { Text, View, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import {
  Searchbar,
  SegmentedButtons,
  Appbar,
  Button,
  PaperProvider,
} from "react-native-paper";
import CaseCard from "src/Components/caseCard";
import NovoCasoModal from "src/Components/novoCasoModal";

export default function Cases() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [value, setValue] = React.useState("");
  const [showSearch, setShowSearch] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const showModal = () => setVisible(true);

  function hideModal(): void {
    setVisible(false);
  }
  return (
    <PaperProvider>
      <View style={styles.mainContainer}>
        {/* Header com Appbar */}
        <Appbar.Header style={styles.header}>
          <Appbar.Content
            title="Gerenciamento de casos"
            titleStyle={styles.headerTitle}
          />
          <Appbar.Action
            icon="magnify"
            onPress={() => setShowSearch(!showSearch)}
            color="#FFF"
          />
        </Appbar.Header>

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

          <SafeAreaView style={styles.filtroContainer}>
            <SegmentedButtons
              value={value}
              density="medium"
              onValueChange={setValue}
              style={styles.segmentedButtons}
              buttons={[
                {
                  value: "todos",
                  label: "Todos",
                  labelStyle: { fontSize: 12 },
                  style: {
                    backgroundColor: value === "todos" ? "black" : "white",
                    borderColor: "#000",
                  },
                  checkedColor: "white",
                  uncheckedColor: "black",
                },
                {
                  value: "em andamento",
                  label: "Em andamento",
                  labelStyle: { fontSize: 12 },
                  style: {
                    backgroundColor:
                      value === "em andamento" ? "black" : "white",
                    borderColor: "#000",
                  },
                  checkedColor: "white",
                  uncheckedColor: "black",
                },
                {
                  value: "finalizados",
                  label: "Finalizados",
                  labelStyle: { fontSize: 12 },
                  style: {
                    backgroundColor:
                      value === "finalizados" ? "black" : "white",
                    borderColor: "#000",
                  },
                  checkedColor: "white",
                  uncheckedColor: "black",
                },
              ]}
            />
          </SafeAreaView>

          <View style={styles.cardContainer}>
            <View style={styles.titleCardContainer}>
              <Text style={styles.titleContainerCard}>Todos os casos (8)</Text>
              <Button
                icon="plus"
                mode="contained"
                buttonColor="#000"
                textColor="#FFF"
                style={styles.buttonNovoCaso}
                onPress={showModal}
                compact
              >
                Novo caso
              </Button>
            </View>

            <CaseCard
              title="Marcas de mordida em criança vítima de maus tratos"
              type="Exame Criminal"
              creator="Admin"
              status="Em andamento"
              openingdate="24/04/2025"
              id="1"
            />

            <CaseCard
              title="Identificação post-mortem em acidente aéreo"
              type="Identificação de Vítima"
              creator="Admin"
              status="Finalizado"
              openingdate="14/05/2025"
              id="2"
            />
            <CaseCard
              title="Avaliação de traumatismo dentofacial em acidente de trânsito"
              type="Acidente"
              creator="Admin"
              status="Finalizado"
              openingdate="01/05/2025"
              id="3"
            />
          </View>
        </ScrollView>

        <NovoCasoModal
          visible={visible}
          onDismiss={hideModal}
          onConfirm={(novoCaso) => {
            console.log("Novo caso criado:", novoCaso);
            hideModal();
          }}
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
  buttonNovoCaso: {
    marginLeft: "auto",
    borderRadius: 5,
    paddingVertical: 2,
    paddingHorizontal: 6,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#000",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    color: "#555",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  modalButton: {
    marginLeft: 10,
  },
});
