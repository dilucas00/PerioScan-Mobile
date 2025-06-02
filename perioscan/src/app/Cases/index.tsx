import React from "react";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { Searchbar } from "react-native-paper";
import { StyleSheet } from "react-native";

export default function Cases() {
  const [searchQuery, setSearchQuery] = React.useState("");
  return (
    <View style={styles.mainContainerCases}>
      <View style={styles.topContainerCases}>
        <Searchbar
          placeholder="Buscar caso"
          onChangeText={setSearchQuery}
          value={searchQuery}
        />
      </View>
      <Text style={styles.titleContainerCases}>TELA DE CASOS!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  topContainerCases: {
    width: "100%",
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#333",
  },
  mainContainerCases: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 20,
    width: "100%",
    height: "50%",

    borderWidth: 2,
    borderColor: "#333",
  },
  titleContainerCases: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 40,
    borderWidth: 2,
    borderColor: "#333",
  },
});