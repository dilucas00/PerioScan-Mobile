import React from "react";
import {
  View,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Text, TextInput, Button } from "react-native-paper";

export default function Login() {
  const [email, setEmail] = React.useState("");
  const [senha, setSenha] = React.useState("");
  const [mostrarSenha, setMostrarSenha] = React.useState(false);

  const handleLogin = () => {
    console.log("login concluido!", { email, senha });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        <Image
          source={require("../../../assets/icone-perioscan-mobile.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.titulo}>PerioScan</Text>
        <Text style={styles.subtitulo}>Login</Text>

        <TextInput
          label="Email"
          mode="outlined"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          autoCapitalize="none"
        />

        <TextInput
          label="Senha"
          mode="outlined"
          secureTextEntry={!mostrarSenha}
          value={senha}
          onChangeText={setSenha}
          style={styles.input}
          right={
            <TextInput.Icon
              icon={mostrarSenha ? "eye-off" : "eye"}
              onPress={() => setMostrarSenha(!mostrarSenha)}
            />
          }
        />

        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.botao}
          labelStyle={styles.botaoTexto}
        >
          Login
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000", // amarelo claro
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#FFF",
    padding: 24,
    borderRadius: 12,
    width: "85%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 8,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 16,
  },
  input: {
    width: "100%",
    marginBottom: 12,
  },
  botao: {
    marginTop: 8,
    width: "100%",
    backgroundColor: "#000",
    borderRadius: 8,
    elevation: 3,
  },
  botaoTexto: {
    color: "#FFF",
    fontWeight: "bold",
  },
});
