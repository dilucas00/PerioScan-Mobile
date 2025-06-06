import React from "react";
import { View, StyleSheet } from "react-native";
import { SegmentedButtons } from "react-native-paper";

interface OpcaoFiltro {
  value: string;
  label: string;
}

interface FiltroButtonProps {
  value?: string; // Tornando opcional
  onValueChange: (value: string) => void;
  opcoes: OpcaoFiltro[];
  estiloContainer?: object;
  estiloBotoes?: object;
}

const FiltroButton: React.FC<FiltroButtonProps> = ({
  value = "", // Valor padrão vazio
  onValueChange,
  opcoes,
  estiloContainer,
  estiloBotoes,
}) => {
  return (
    <View style={[styles.filtroContainer, estiloContainer]}>
      <SegmentedButtons
        value={value}
        density="medium"
        onValueChange={onValueChange}
        style={[styles.segmentedButtons, estiloBotoes]}
        buttons={opcoes.map((opcao) => ({
          value: opcao.value,
          label: opcao.label,
          labelStyle: { fontSize: 12 },
          style: {
            backgroundColor: value === opcao.value ? "black" : "white",
            borderColor: "#000",
          },
          checkedColor: "white",
          uncheckedColor: "black",
        }))}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default FiltroButton;
