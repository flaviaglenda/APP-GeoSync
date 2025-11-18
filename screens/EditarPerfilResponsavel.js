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
  Alert,
  Image,
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../supabaseConfig";
import { useTheme } from "../ThemeContext";

export default function EditarResponsavel({ navigation }) {
  const { darkMode } = useTheme();
  const [user, setUser] = useState(null);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [fotoUrl, setFotoUrl] = useState(null);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    carregarUsuario();
  }, []);

  const carregarUsuario = async () => {
    const {
      data: { user: loggedUser },
      error,
    } = await supabase.auth.getUser();

    if (error || !loggedUser) {
      Alert.alert("Erro", "Não foi possível buscar usuário.");
      return;
    }

    setUser(loggedUser);

    // Verifica se já existe registro na tabela users
    const { data, error: selectError } = await supabase
      .from("users")
      .select("*")
      .eq("id", loggedUser.id)
      .single();

    if (selectError || !data) {
      // Cria registro se não existir
      await supabase.from("users").insert({
        id: loggedUser.id,
        nome: loggedUser.user_metadata?.full_name || "Sem Nome",
        email: loggedUser.email,
        tel: "",
        foto_url: "",
      });
      setNome(loggedUser.user_metadata?.full_name || "Sem Nome");
      setEmail(loggedUser.email);
      setTelefone("");
      setFotoUrl("");
    } else {
      setNome(data.nome || "Sem Nome");
      setEmail(data.email || loggedUser.email);
      setTelefone(data.tel || "");
      setFotoUrl(data.foto_url || "");
    }
  };

  const escolherFoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const image = result.assets[0];
      await enviarFoto(image);
    }
  };

  const enviarFoto = async (image) => {
    try {
      setCarregando(true);
      const ext = image.uri.split(".").pop();
      const fileName = `${Date.now()}.${ext}`;
      const filePath = `perfil/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("imagens")
        .upload(filePath, image.uri, { cacheControl: "3600", upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("imagens").getPublicUrl(filePath);
      setFotoUrl(data.publicUrl);
    } catch (err) {
      console.log(err);
      Alert.alert("Erro", "Não foi possível enviar a foto.");
    } finally {
      setCarregando(false);
    }
  };

  const salvarPerfil = async () => {
    if (!user) return;

    if (novaSenha && novaSenha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem!");
      return;
    }

    setCarregando(true);

    // Atualiza tabela users (upsert garante criar se não existir)
    const { error: upsertError } = await supabase
      .from("users")
      .upsert(
        {
          id: user.id,
          nome: nome || "Sem Nome",
          tel: telefone || "",
          foto_url: fotoUrl || "",
        },
        { onConflict: "id" }
      );

    // Atualiza Auth
    let authError = null;
    if (email !== user.email || novaSenha) {
      const { error } = await supabase.auth.updateUser({
        email: email !== user.email ? email : undefined,
        password: novaSenha || undefined,
      });
      authError = error;
    }

    setCarregando(false);

    if (upsertError || authError) {
      console.log(upsertError, authError);
      Alert.alert(
        "Erro",
        "Falha ao salvar alterações. Verifique políticas RLS e campos obrigatórios."
      );
    } else {
      Alert.alert("Sucesso", "Perfil atualizado!");
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: darkMode ? "#000" : "#e9e9eb" },
      ]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 20}
      >
        <View
          style={[
            styles.container,
            { backgroundColor: darkMode ? "#000" : "#e9e9eb" },
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
            <Text style={styles.headerText}>EDITAR PERFIL</Text>
          </LinearGradient>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.avatarContainer}>
              <TouchableOpacity onPress={escolherFoto}>
                <View
                  style={[
                    styles.avatarWrapper,
                    {
                      borderColor: "#780b47",
                      backgroundColor: darkMode ? "#1a1a1a" : "#fff",
                    },
                  ]}
                >
                  {fotoUrl ? (
                    <Image
                      source={{ uri: fotoUrl }}
                      style={{ width: 150, height: 150, borderRadius: 75 }}
                    />
                  ) : (
                    <Ionicons
                      name="person"
                      size={100}
                      color={darkMode ? "#fff" : "#000"}
                    />
                  )}
                  <View style={styles.editIcon}>
                    <FontAwesome name="pencil" size={18} color="#fff" />
                  </View>
                </View>
              </TouchableOpacity>

              <Text
                style={[
                  styles.nomeResponsavel,
                  { color: darkMode ? "#fff" : "#333" },
                ]}
              >
                {nome}
              </Text>
            </View>

            <View
              style={[
                styles.inputContainer,
                { backgroundColor: darkMode ? "#1a1a1a" : "#fff" },
              ]}
            >
              <Text style={[styles.label, { color: darkMode ? "#fff" : "#555" }]}>
                NOME
              </Text>
              <TextInput
                style={[styles.input, { color: darkMode ? "#fff" : "#333" }]}
                value={nome}
                onChangeText={setNome}
              />

              <Text style={[styles.label, { color: darkMode ? "#fff" : "#555" }]}>
                EMAIL
              </Text>
              <TextInput
                style={[styles.input, { color: darkMode ? "#fff" : "#333" }]}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />

              <Text style={[styles.label, { color: darkMode ? "#fff" : "#555" }]}>
                TELEFONE
              </Text>
              <TextInput
                style={[styles.input, { color: darkMode ? "#fff" : "#333" }]}
                value={telefone}
                onChangeText={setTelefone}
                keyboardType="phone-pad"
              />

              <Text style={[styles.label, { color: darkMode ? "#fff" : "#555" }]}>
                NOVA SENHA
              </Text>
              <TextInput
                style={[styles.input, { color: darkMode ? "#fff" : "#333" }]}
                value={novaSenha}
                onChangeText={setNovaSenha}
                secureTextEntry
              />

              <Text style={[styles.label, { color: darkMode ? "#fff" : "#555" }]}>
                CONFIRMAR SENHA
              </Text>
              <TextInput
                style={[styles.input, { color: darkMode ? "#fff" : "#333" }]}
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={salvarPerfil}
              disabled={carregando}
            >
              <Text style={styles.saveButtonText}>
                {carregando ? "SALVANDO..." : "SALVAR"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
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
  scrollContent: { paddingBottom: 50 },
  avatarContainer: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  avatarWrapper: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    marginBottom: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
  nomeResponsavel: { fontSize: 28, fontWeight: "bold", marginBottom: 5 },
  inputContainer: {
    marginHorizontal: 25,
    marginTop: 20,
    borderRadius: 15,
    padding: 20,
    elevation: 3,
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
    borderBottomWidth: 1,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#780b47",
    paddingVertical: 15,
    marginHorizontal: 120,
    borderRadius: 28,
    alignItems: "center",
    marginTop: 30,
    marginBottom: 40,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    textTransform: "uppercase",
  },
});
