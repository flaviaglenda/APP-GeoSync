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
  Dimensions
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { supabase } from "../supabaseConfig";

export default function LoginScreen({ navigation }) {
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
    setMessage(null);
    if (!name || !email || !password) {
      setMessage({ type: 'error', text: 'Preencha todos os campos.' });
      return;
    }
    setLoading(true);
    try {
      // Criar usuário no Supabase (Auth)
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        setMessage({ type: 'error', text: signUpError.message });
        setLoading(false);
        return;
      }

      // Inserir perfil na tabela `profiles` (ajuste o nome da tabela/colunas se necessário)
      // A coluna `id` deve ser igual ao `user.id` retornado pelo signUp (data.user.id)
      const userId = data?.user?.id;
      if (userId) {
        // Tentar inserir o perfil sem forçar o id (evita erro quando id da tabela é bigint)
        // Primeiro: tentar inserir linkando o id do Auth em colunas comumente usadas
        const authCols = ['auth_id', 'supabase_id', 'user_id', 'auth_uid', 'uid'];
        let inserted = false;

        for (let col of authCols) {
          const payload = { nome: name, email };
          payload[col] = userId;
          const { error } = await supabase.from('users').insert(payload);
          if (!error) {
            inserted = true;
            break;
          }
          // Se o erro for especificamente sobre bigint, continue tentando outras colunas
          if (!error) {
            // handled above
          }
        }

        if (!inserted) {
          // Tentar inserir sem o id do auth (coluna auto-increment BigInt será preenchida)
          const { error: insertWithoutIdError } = await supabase.from('users').insert({ nome: name, email });
          if (insertWithoutIdError) {
            // Se ainda falhar, retornar o erro original para o usuário
            // Detectar erro conhecido de bigint para fornecer orientação
            const msg = insertWithoutIdError.message || 'Erro ao inserir usuário.';
            setMessage({ type: 'error', text: msg });
            setLoading(false);
            return;
          } else {
            // Inserido sem vínculo direto ao Auth — informar ao usuário sobre como ajustar o DB
            setMessage({ type: 'success', text: 'Cadastro realizado! Perfil criado sem vínculo ao Auth. Considere adicionar uma coluna `auth_id` (uuid/text) na tabela `users` para ligar as contas.' });
            setLoading(false);
            setTimeout(() => navigation.replace('Login'), 1400);
            return;
          }
        }
      }

      setMessage({ type: 'success', text: 'Cadastro realizado! Verifique seu e-mail se necessário.' });
      // navegar para Login após breve atraso
      setTimeout(() => navigation.replace('Login'), 1200);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Erro no cadastro.' });
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

        <Text style={styles.title}>CADASTRO</Text>



        <View style={styles.inputContainer}>

          <Text style={styles.label}>NOME:</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            style={[styles.input, { width: width * 0.8 }]}
            placeholderTextColor="#ccc"
            keyboardType="default"
            autoCapitalize="words"
          />


          <Text style={styles.label}>EMAIL:</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={styles.input}
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

          <TouchableOpacity style={styles.forgotButton}>
            <Text style={styles.forgotText}
              onPress={() => navigation.navigate("EsqueceuSenha")} >Esqueceu a senha?</Text>
          </TouchableOpacity>
        </View>

        {message && (
          <Text style={{ color: message.type === 'error' ? '#ff6666' : '#88ff88', marginBottom: 10 }}>{message.text}</Text>
        )}

        <TouchableOpacity
          style={[styles.loginButton, loading ? { opacity: 0.7 } : null]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.loginText}>{loading ? 'CADASTRANDO...' : 'CADASTRAR'}</Text>
        </TouchableOpacity>

        <Text style={styles.registerText}>
          Já possui conta? <Text style={styles.registerLink}
            onPress={() => navigation.navigate("Login")} >Entrar</Text>
        </Text>
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
  forgotButton: {
    alignSelf: "flex-end",
  },
  forgotText: {
    color: "#ccc",
    fontSize: 15,
  },
  loginButton: {
    backgroundColor: "#ffffffff",
    width: 150,
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
