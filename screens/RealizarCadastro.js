import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Alert
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { supabase } from "../supabaseConfig";

export default function RealizarCadastro({ navigation }) {
  const { width } = Dimensions.get("screen");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // FUNÇÃO PRINCIPAL DE CADASTRO
  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);

    try {
      // CRIA O USUÁRIO NO AUTH
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name }
        }
      });

      if (authError) throw new Error(authError.message);

      const userId = authData?.user?.id;
      if (!userId) throw new Error("Erro inesperado. ID não recebido.");

      // INSERE NA TABELA USERS
      const { error: dbError } = await supabase.from("users").insert({
        id: userId,
        nome: name,
        email: email,
        tel: "",
        cpf: "",
        foto_url: ""
      });

      if (dbError) throw new Error("Erro ao salvar dados no banco.");

      Alert.alert(
        "Sucesso!",
        "Cadastro concluído!",
        [
          {
            text: "OK",
            onPress: () =>
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: "Main",
                    params: { userId, userEmail: email }
                  }
                ]
              })
          }
        ]
      );
    } catch (error) {
      Alert.alert("Erro", error.message || "Não foi possível cadastrar.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate("Login");
    }
  };

  return (
    <LinearGradient colors={["#000000", "#780b47"]} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.innerContainer}
      >
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <FontAwesome name="arrow-left" size={28} color="#fff" />
        </TouchableOpacity>

        <Image
          source={require("../src/assets/logo_geosync_fundotransparente.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>CADASTRO</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>NOME:</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            style={[styles.input, { width: width * 0.8 }]}
            placeholder="Digite seu nome completo"
            placeholderTextColor="#ccc"
            autoCapitalize="words"
          />

          <Text style={styles.label}>EMAIL:</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={[styles.input, { width: width * 0.8 }]}
            placeholder="Digite seu email"
            placeholderTextColor="#ccc"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>SENHA:</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            style={[styles.input, { width: width * 0.8 }]}
            placeholder="Digite sua senha"
            placeholderTextColor="#ccc"
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={[styles.loginButton, loading && { opacity: 0.7 }]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.loginText}>
            {loading ? "CADASTRANDO..." : "CADASTRAR"}
          </Text>
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>
            Já possui conta?{" "}
            <Text
              style={styles.registerLink}
              onPress={() => navigation.navigate("Login")}
            >
              Entrar
            </Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    flex: 1,
    padding: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 70,
    left: 50,
    padding: 10,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 30,
  },
  logo: {
    width: 400,
    height: 400,
    marginBottom: -120,
    marginTop: -50,
  },
  title: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 90,
    marginTop: -40,
  },
  inputContainer: {
    marginBottom: 40,
  },
  label: {
    color: "#fff",
    marginBottom: 5,
    fontWeight: "bold",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    color: "#fff",
    marginBottom: 20,
    paddingVertical: 5,
  },
  loginButton: {
    backgroundColor: "#fff",
    width: 150,
    paddingVertical: 15,
    borderRadius: 28,
    alignItems: "center",
    marginBottom: 20,
  },
  loginText: {
    color: "#50062F",
    fontSize: 18,
    fontWeight: "bold",
  },
  registerContainer: {
    marginTop: 10,
  },
  registerText: {
    color: "#fff",
    fontSize: 15,
  },
  registerLink: {
    fontWeight: "bold",
    textDecorationLine: "underline",
    color: "#ccc",
  },
});
