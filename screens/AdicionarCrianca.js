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
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../ThemeContext";

export default function AdicionarCrianca({ navigation }) {
  const { darkMode } = useTheme();
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [escola, setEscola] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [sensorId, setSensorId] = useState("");

  const handleAdicionar = () => {
    console.log({ nome, dataNascimento, escola, periodo, sensorId });
  };

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
            onPress={() => navigation.goBack()}
          >
            <FontAwesome name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerText}>ADICIONAR CRIANÇA</Text>
        </LinearGradient>

        <ScrollView
          contentContainerStyle={styles.formContainer}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity style={styles.fotoContainer}>
            <View
              style={[
                styles.avatarWrapper,
                { borderColor: darkMode ? "#780b47" : "#780b47", backgroundColor: darkMode ? "#1a1a1a" : "#fff" },
              ]}
            >
              <Ionicons
                name="person"
                size={130}
                color={darkMode ? "#fff" : "#000000ff"}
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

          <Text style={[styles.label, { color: darkMode ? "#ffffffff" : "#555" }]}>
            NOME
          </Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: darkMode ? "#1a1a1a" : "#fff", color: darkMode ? "#fff" : "#333", borderColor: darkMode ? "#555" : "#ccc" },
            ]}
            placeholder="Digite o nome"
            placeholderTextColor={darkMode ? "#888" : "#888"}
            value={nome}
            onChangeText={setNome}
          />

          <Text style={[styles.label, { color: darkMode ? "#ffffffff" : "#555" }]}>
            DATA DE NASCIMENTO
          </Text>
          <View
            style={[
              styles.inputIcon,
              { backgroundColor: darkMode ? "#1a1a1a" : "#fff", borderColor: darkMode ? "#555" : "#ccc" },
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
            />
          </View>

          <Text style={[styles.label, { color: darkMode ? "#ffffffff" : "#555" }]}>
            ESCOLA
          </Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: darkMode ? "#1a1a1a" : "#fff", color: darkMode ? "#fff" : "#333", borderColor: darkMode ? "#555" : "#ccc" },
            ]}
            placeholder="Digite a escola"
            placeholderTextColor={darkMode ? "#888" : "#888"}
            value={escola}
            onChangeText={setEscola}
          />

          <Text style={[styles.label, { color: darkMode ? "#ffffffff" : "#555" }]}>
            PERÍODO ESCOLAR
          </Text>
          <View
            style={[
              styles.inputIcon,
              { backgroundColor: darkMode ? "#1a1a1a" : "#fff", borderColor: darkMode ? "#555" : "#ccc" },
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
            />
          </View>

          <Text style={[styles.label, { color: darkMode ? "#ffffffff" : "#555" }]}>
            CONECTAR MOCHILA
          </Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: darkMode ? "#1a1a1a" : "#fff", color: darkMode ? "#fff" : "#333", borderColor: darkMode ? "#555" : "#ccc" },
            ]}
            placeholder="Insira o ID do sensor"
            placeholderTextColor={darkMode ? "#888" : "#888"}
            value={sensorId}
            onChangeText={setSensorId}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              handleAdicionar();
              navigation.navigate("GerenciarCrianca");
            }}
          >
            <LinearGradient
              colors={darkMode ? ["#75153fff", "#75153fff"] : ["#780b47", "#64063aff"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradient}
            >
              <Text style={styles.buttonText}>ADICIONAR</Text>
            </LinearGradient>
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 1.41,
  },
  inputIcon: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 1.41,
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
});
