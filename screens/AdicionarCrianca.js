import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  ScrollView,
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
  Alert, // Importar Alert para feedback ao usuário
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../ThemeContext";
import { supabase } from "../supabaseConfig"; // Importar o cliente Supabase

// Função auxiliar para calcular a idade a partir da data de nascimento (DD/MM/AAAA)
const calcularIdade = (dataNascimento) => {
  if (!dataNascimento || dataNascimento.length !== 10) return null;
  
  const [dia, mes, ano] = dataNascimento.split('/').map(Number);
  if (!dia || !mes || !ano) return null;

  const dataNasc = new Date(ano, mes - 1, dia);
  const hoje = new Date();
  
  let idade = hoje.getFullYear() - dataNasc.getFullYear();
  const mesAtual = hoje.getMonth();
  const mesNasc = dataNasc.getMonth();
  
  if (mesAtual < mesNasc || (mesAtual === mesNasc && hoje.getDate() < dataNasc.getDate())) {
    idade--;
  }
  
  return idade;
};

// Função auxiliar para simular a obtenção do ID do usuário logado
// Em um aplicativo real, você obterá isso do estado de autenticação do Supabase (supabase.auth.user().id)
const getUserId = async () => {
    // **IMPORTANTE:** Em um app real, você usaria:
    // const { data: { user } } = await supabase.auth.getUser();
    // return user?.id;
    
    // Para fins de demonstração, vamos simular um ID de usuário UUID
    // Você DEVE substituir isso pela lógica real de autenticação do Supabase.
    return "00000000-0000-0000-0000-000000000001"; 
};

// Função auxiliar para buscar o mochila_id a partir do sensorId (que assumimos ser o nome da mochila)
const getMochilaId = async (sensorId) => {
    if (!sensorId) return null;

    const { data, error } = await supabase
        .from('mochilas')
        .select('id')
        .eq('nome', sensorId) // Assumindo que sensorId é o nome da mochila
        .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 é "No rows found"
        console.error("Erro ao buscar mochila:", error);
        Alert.alert("Erro", "Não foi possível verificar o ID da mochila. Tente novamente.");
        return null;
    }
    
    return data ? data.id : null;
};


export default function AdicionarCrianca({ navigation }) {
  const { darkMode, theme } = useTheme();
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [escola, setEscola] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [sensorId, setSensorId] = useState("");
  const [criada, setCriada] = useState(false);
  const [loading, setLoading] = useState(false); // Estado de carregamento

  const handleAdicionar = async () => {
    if (nome.trim() === "") {
        Alert.alert("Erro", "O nome da criança é obrigatório.");
        return;
    }
    
    setLoading(true);

    try {
        // 1. Obter o ID do usuário logado
        const usuario_id = await getUserId();
        if (!usuario_id) {
            Alert.alert("Erro de Autenticação", "Usuário não logado. Por favor, faça login.");
            setLoading(false);
            return;
        }

        // 2. Calcular a idade
        const idade = calcularIdade(dataNascimento);
        if (dataNascimento && idade === null) {
            Alert.alert("Erro", "Formato de Data de Nascimento inválido. Use DD/MM/AAAA.");
            setLoading(false);
            return;
        }
        
        // 3. Buscar o ID da mochila (se sensorId foi fornecido)
        let mochila_id = null;
        if (sensorId) {
            mochila_id = await getMochilaId(sensorId);
            if (!mochila_id) {
                Alert.alert("Erro", `Mochila com ID/Nome "${sensorId}" não encontrada. Verifique o ID.`);
                setLoading(false);
                return;
            }
        }

        // 4. Preparar os dados para inserção
        const criancaData = {
            nome: nome.trim(),
            idade: idade, // Pode ser null se a data não for fornecida/válida
            usuario_id: usuario_id,
            mochila_id: mochila_id, // Pode ser null se não houver mochila
            // foto_url: A lógica de upload de foto é mais complexa e será tratada separadamente, 
            // por enquanto, vamos deixar como null ou um valor padrão.
            // data_criacao: O Supabase deve preencher automaticamente com o valor padrão.
        };

        // 5. Inserir no Supabase
        const { data, error } = await supabase
            .from('criancas')
            .insert([criancaData])
            .select(); // Retorna o registro inserido

        if (error) {
            console.error("Erro ao adicionar criança:", error);
            Alert.alert("Erro de Banco de Dados", `Não foi possível adicionar a criança: ${error.message}`);
            return;
        }

        // Sucesso
        Alert.alert("Sucesso", `${nome} foi adicionado(a) com sucesso!`);
        setCriada(true); // Exibe o card de sucesso
        
    } catch (e) {
        console.error("Erro inesperado:", e);
        Alert.alert("Erro", "Ocorreu um erro inesperado ao adicionar a criança.");
    } finally {
        setLoading(false);
    }
  };

  const handleRemover = () => {
    setNome("");
    setDataNascimento("");
    setEscola("");
    setPeriodo("");
    setSensorId("");
    setCriada(false);
  };

  return (
   <SafeAreaView
  style={[
    styles.safeArea,
    { backgroundColor: theme.colors.background },
  ]}
>
      <LinearGradient
        colors={["#000000", "#780b47"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>ADICIONAR CRIANÇA</Text>
      </LinearGradient>

      {/* KeyboardAvoidingView pra levantar a tela quando o teclado abrir */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 80}
      >
        <ScrollView
          contentContainerStyle={styles.formContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {!criada ? (
            <>
              <TouchableOpacity style={styles.fotoContainer}>
                <View
                  style={[
                    styles.avatarWrapper,
                    {
                      borderColor: "#780b47",
                      backgroundColor: darkMode ? "#192230" : "#fff",
                    },
                  ]}
                >
                  <Ionicons
                    name="person"
                    size={115}
                    color={darkMode ? "#fff" : "#192230"}
                  />
                </View>
                <Text
                  style={[
                    styles.fotoText,
                    { color: darkMode ? "#ffffffff" : "#780b47" },
                  ]}
                >
                  Alterar foto
                </Text>
              </TouchableOpacity>

              <Text style={[styles.label, { color: darkMode ? "#fff" : "#555" }]}>
                NOME
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: darkMode ? "#192230" : "#fff",
                    color: darkMode ? "#fff" : "#333",
                    borderColor: darkMode ? "#555" : "#ccc",
                  },
                ]}
                placeholder="Digite o nome"
                placeholderTextColor={darkMode ? "#888" : "#888"}
                value={nome}
                onChangeText={setNome}
                returnKeyType="next"
              />

              <Text style={[styles.label, { color: darkMode ? "#fff" : "#555" }]}>
                DATA DE NASCIMENTO
              </Text>
              <View
                style={[
                  styles.inputIcon,
                  {
                    backgroundColor: darkMode ? "#192230" : "#fff",
                    borderColor: darkMode ? "#555" : "#ccc",
                  },
                ]}
              >
                <Ionicons
                  name="calendar-outline"
                  size={22}
                  color={darkMode ? "#fff" : "#000000ff"}
                />
                <TextInput
                  style={[styles.inputWithIcon, { color: darkMode ? "#fff" : "#333" }]}
                  placeholder="DD/MM/AAAA"
                  placeholderTextColor={darkMode ? "#888" : "#888"}
                  value={dataNascimento}
                  onChangeText={setDataNascimento}
                  keyboardType="numeric"
                  returnKeyType="next"
                />
              </View>

              <Text style={[styles.label, { color: darkMode ? "#fff" : "#555" }]}>
                ESCOLA
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: darkMode ? "#192230" : "#fff",
                    color: darkMode ? "#fff" : "#333",
                    borderColor: darkMode ? "#555" : "#ccc",
                  },
                ]}
                placeholder="Digite a escola"
                placeholderTextColor={darkMode ? "#888" : "#888"}
                value={escola}
                onChangeText={setEscola}
                returnKeyType="next"
              />

              <Text style={[styles.label, { color: darkMode ? "#fff" : "#555" }]}>
                PERÍODO ESCOLAR
              </Text>
              <View
                style={[
                  styles.inputIcon,
                  {
                    backgroundColor: darkMode ? "#192230" : "#fff",
                    borderColor: darkMode ? "#555" : "#ccc",
                  },
                ]}
              >
                <Ionicons
                  name="time-outline"
                  size={22}
                  color={darkMode ? "#fff" : "#000000ff"}
                />
                <TextInput
                  style={[styles.inputWithIcon, { color: darkMode ? "#fff" : "#333" }]}
                  placeholder="Ex: 07h - 16:30h"
                  placeholderTextColor={darkMode ? "#888" : "#888"}
                  value={periodo}
                  onChangeText={setPeriodo}
                  returnKeyType="next"
                />
              </View>

              <Text style={[styles.label, { color: darkMode ? "#fff" : "#555" }]}>
                CONECTAR MOCHILA
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: darkMode ? "#192230" : "#fff",
                    color: darkMode ? "#fff" : "#333",
                    borderColor: darkMode ? "#434343ff" : "#ccc",
                  },
                ]}
                placeholder="Insira o ID do sensor"
                placeholderTextColor={darkMode ? "#888" : "#888"}
                value={sensorId}
                onChangeText={setSensorId}
                returnKeyType="done"
              />

              <TouchableOpacity style={styles.button} onPress={handleAdicionar} disabled={loading}>
                <LinearGradient
                  colors={
                    darkMode ? ["#75153fff", "#75153fff"] : ["#780b47", "#64063aff"]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradient}
                >
                  <Text style={styles.buttonText}>
                    {loading ? "ADICIONANDO..." : "ADICIONAR"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.childCard}>
              <View style={styles.childHeader}>
                <Text style={[styles.childName, { color: darkMode ? "#fff" : "#000" }]}>
                  {nome}
                </Text>
                <TouchableOpacity onPress={handleRemover}>
                  <FontAwesome name="trash" size={22} color={darkMode ? "#fff" : "#000"} />
                </TouchableOpacity>
              </View>
              <Text style={[styles.childText, { color: darkMode ? "#bbb" : "#333" }]}>
                🎂 {dataNascimento || "Sem data"}
              </Text>
              <Text style={[styles.childText, { color: darkMode ? "#bbb" : "#333" }]}>
                🏫 {escola || "Sem escola"}
              </Text>
              <Text style={[styles.childText, { color: darkMode ? "#bbb" : "#333" }]}>
                ⏰ {periodo || "Sem horário"}
              </Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  flex: { flex: 1 },
  header: {
    marginTop: -10,
    height: 80,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  headerText: {
    marginBottom: 9,
    fontSize: 30,
    fontWeight: "100",
    color: "#fff",
  },
  backButton: {
    position: "absolute",
    left: 23,
    bottom: 26,
  },
  formContainer: {
    paddingHorizontal: 25,
    paddingVertical: 20,
    paddingBottom: 100, // espaço extra pro teclado
  },
  avatarWrapper: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  fotoContainer: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 25,
  },
  fotoText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "500",
  },
  label: {
    marginTop: 15,
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  input: {
    height: 45,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1,
    elevation: 2,
  },
  inputIcon: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    elevation: 2,
  },
  inputWithIcon: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    marginLeft: 8,
  },
  button: {
    marginTop: 40,
    borderRadius: 25,
    overflow: "hidden",
    alignSelf: "center",
    width: 180,
    elevation: 5,
  },
  gradient: {
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: 25,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    textTransform: "uppercase",
  },
  childCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    marginTop: 40,
  },
  childHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  childName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  childText: {
    marginTop: 10,
    fontSize: 16,
  },
});
