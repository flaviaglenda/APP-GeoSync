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
  const { darkMode, theme } = useTheme();
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

  // BUSCAR PERFIL
  const carregarUsuario = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      Alert.alert("Erro", "Não foi possível buscar usuário.");
      return;
    }

    const loggedUser = data.user;
    setUser(loggedUser);

    const { data: perfil } = await supabase
      .from("users")
      .select("*")
      .eq("id", loggedUser.id)
      .single();

    if (!perfil) return;

    setNome(perfil.nome);
    setEmail(perfil.email);
    setTelefone(perfil.tel);
    setFotoUrl(perfil.foto_url);
  };

  // SELECIONAR FOTO
  const escolherFoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (result.canceled) return;

    const asset = result.assets[0];

    setFotoUrl(asset.uri);
    await enviarFoto(asset);
  };

  // UPLOAD FOTO
  const enviarFoto = async (image) => {
    try {
      setCarregando(true);

      const response = await fetch(image.uri);
      const blob = await response.blob();

      const fileName = `responsaveis/${user.id}_${Date.now()}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from("fotos")
        .upload(fileName, blob, {
          upsert: true,
          contentType: "image/jpeg",
        });

      if (uploadError) {
        console.log(uploadError);
        Alert.alert("Erro", "Não foi possível enviar a foto.");
        return;
      }

      const { data } = supabase.storage
        .from("fotos")
        .getPublicUrl(fileName);

      setFotoUrl(data.publicUrl);
    } catch (err) {
      console.log(err);
    } finally {
      setCarregando(false);
    }
  };

  // SALVAR PERFIL
  const salvarPerfil = async () => {
    if (!user) return;

    if (novaSenha && novaSenha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem!");
      return;
    }

    setCarregando(true);

    const { error: upsertError } = await supabase
      .from("users")
      .update({
        nome,
        email,
        tel: telefone,
        foto_url: fotoUrl,
      })
      .eq("id", user.id);

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
      Alert.alert("Erro", "Falha ao salvar alterações.");
    } else {
      Alert.alert("Sucesso", "Perfil atualizado!");
      navigation.goBack();
    }
  };

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
            <Text style={styles.headerText}>EDITAR PERFIL</Text>
          </LinearGradient>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.avatarContainer}>
              <TouchableOpacity onPress={escolherFoto}>
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
                      size={100}
                      color={darkMode ? "#fff" : "#192230"}
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
                { backgroundColor: darkMode ? "#131b28ff" : "#fff" },
              ]}
            >
              {/* NOME */}
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
                    borderBottomColor: darkMode ? "#ccc" : "#999",
                  },
                ]}
                value={nome}
                onChangeText={setNome}
              />

              {/* EMAIL */}
              <Text
                style={[
                  styles.label,
                  { color: darkMode ? "#fff" : "#333" },
                ]}
              >
                EMAIL
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: darkMode ? "#fff" : "#000",
                    borderBottomColor: darkMode ? "#ccc" : "#999",
                  },
                ]}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />

              {/* TELEFONE */}
              <Text
                style={[
                  styles.label,
                  { color: darkMode ? "#fff" : "#333" },
                ]}
              >
                TELEFONE
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: darkMode ? "#fff" : "#000",
                    borderBottomColor: darkMode ? "#ccc" : "#999",
                  },
                ]}
                value={telefone}
                onChangeText={setTelefone}
                keyboardType="phone-pad"
              />

              {/* SENHA */}
              <Text
                style={[
                  styles.label,
                  { color: darkMode ? "#fff" : "#333" },
                ]}
              >
                NOVA SENHA
              </Text>
              <TextInput
                secureTextEntry
                style={[
                  styles.input,
                  {
                    color: darkMode ? "#fff" : "#000",
                    borderBottomColor: darkMode ? "#ccc" : "#999",
                  },
                ]}
                value={novaSenha}
                onChangeText={setNovaSenha}
              />

              <Text
                style={[
                  styles.label,
                  { color: darkMode ? "#fff" : "#333" },
                ]}
              >
                CONFIRMAR SENHA
              </Text>
              <TextInput
                secureTextEntry
                style={[
                  styles.input,
                  {
                    color: darkMode ? "#fff" : "#000",
                    borderBottomColor: darkMode ? "#ccc" : "#999",
                  },
                ]}
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
              />
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={salvarPerfil}
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

  nomeResponsavel: { fontSize: 28, fontWeight: "bold" },

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
  },
});
