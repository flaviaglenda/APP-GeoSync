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
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../ThemeContext";

export default function PerfilCrianca({ navigation }) {
  const { darkMode } = useTheme();
  const [escola, setEscola] = useState("SESI CAÇAPAVA");
  const [turma, setTurma] = useState("3° Ano fundamental");
  const [periodo, setPeriodo] = useState("07:00 - 15:30h");

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: darkMode ? "#000" : "#e9e9eb" },
      ]}
    >
      <View
        style={[styles.container, { backgroundColor: darkMode ? "#000" : "#e9e9eb" }]}
      >
        <LinearGradient
          colors={["#000000", "#780b47"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate("GerenciarCrianca")}
          >
            <FontAwesome name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerText}>PERFIL CRIANÇA</Text>
        </LinearGradient>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.avatarContainer}>
            <View
              style={[
                styles.avatarWrapper,
                { borderColor: darkMode ? "#881052ff" : "#780b47" },
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
            <Text style={[styles.nomeCrianca, { color: darkMode ? "#fff" : "#333" }]}>
              Lucas
            </Text>
            <Text style={[styles.idadeCrianca, { color: darkMode ? "#ccc" : "#666" }]}>
              7 anos
            </Text>
          </View>

          <View
            style={[
              styles.inputContainer,
              { backgroundColor: darkMode ? "#1a1a1a" : "#fff" },
            ]}
          >
            <Text style={[styles.label, { color: darkMode ? "#ffffffff" : "#555" }]}>
              ESCOLA
            </Text>
            <TextInput
              style={[styles.input, { color: darkMode ? "#fff" : "#333", borderBottomColor: darkMode ? "#555" : "#929292ff" }]}
              value={escola}
              onChangeText={setEscola}
              placeholder="Nome da Escola"
              placeholderTextColor={darkMode ? "#888" : "#888"}
            />

            <Text style={[styles.label, { color: darkMode ? "#ffffffff" : "#555" }]}>
              TURMA
            </Text>
            <TextInput
              style={[styles.input, { color: darkMode ? "#fff" : "#333", borderBottomColor: darkMode ? "#555" : "#929292ff" }]}
              value={turma}
              onChangeText={setTurma}
              placeholder="Turma"
              placeholderTextColor={darkMode ? "#888" : "#888"}
            />

            <Text style={[styles.label, { color: darkMode ? "#ffffffff" : "#555" }]}>
              PERÍODO ESCOLAR
            </Text>
            <TextInput
              style={[styles.input, { color: darkMode ? "#fff" : "#333", borderBottomColor: darkMode ? "#555" : "#929292ff" }]}
              value={periodo}
              onChangeText={setPeriodo}
              placeholder="Período"
              placeholderTextColor={darkMode ? "#888" : "#888"}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.saveButton,
              { backgroundColor: darkMode ? "#780b47" : "#780b47" },
            ]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.saveButtonText}>SALVAR</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
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
    paddingBottom: 30,
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
  nomeCrianca: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
  },
  idadeCrianca: {
    fontSize: 18,
    fontWeight: "normal",
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
    paddingVertical: 15,
    marginHorizontal: 130,
    borderRadius: 28,
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
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
