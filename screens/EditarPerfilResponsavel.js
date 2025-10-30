import React, { useState } from "react";
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
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../ThemeContext";

export default function EditarResponsavel({ navigation }) {
  const { darkMode } = useTheme();
  const [email, setEmail] = useState("miguel@gmail.com");
  const [telefone, setTelefone] = useState("+55 12 99684-3436");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

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
              <View
                style={[
                  styles.avatarWrapper,
                  {
                    borderColor: "#780b47",
                    backgroundColor: darkMode ? "#1a1a1a" : "#fff",
                  },
                ]}
              >
                <Ionicons
                  name="person"
                  size={100}
                  color={darkMode ? "#fff" : "#000000ff"}
                />
                <TouchableOpacity style={styles.editIcon}>
                  <FontAwesome name="pencil" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
              <Text
                style={[
                  styles.nomeResponsavel,
                  { color: darkMode ? "#fff" : "#333" },
                ]}
              >
                Miguel
              </Text>
            </View>

            <View
              style={[
                styles.inputContainer,
                { backgroundColor: darkMode ? "#1a1a1a" : "#fff" },
              ]}
            >
              <Text
                style={[styles.label, { color: darkMode ? "#fff" : "#555" }]}
              >
                EMAIL
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: darkMode ? "#fff" : "#333",
                    borderBottomColor: darkMode ? "#555" : "#929292ff",
                  },
                ]}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                placeholder="Seu email"
                placeholderTextColor={darkMode ? "#888" : "#888"}
              />

              <Text
                style={[styles.label, { color: darkMode ? "#fff" : "#555" }]}
              >
                TELEFONE
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: darkMode ? "#fff" : "#333",
                    borderBottomColor: darkMode ? "#555" : "#929292ff",
                  },
                ]}
                value={telefone}
                onChangeText={setTelefone}
                keyboardType="phone-pad"
                placeholder="Seu telefone"
                placeholderTextColor={darkMode ? "#888" : "#888"}
              />

              <Text
                style={[styles.label, { color: darkMode ? "#fff" : "#555" }]}
              >
                NOVA SENHA
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: darkMode ? "#fff" : "#333",
                    borderBottomColor: darkMode ? "#555" : "#929292ff",
                  },
                ]}
                value={novaSenha}
                onChangeText={setNovaSenha}
                secureTextEntry
                placeholder="Digite sua nova senha"
                placeholderTextColor={darkMode ? "#888" : "#888"}
              />

              <Text
                style={[styles.label, { color: darkMode ? "#fff" : "#555" }]}
              >
                CONFIRMAR NOVA SENHA
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: darkMode ? "#fff" : "#333",
                    borderBottomColor: darkMode ? "#555" : "#929292ff",
                  },
                ]}
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
                secureTextEntry
                placeholder="Confirme sua nova senha"
                placeholderTextColor={darkMode ? "#888" : "#888"}
              />
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.saveButtonText}>SALVAR</Text>
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
  backButton: {
    position: "absolute",
    left: 23,
    bottom: 26,
  },
  scrollContent: {
    paddingBottom: 50,
  },
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
  nomeResponsavel: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
  },
  inputContainer: {
    marginHorizontal: 25,
    marginTop: 20,
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
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
    borderRadius: 0,
    paddingHorizontal: 0,
    backgroundColor: "transparent",
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
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    textTransform: "uppercase",
  },
});
