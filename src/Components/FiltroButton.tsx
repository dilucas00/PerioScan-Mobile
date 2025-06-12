import type React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";

interface FiltroButtonProps {
  value: string;
  onValueChange: (value: string) => void;
  opcoes: { value: string; label: string }[];
}

const FiltroButton: React.FC<FiltroButtonProps> = ({
  value,
  onValueChange,
  opcoes,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {opcoes.map((opcao, index) => (
          <TouchableOpacity
            key={opcao.value}
            style={[
              styles.button,
              value === opcao.value && styles.activeButton,
              index === 0 && styles.firstButton,
              index === opcoes.length - 1 && styles.lastButton,
            ]}
            onPress={() => onValueChange(opcao.value)}
          >
            <Text
              style={[
                styles.buttonText,
                value === opcao.value && styles.activeButtonText,
              ]}
              numberOfLines={1}
            >
              {opcao.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginVertical: 12,
  },
  scrollContainer: {
    paddingHorizontal: 8,
    paddingRight: 16, // Adiciona padding extra à direita
  },
  button: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 16, // Reduzido de 20 para 16
    paddingVertical: 12,
    marginHorizontal: 3, // Reduzido de 4 para 3
    borderRadius: 25,
    minWidth: 80, // Reduzido de 85 para 80
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  firstButton: {
    marginLeft: 0,
  },
  lastButton: {
    marginRight: 0,
  },
  activeButton: {
    backgroundColor: "#000",
    elevation: 4,
    shadowOpacity: 0.2,
  },
  buttonText: {
    color: "#666",
    fontSize: 13, // Reduzido de 14 para 13
    fontWeight: "500",
    textAlign: "center",
  },
  activeButtonText: {
    color: "#FFF",
    fontWeight: "600",
  },
});

export default FiltroButton;
