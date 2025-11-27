import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Image,
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../ThemeContext";
import { supabase } from "../supabaseConfig";

export default function PerfilCrianca({ navigation, route }) {
  const { darkMode, theme } = useTheme();
  const { id } = route.params;

  const [crianca, setCrianca] = useState(null);
  const [escola, setEscola] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [fotoUrl, setFotoUrl] = useState(null);

  useEffect(() => {
    buscarCrianca();
  }, []);

  const buscarCrianca = async () => {
    const { data, error } = await supabase
      .from("criancas")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível carregar os dados.");
      return;
    }

    setCrianca(data);
    setNome(data.nome);
    setIdade(data.idade?.toString());
    setEscola(data.escola || "");
    setPeriodo(data.periodo || "");
    setFotoUrl(data.foto_url);
  };

  const escolherFoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (result.canceled) return;

    const asset = result.assets[0];
    setFotoUrl(asset.uri);

    const response = await fetch(asset.uri);
    const blob = await response.blob();

    const fileName = `criancas/${id}_${Date.now()}.jpg`;

    const { error: uploadError } = await supabase.storage
      .from("fotos")
      .upload(fileName, blob, {
        upsert: true,
        contentType: "image/jpeg",
      });

    if (uploadError) {
      console.log(uploadError);
      Alert.alert("Erro", "Não foi possível enviar a imagem.");
      return;
    }

    const { data } = supabase.storage
      .from("fotos")
      .getPublicUrl(fileName);

    setFotoUrl(data.publicUrl);
  };

  const salvarAlteracoes = async () => {
    const { error } = await supabase
      .from("criancas")
      .update({
        nome,
        idade: parseInt(idade),
        escola,
        periodo,
        foto_url: fotoUrl,
      })
      .eq("id", id);

    if (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível salvar.");
      return;
    }

    Alert.alert("Sucesso", "Dados atualizados!");
    navigation.goBack();
  };

  if (!crianca) return null;

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={[
              styles.container,
              { backgroundColor: darkMode ? "#192230" : "#e9e9eb" },
            ]}
          >
            <LinearGradient
              colors={["#5f0738", "#5f0738"]}
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

              <Text style={styles.headerText}>PERFIL CRIANÇA</Text>
            </LinearGradient>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.avatarContainer}>
                <View
                  style={[
                    styles.avatarWrapper,
                    { borderColor: darkMode ? "#881052ff" : "#780b47" },
                  ]}
                >
                  {fotoUrl ? (
                    <Image
                      source={{ uri: fotoUrl }}
                      style={{ width: 140, height: 140, borderRadius: 70 }}
                    />
                  ) : (
                    <Ionicons
                      name="person"
                      size={100}
                      color={darkMode ? "#fff" : "#192230"}
                    />
                  )}

                  <TouchableOpacity
                    style={styles.editIcon}
                    onPress={escolherFoto}
                  >
                    <FontAwesome name="pencil" size={18} color="#fff" />
                  </TouchableOpacity>
                </View>

                <Text
                  style={[
                    styles.nomeCrianca,
                    { color: darkMode ? "#fff" : "#333" },
                  ]}
                >
                  {nome}
                </Text>

                <Text
                  style={[
                    styles.idadeCrianca,
                    { color: darkMode ? "#ccc" : "#666" },
                  ]}
                >
                  {idade} anos
                </Text>
              </View>

              {/* ============================ INPUTS ============================ */}
              <View
                style={[
                  styles.inputContainer,
                  { backgroundColor: darkMode ? "#0d1727ff" : "#fff" },
                ]}
              >
                <Text
                  style={[
                    styles.label,
                    { color: darkMode ? "#fff" : "#333" },
                  ]}
                >
                  NOME
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      color: darkMode ? "#fff" : "#000",
                      borderBottomColor: darkMode ? "#fff" : "#999",
                    },
                  ]}
                  value={nome}
                  onChangeText={setNome}
                />

                <Text
                  style={[
                    styles.label,
                    { color: darkMode ? "#fff" : "#333" },
                  ]}
                >
                  IDADE
                </Text>
                <TextInput
                  keyboardType="numeric"
                  style={[
                    styles.input,
                    {
                      color: darkMode ? "#fff" : "#000",
                      borderBottomColor: darkMode ? "#fff" : "#999",
                    },
                  ]}
                  value={idade}
                  onChangeText={setIdade}
                />

                <Text
                  style={[
                    styles.label,
                    { color: darkMode ? "#fff" : "#333" },
                  ]}
                >
                  ESCOLA
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      color: darkMode ? "#fff" : "#000",
                      borderBottomColor: darkMode ? "#fff" : "#999",
                    },
                  ]}
                  value={escola}
                  onChangeText={setEscola}
                />

                <Text
                  style={[
                    styles.label,
                    { color: darkMode ? "#fff" : "#333" },
                  ]}
                >
                  PERÍODO
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      color: darkMode ? "#fff" : "#000",
                      borderBottomColor: darkMode ? "#fff" : "#999",
                    },
                  ]}
                  value={periodo}
                  onChangeText={setPeriodo}
                />
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={salvarAlteracoes}>
                <Text style={styles.saveButtonText}>SALVAR</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: { flex: 1 },
  header: {
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
  backButton: { position: "absolute", left: 23, bottom: 26 },
  avatarContainer: { alignItems: "center", marginTop: 30, marginBottom: 20 },
  avatarWrapper: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    marginBottom: 10,
  },
  editIcon: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#780b47",
    borderRadius: 20,
    padding: 8,
    borderWidth: 2,
    borderColor: "#fff",
  },
  nomeCrianca: { fontSize: 28, fontWeight: "bold" },
  idadeCrianca: { fontSize: 18 },
  inputContainer: {
    marginHorizontal: 25,
    marginTop: 20,
    borderRadius: 15,
    padding: 20,
  },
  label: {
    marginTop: 15,
    fontSize: 13,
    fontWeight: "bold",
  },
  input: {
    height: 45,
    borderBottomWidth: 1,
    fontSize: 16,
  },
  saveButton: {
    paddingVertical: 15,
    marginHorizontal: 130,
    borderRadius: 28,
    alignItems: "center",
    backgroundColor: "#780b47",
    marginTop: 30,
    marginBottom: 40,
  },
  saveButtonText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
});
