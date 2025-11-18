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
import { useNavigation } from "@react-navigation/native";

export default function RealizarLogin() {
  const navigation = useNavigation();
  const { width } = Dimensions.get("screen");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha o e-mail e a senha.");
      return;
    }

    setLoading(true);

    try {
      // LOGIN NO SUPABASE AUTH
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        Alert.alert("Erro de Login", "Email ou senha incorretos.");
        return;
      }

      if (!data?.user) {
        Alert.alert("Erro", "Usuário não encontrado.");
        return;
      }

      // LOGIN OK → REDIRECIONA
      navigation.reset({
        index: 0,
        routes: [
          {
            name: "Main",
            params: {
              userEmail: email,
              userId: data.user.id,
            },
          },
        ],
      });

    } catch (err) {
      Alert.alert("Erro", "Ocorreu um erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate("Comeco");
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

        <Text style={styles.title}>LOGIN</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>EMAIL:</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={[styles.input, { width: width * 0.8 }]}
            placeholder="Seu email cadastrado"
            placeholderTextColor="#ccc"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>SENHA:</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            style={[styles.input, { width: width * 0.8 }]}
            placeholder="Sua senha"
            placeholderTextColor="#ccc"
            secureTextEntry
          />

          <TouchableOpacity style={styles.forgotButton}>
            <Text
              style={styles.forgotText}
              onPress={() => navigation.navigate("EsqueceuSenha")}
            >
              Esqueceu a senha?
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.loginButton, loading ? { opacity: 0.7 } : null]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginText}>
            {loading ? "ENTRANDO..." : "ENTRAR"}
          </Text>
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>
            Não possui conta?{" "}
            <Text
              style={[styles.registerText, styles.registerLinkStyle]}
              onPress={() => navigation.navigate("RealizarCadastro")}
            >
              Cadastre-se
            </Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
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
  logo: { width: 400, height: 400, marginBottom: -120, marginTop: -50 },
  title: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 90,
    marginTop: -40,
  },
  inputContainer: { marginBottom: 40 },
  label: { color: "#fff", marginBottom: 5, fontWeight: "bold" },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    color: "#fff",
    marginBottom: 20,
    paddingVertical: 5,
  },
  forgotButton: { alignSelf: "flex-end" },
  forgotText: { color: "#ccc", fontSize: 15 },
  loginButton: {
    backgroundColor: "#fff",
    width: 150,
    paddingVertical: 15,
    borderRadius: 28,
    alignItems: "center",
    marginBottom: 20,
  },
  loginText: { color: "#50062F", fontSize: 18, fontWeight: "bold" },
  registerText: { color: "#fff", fontSize: 15 },
  registerLinkStyle: {
    fontWeight: "bold",
    textDecorationLine: "underline",
    color: "#ccc",
  },
  registerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
