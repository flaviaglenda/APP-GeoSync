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
  Alert,
  Image,
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../ThemeContext";
import { supabase } from "../supabaseConfig";
import * as ImagePicker from "expo-image-picker";

/* ---------------------- FUNÇÃO CALCULAR IDADE ------------------------- */
const calcularIdade = (dataNascimento) => {
  if (!dataNascimento || dataNascimento.length !== 10) return null;

  const [dia, mes, ano] = dataNascimento.split("/").map(Number);
  if (!dia || !mes || !ano) return null;

  const dataNasc = new Date(ano, mes - 1, dia);
  const hoje = new Date();

  let idade = hoje.getFullYear() - dataNasc.getFullYear();
  const mesAtual = hoje.getMonth();
  const mesNasc = dataNasc.getMonth();

  if (
    mesAtual < mesNasc ||
    (mesAtual === mesNasc && hoje.getDate() < dataNasc.getDate())
  ) {
    idade--;
  }

  return idade;
};

/* ---------------- SIMULAÇÃO DE USUÁRIO LOGADO ----------------- */
const getUserId = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user?.id || null;
  } catch (error) {
    console.error("Erro ao buscar sessão:", error);
    return null;
  }
};

/* ---------------- GET MOCHILA ID ----------------- */
const getMochilaId = async (sensorId) => {
  if (!sensorId) return null;

  const { data, error } = await supabase
    .from("mochilas")
    .select("id")
    .eq("nome", sensorId)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Erro ao buscar mochila:", error);
    return null;
  }

  return data ? data.id : null;
};

/* ----------------------- COMPONENTE PRINCIPAL ------------------------ */
export default function AdicionarCrianca({ navigation }) {
  const { darkMode, theme } = useTheme();

  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [escola, setEscola] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [sensorId, setSensorId] = useState("");
  const [fotoUrl, setFotoUrl] = useState(null); // preview e URL
  const [loading, setLoading] = useState(false);

  /* ---------------- MÁSCARA DATA ---------------- */
  const handleMascaraData = (text) => {
    let clean = text.replace(/\D/g, "");
    if (clean.length > 8) clean = clean.slice(0, 8);

    let masked = clean;
    if (clean.length > 2) masked = clean.slice(0, 2) + "/" + clean.slice(2);
    if (clean.length > 4) masked = masked.slice(0, 5) + "/" + clean.slice(4);

    setDataNascimento(masked);
  };

  /* ---------------- MÁSCARA HORÁRIO ---------------- */
  const handleMascaraHorario = (text) => {
    let clean = text.replace(/[^\d-]/g, "");
    if (clean.length > 13) clean = clean.slice(0, 13);

    if (clean.length >= 3 && clean[2] !== ":")
      clean = clean.slice(0, 2) + ":" + clean.slice(2);

    if (clean.length >= 8 && clean[7] !== "-")
      clean = clean.slice(0, 5) + " - " + clean.slice(5);

    if (clean.length >= 11 && clean[10] !== ":")
      clean = clean.slice(0, 10) + ":" + clean.slice(10);

    setPeriodo(clean);
  };

  /* ---------------- ESCOLHER FOTO — MESMA DO PerfilCrianca ---------------- */
  const escolherFoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (result.canceled) return;

    const asset = result.assets[0];

    // preview instantâneo igual PerfilCrianca
    setFotoUrl(asset.uri);
  };

  /* ---------------- UPLOAD (igual PerfilCrianca) ---------------- */
 const uploadFoto = async (localUri, criancaId) => {
  try {
    // Corrige caminho do Android que dá erro
    const uri = localUri.startsWith("file://")
      ? localUri
      : "file://" + localUri;

    const response = await fetch(uri);
    const blob = await response.blob();

    const fileName = `criancas/${criancaId}_${Date.now()}.jpg`;

    const { error: uploadError } = await supabase.storage
      .from("fotos")
      .upload(fileName, blob, {
        upsert: true,
        contentType: "image/jpeg",
      });

    if (uploadError) {
      console.log("Erro upload:", uploadError);
      return null;
    }

    const { data } = supabase.storage.from("fotos").getPublicUrl(fileName);
    return data.publicUrl;

  } catch (e) {
    console.log("Erro upload:", e);
    return null;
  }
};

  /* ---------------- ADICIONAR CRIANÇA ---------------- */
  const handleAdicionar = async () => {
    if (!nome.trim()) {
      Alert.alert("Erro", "O nome da criança é obrigatório.");
      return;
    }

    setLoading(true);

    try {
      const usuario_id = await getUserId();
      if (!usuario_id) {
        Alert.alert("Erro", "Você precisa estar logado.");
        setLoading(false);
        return;
      }

      const idade = calcularIdade(dataNascimento);
      if (dataNascimento && idade === null) {
        Alert.alert("Erro", "Data inválida. Use DD/MM/AAAA.");
        setLoading(false);
        return;
      }

      let mochila_id = null;
      if (sensorId) mochila_id = await getMochilaId(sensorId);

      // Primeiro cria a criança
      const { data: criada, error: createError } = await supabase
        .from("criancas")
        .insert([
          {
            nome,
            idade,
            usuario_id,
            escola,
            periodo,
            mochila_id,
          },
        ])
        .select()
        .single();

      if (createError) {
        Alert.alert("Erro ao salvar", createError.message);
        setLoading(false);
        return;
      }

      let foto_url_final = null;

      // se escolheu foto → faz upload IGUAL PerfilCrianca
      if (fotoUrl) {
        foto_url_final = await uploadFoto(fotoUrl, criada.id);

        if (foto_url_final) {
          await supabase
            .from("criancas")
            .update({ foto_url: foto_url_final })
            .eq("id", criada.id);
        }
      }

      Alert.alert("Sucesso", `${nome} foi adicionada!`);
      navigation.navigate("GerenciarCrianca");

    } catch (e) {
      Alert.alert("Erro", "Erro inesperado.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <LinearGradient
        colors={["#5f0738", "#5f0738"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>ADICIONAR CRIANÇA</Text>
      </LinearGradient>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 80}
      >
        <ScrollView contentContainerStyle={styles.formContainer}>
          <TouchableOpacity style={styles.fotoContainer} onPress={escolherFoto}>
            <View
              style={[
                styles.avatarWrapper,
                {
                  borderColor: "#780b47",
                  backgroundColor: darkMode ? "#192230" : "#fff",
                },
              ]}
            >
              {fotoUrl ? (
                <Image
                  source={{ uri: fotoUrl }}
                  style={{
                    width: 150,
                    height: 150,
                    borderRadius: 75,
                  }}
                />
              ) : (
                <Ionicons
                  name="person"
                  size={115}
                  color={darkMode ? "#fff" : "#192230"}
                />
              )}
            </View>

            <Text
              style={[
                styles.fotoText,
                { color: darkMode ? "#fff" : "#780b47" },
              ]}
            >
              Adicionar foto
            </Text>
          </TouchableOpacity>

          {/* Inputs */}
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
            placeholderTextColor="#888"
            value={nome}
            onChangeText={setNome}
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
              color={darkMode ? "#fff" : "#000"}
            />
            <TextInput
              style={[styles.inputWithIcon, { color: darkMode ? "#fff" : "#333" }]}
              placeholder="DD/MM/AAAA"
              placeholderTextColor="#888"
              value={dataNascimento}
              keyboardType="numeric"
              onChangeText={handleMascaraData}
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
            placeholderTextColor="#888"
            value={escola}
            onChangeText={setEscola}
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
              color={darkMode ? "#fff" : "#000"}
            />
            <TextInput
              style={[styles.inputWithIcon, { color: darkMode ? "#fff" : "#333" }]}
              placeholder="07:00 - 16:30"
              placeholderTextColor="#888"
              value={periodo}
              onChangeText={handleMascaraHorario}
              keyboardType="numeric"
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
                borderColor: darkMode ? "#434343" : "#ccc",
              },
            ]}
            placeholder="Insira o ID do sensor"
            placeholderTextColor="#888"
            value={sensorId}
            onChangeText={setSensorId}
          />

          <TouchableOpacity onPress={handleAdicionar} disabled={loading}>
            <LinearGradient
              colors={
                darkMode ? ["#75153f", "#75153f"] : ["#780b47", "#64063a"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>
                {loading ? "ADICIONANDO..." : "ADICIONAR"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ----------------------- STYLES ------------------------ */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  flex: { flex: 1 },header: {
    marginTop: -30,
    height: 95,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingBottom: 10,
    borderRadius: 33,
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
  },
  avatarWrapper: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    marginBottom: 10,
  },
  fotoContainer: { alignItems: "center", marginTop: 30, marginBottom: 25 },
  fotoText: { marginTop: 10, fontSize: 16, fontWeight: "500" },
  label: { marginTop: 15, fontSize: 13, fontWeight: "bold" },
  input: {
    height: 45,
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  inputIcon: {
    flexDirection: "row",
    alignItems: "center",
    height: 45,
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  inputWithIcon: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  button: {
    marginTop: 30,
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});
