import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../ThemeContext";
import { supabase } from "../supabaseConfig";

export default function PerfilResponsavel({ navigation }) {
  const { darkMode, toggleTheme, theme } = useTheme();
  
  // Estado para armazenar os dados do usuário
  const [profile, setProfile] = useState({ nome: '', email: '', telefone: '', userId: '' });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 1. Função para buscar os dados do perfil
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Obter o usuário logado atualmente (do Auth)
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          // Buscar dados na tabela 'users' usando o ID do Auth
          const { data, error } = await supabase
            .from('users')
            .select('nome, email, telefone')
            .eq('id', user.id)
            .single();

          if (error) {
            throw error;
          }

          if (data) {
            setProfile({ 
              nome: data.nome || '', 
              email: data.email || '', 
              telefone: data.telefone || '', 
              userId: user.id 
            });
          }
        }
      } catch (error) {
        Alert.alert("Erro ao carregar perfil", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []); // Roda apenas uma vez ao montar

  // 2. Função para salvar as alterações (telefone e/ou senha)
  const handleSave = async () => {
    setSaving(true);
    let hasChanges = false;

    try {
      // A) ATUALIZAR TELEFONE NA TABELA 'users'
      if (profile.telefone !== profile.telefoneOriginal) { // Supomos que profile.telefoneOriginal é o valor inicial (poderia ser feito melhor)
        const { error: dbError } = await supabase
          .from('users')
          .update({ telefone: profile.telefone })
          .eq('id', profile.userId);
        
        if (dbError) throw dbError;
        hasChanges = true;
      }

      // B) ATUALIZAR SENHA NO AUTH
      if (newPassword) {
        if (newPassword !== confirmPassword) {
          Alert.alert("Erro", "As novas senhas não coincidem.");
          setSaving(false);
          return;
        }
        
        const { error: authError } = await supabase.auth.updateUser({
          password: newPassword 
        });

        if (authError) throw authError;
        hasChanges = true;

        // Limpa os campos de senha após o sucesso
        setNewPassword('');
        setConfirmPassword('');
      }

      if (hasChanges) {
        Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
      } else {
        Alert.alert("Informação", "Nenhuma alteração foi feita.");
      }

    } catch (error) {
      console.error("Erro ao salvar:", error);
      Alert.alert("Erro ao salvar", "Não foi possível atualizar o perfil. " + error.message);
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer, { backgroundColor: darkMode ? "#000" : theme.colors.background }]}>
        <ActivityIndicator size="large" color="#a90b50ff" />
        <Text style={{ color: darkMode ? "#fff" : "#000", marginTop: 10 }}>Carregando perfil...</Text>
      </View>
    );
  }


  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: darkMode ? "#000" : theme.colors.background }]}
    >
      <View style={[styles.container, { backgroundColor: darkMode ? "#000" : theme.colors.background }]}>
        <LinearGradient
          colors={["#000000", "#780b47"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}
        >
          <Text style={styles.headerText}>PERFIL RESPONSÁVEL</Text>
        </LinearGradient>

        <View style={styles.avatarContainer}>
          <View
            style={[
              styles.avatarWrapper,
              { borderColor: "#722044ff", backgroundColor: darkMode ? "#333" : "#eee" }, 
            ]}
          >
            <Ionicons
              name="person"
              size={126}
              color={darkMode ? "#fff" : "#722044ff"}
            />
          </View>
          <Text style={[styles.userName, { color: darkMode ? "#fff" : "#000" }]}>
            {profile.nome || 'Usuário'}
          </Text>
        </View>

        <View style={styles.cardsContainer}>
          
          {/* Card de Dados (Não Editáveis) */}
          <View style={[styles.dataCard, { backgroundColor: darkMode ? "#1a1a1a" : "#f0f0f0" }]}>
            <Text style={[styles.sectionTitle, { color: darkMode ? "#fff" : "#000" }]}>DADOS PESSOAIS</Text>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: darkMode ? "#d0d0d0" : "#555" }]}>E-mail (Não Editável)</Text>
              <TextInput
                style={[styles.input, { color: darkMode ? "#fff" : "#000", borderColor: darkMode ? "#555" : "#ccc" }]}
                value={profile.email}
                editable={false} // E-mail não pode ser editado
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: darkMode ? "#d0d0d0" : "#555" }]}>Telefone (Editável)</Text>
              <TextInput
                style={[styles.input, { color: darkMode ? "#fff" : "#000", borderColor: darkMode ? "#555" : "#ccc" }]}
                value={profile.telefone}
                onChangeText={(text) => setProfile({ ...profile, telefone: text })}
                keyboardType="phone-pad"
                placeholder="Telefone"
                placeholderTextColor={darkMode ? "#777" : "#aaa"}
              />
            </View>

          </View>
          
          {/* Card de Segurança (Alterar Senha) */}
          <View style={[styles.dataCard, { backgroundColor: darkMode ? "#1a1a1a" : "#f0f0f0" }]}>
            <Text style={[styles.sectionTitle, { color: darkMode ? "#fff" : "#000" }]}>SEGURANÇA</Text>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: darkMode ? "#d0d0d0" : "#555" }]}>Nova Senha</Text>
              <TextInput
                style={[styles.input, { color: darkMode ? "#fff" : "#000", borderColor: darkMode ? "#555" : "#ccc" }]}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                placeholder="Deixe vazio para não alterar"
                placeholderTextColor={darkMode ? "#777" : "#aaa"}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: darkMode ? "#d0d0d0" : "#555" }]}>Confirmar Senha</Text>
              <TextInput
                style={[styles.input, { color: darkMode ? "#fff" : "#000", borderColor: darkMode ? "#555" : "#ccc" }]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholder="Confirme a nova senha"
                placeholderTextColor={darkMode ? "#777" : "#aaa"}
              />
            </View>

          </View>

          {/* Botão Salvar */}
          <TouchableOpacity 
            style={[styles.saveButton, saving ? { opacity: 0.7 } : null]} 
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={styles.saveButtonText}>
              {saving ? "SALVANDO..." : "SALVAR ALTERAÇÕES"}
            </Text>
          </TouchableOpacity>

          {/* Opções Adicionais */}
          <View style={[styles.optionCard, { backgroundColor: "#5f0738" }]}> 
            <Ionicons name="moon" size={28} color="#fff" />
            <Text style={[styles.optionText, { color: "#fff" }]}>Modo escuro</Text>
            <Switch
              value={darkMode}
              onValueChange={toggleTheme} 
              trackColor={{ false: "#e5e2e2", true: "#9e9c9c" }}
              thumbColor={darkMode ? "#f9f4f6ff" : "#f4f3f4"} 
              ios_backgroundColor="#3e3e3e"
              style={styles.switchToggle}
            />
          </View>

          <TouchableOpacity
            style={[styles.optionCard, { backgroundColor: "#5f0738" }]}
            onPress={() => navigation.navigate("GerenciarCrianca")}
          >
            <Ionicons name="happy" size={28} color="#fff" />
            <Text style={[styles.optionText, { color: "#fff" }]}>Gerenciar criança</Text>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={24}
              color="#d0d0d0"
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
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
  avatarContainer: {
    alignItems: "center",
    marginVertical: 20,
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
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
  },
  cardsContainer: {
    marginTop: 14,
    paddingHorizontal: 20,
  },
  dataCard: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#722044ff',
    paddingBottom: 5,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#a90b50ff",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    marginVertical: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginBottom: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  optionText: {
    marginLeft: 15,
    fontSize: 18,
    flex: 1,
  },
  switchToggle: {
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
  },
  arrowIcon: {
    marginLeft: 10,
  },
});