import React from "react";

import { Text, View, StyleSheet, SafeAreaView } from "react-native";
import { Searchbar, SegmentedButtons } from "react-native-paper";
export default function Cases() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [value, setValue] = React.useState("");
  return (
    <View style={styles.mainContainerCases}>
      <View style={styles.topContainerCases}>
        <Searchbar
          placeholder="Buscar caso"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
      </View>
      <Text style={styles.titleContainerCases}>Gerenciamento de casos</Text>
      <SafeAreaView style={styles.filtroContainerCase}>
        <SegmentedButtons
          value={value}
          onValueChange={setValue}
          buttons={[
            {
              value: "todos",
              label: "Todos",

              style: {
                backgroundColor: value === "todos" ? "black" : "white",
              },
              checkedColor: "white",
              uncheckedColor: "black",
            },
            {
              value: "em andamento",
              label: "Em andamento",
              style: {
                backgroundColor: value === "em andamento" ? "black" : "white",
              },
              checkedColor: "white",
              uncheckedColor: "black",
            },
            {
              value: "finalizados",
              label: "Finalizados",
              style: {
                backgroundColor: value === "finalizados" ? "black" : "white",
              },
              checkedColor: "white",
              uncheckedColor: "black",
            },
          ]}
        />
      </SafeAreaView>
      <View style={styles.cardContainerCases}>
        <View style={styles.titleCardContainerCases}>
          <Text style={styles.titleContainerCard}>Todos os casos</Text>
        </View>
        <View style={styles.cardCases}>
          <Text>Card</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topContainerCases: {
    width: "100%",
    backgroundColor: "#000",
    borderWidth: 2,
    borderColor: "#333",
    height: 100,
    justifyContent: "center",
  },
  searchbar: {
    width: "90%",
    marginLeft: "5%",
    marginRight: "5%",
  },
  mainContainerCases: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    width: "100%",
    height: "100%",
    borderWidth: 5,
    borderColor: "#333",
  },
  titleContainerCases: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 40,

    marginRight: "15%",
  },
  filtroContainerCase: {
    marginTop: 20,
    width: "90%",
  },
  cardContainerCases: {
    backgroundColor: "#e9e9e9",
    width: "100%",
    height: 500,
    marginTop: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  titleCardContainerCases: {
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    marginLeft: "10%",
    height: 50,
  },
  titleContainerCard: {
    fontSize: 24,
    fontWeight: "600",
  },
  cardCases: {
    backgroundColor: "#fff",
    width: "80%",
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginLeft: "10%",
  },
});
