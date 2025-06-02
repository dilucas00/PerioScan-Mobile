import React from "react";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { Searchbar } from "react-native-paper";
import styles from "./styles";

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
