import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";

export default function Config() {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 40 }}>
        TELA DE CONFIGURAÇÕES!
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}
