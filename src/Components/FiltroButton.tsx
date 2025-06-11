import React from "react";
import { View, StyleSheet } from "react-native";
import { SegmentedButtons } from "react-native-paper";

interface OpcaoFiltro {
  value: string;
  label: string;
}

interface FiltroButtonProps {
  value?: string;
  onValueChange: (value: string) => void;
  opcoes: OpcaoFiltro[];
  estiloContainer?: object;
  estiloBotoes?: object;
}

const FiltroButton: React.FC<FiltroButtonProps> = ({
  value = "",
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
          labelStyle: styles.buttonLabel,
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
    padding: 16,
    backgroundColor: "#F7F7F7",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  segmentedButtons: {
    borderRadius: 5,
    overflow: "hidden",
    width: "90%",
  },
  buttonLabel: {
    fontSize: 12,
  },
});

export default FiltroButton;
