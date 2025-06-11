import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  Text,
  TextInput,
  Button,
  Snackbar,
  ActivityIndicator,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [senha, setSenha] = React.useState("");
  const [showPassword, setshowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [erro, setErro] = React.useState("");
  const [sucesso, setSucesso] = React.useState("");

  //  Verifica se já está logado
  useEffect(() => {
    const verificarLogin = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        router.replace("/DashboardAdmin");
      }
    };
    verificarLogin();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    setErro("");
    setSucesso("");

    try {
      const response = await fetch(
        "https://perioscan-back-end-fhhq.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password: senha,
          }),
        }
      );

      const data = await response.json();
      console.log("Resposta do servidor:", data);

      if (!response.ok) {
        throw new Error(data.message || "Credenciais inválidas");
      }

      if (!data.token || !data.user) {
        throw new Error("Dados de autenticação incompletos");
      }

      // Salvando no AsyncStorage
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("userId", String(data.user.id));
      await AsyncStorage.setItem("name", data.user.name);
      await AsyncStorage.setItem("role", data.user.role);

      setSucesso("Login realizado com sucesso!");
      router.replace("/DashboardAdmin");
    } catch (err) {
      console.error("Erro no login:", err);
      if (err instanceof Error) {
        setErro(
          err.message.includes("Failed to fetch")
            ? "Não foi possível conectar ao servidor"
            : err.message
        );
      } else {
        setErro("Ocorreu um erro desconhecido.");
      }
    } finally {
      setLoading(false);
    }
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
        <Text style={styles.subtitulo}>
          Identifique-se para acessar sua conta.
        </Text>

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
          secureTextEntry={!showPassword}
          value={senha}
          onChangeText={setSenha}
          style={styles.input}
          right={
            <TextInput.Icon
              icon={showPassword ? "eye-off" : "eye"}
              onPress={() => setshowPassword(!showPassword)}
            />
          }
        />

        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.botao}
          labelStyle={styles.botaoTexto}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#FFF" /> : "Login"}
        </Button>

        <Snackbar
          visible={!!erro}
          onDismiss={() => setErro("")}
          duration={3000}
          style={{ backgroundColor: "red" }}
        >
          {erro}
        </Snackbar>

        <Snackbar
          visible={!!sucesso}
          onDismiss={() => setSucesso("")}
          duration={3000}
          style={{ backgroundColor: "green" }}
        >
          {sucesso}
        </Snackbar>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  card: {
    backgroundColor: "#FFF",
    padding: 24,
    borderRadius: 12,
    width: "100%",
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
    color: "#000",
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 16,
    color: "#000",
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
