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
  const { height, width } = Dimensions.get("screen");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate("Login");
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // 1. Criar usuário no Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!authData?.user?.id) {
        throw new Error("Erro ao criar usuário. Tente novamente.");
      }

      // 2. Inserir dados na tabela users
      const { error: dbError } = await supabase.from("users").insert({
        nome: name,
        email: email,
        auth_id: authData.user.id
      });

      if (dbError) {
        console.error("Erro ao inserir no banco:", dbError);
        // Tentar sem auth_id se der erro
        const { error: basicError } = await supabase.from("users").insert({
          nome: name,
          email: email
        });

        if (basicError) {
          throw new Error("Erro ao salvar seus dados. Tente novamente.");
        }
      }

      // Sucesso!
      Alert.alert(
        "Sucesso",
        "Cadastro realizado com sucesso!",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Login")
          }
        ]
      );
    } catch (error) {
      Alert.alert("Erro", error.message || "Erro ao realizar cadastro");
    } finally {
      setLoading(false);
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

        <Text style={styles.title}>
          <Text>CADASTRO</Text>
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            <Text>NOME:</Text>
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            style={[styles.input, { width: width * 0.8 }]}
            placeholder="Digite seu nome completo"
            placeholderTextColor="#ccc"
            keyboardType="default"
            autoCapitalize="words"
          />

          <Text style={styles.label}>
            <Text>EMAIL:</Text>
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={[styles.input, { width: width * 0.8 }]}
            placeholder="Digite seu email"
            placeholderTextColor="#ccc"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>
            <Text>SENHA:</Text>
          </Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            style={[styles.input, { width: width * 0.8 }]}
            placeholder="Digite sua senha"
            placeholderTextColor="#ccc"
            secureTextEntry={true}
          />
        </View>

        <TouchableOpacity
          style={[styles.loginButton, loading ? { opacity: 0.7 } : null]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.loginText}>
            <Text>{loading ? "CADASTRANDO..." : "CADASTRAR"}</Text>
          </Text>
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>
            <Text>Já possui conta?</Text>
            {" "}
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
    width: "100%",
    alignItems: "center",
  },
  label: {
    color: "#fff",
    marginBottom: 5,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginLeft: "10%",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    color: "#fff",
    marginBottom: 20,
    paddingVertical: 5,
  },
  loginButton: {
    backgroundColor: "#ffffff",
    width: 150,
    paddingVertical: 15,
    borderRadius: 28,
    alignItems: "center",
    marginBottom: 20,
  },
  loginText: {
    color: "#50062F",
    fontSize: 18,
    fontWeight: "bold"
  },
  registerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  registerText: {
    color: "#fff",
    fontSize: 15,
  },
  registerLink: {
    fontWeight: "bold",
    textDecorationLine: "underline",
  }
});