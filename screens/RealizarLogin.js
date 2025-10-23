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
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";
import { supabase } from "../supabaseConfig";

export default function LoginScreen({ navigation }) {
  const { height, width } = Dimensions.get("screen");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate("Comeco");
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage({ type: 'error', text: 'Por favor, preencha todos os campos.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data?.user) {
        // Buscar dados do usuário na tabela users/profiles se necessário
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('auth_id', data.user.id)
          .single();

        if (userError) {
          console.warn('Erro ao buscar dados do usuário:', userError.message);
        }

        // Navegar para a tela inicial
        navigation.replace('Main');
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message === 'Invalid login credentials'
          ? 'Email ou senha incorretos.'
          : 'Erro ao fazer login. Tente novamente.'
      });
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

        <Text style={styles.title}>ENTRAR</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>EMAIL:</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={[styles.input, { width: width * 0.8 }]}
            placeholderTextColor="#ccc"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>SENHA:</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            placeholderTextColor="#ccc"
            secureTextEntry={true}
          />

          <TouchableOpacity
            style={styles.forgotButton}
            onPress={() => navigation.navigate("EsqueceuSenha")}
          >
            <Text style={styles.forgotText}>Esqueceu a senha?</Text>
          </TouchableOpacity>
        </View>

        {message && (
          <Text style={[styles.messageText, { color: message.type === 'error' ? '#ff6666' : '#88ff88' }]}>
            {message.text}
          </Text>
        )}

        <TouchableOpacity
          style={[styles.loginButton, loading ? { opacity: 0.7 } : null]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginText}>{loading ? 'ENTRANDO...' : 'ENTRAR'}</Text>
        </TouchableOpacity>

        <Text style={styles.registerText}>
          Não possui conta?{" "}
          <Text
            style={styles.registerLink}
            onPress={() => navigation.navigate("Cadastrar")}
          >
            Cadastrar
          </Text>
        </Text>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  messageText: {
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
  },
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
  forgotButton: {
    alignSelf: "flex-end",
  },
  forgotText: {
    color: "#ccc",
    fontSize: 15,
  },
  loginButton: {
    backgroundColor: "#ffffffff",
    width: 130,
    paddingVertical: 15,
    borderRadius: 28,
    alignItems: "center",
    marginBottom: 20,
  },
  loginText: {
    color: "#50062F",
    fontSize: 18,
  },
  registerText: {
    color: "#fff",
    fontSize: 15,
  },
  registerLink: {
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
