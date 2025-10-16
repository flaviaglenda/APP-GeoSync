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
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";

export default function App({ navigation }) {
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [escola, setEscola] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [sensorId, setSensorId] = useState("");

  const handleAdicionar = () => {
    console.log({ nome, dataNascimento, escola, periodo, sensorId });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
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
            <FontAwesome name="arrow-left" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerText}>ADICIONAR CRIANÇA</Text>
        </LinearGradient>

        <ScrollView contentContainerStyle={styles.formContainer}>
          <TouchableOpacity style={styles.fotoContainer}>
            <View style={styles.avatarWrapper}>
              <Ionicons name="person" size={130} color="#000000ff" />
            </View>
            <Text style={styles.fotoText}>Alterar foto</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o nome"
            value={nome}
            onChangeText={setNome}
          />

          <Text style={styles.label}>Data de nascimento</Text>
          <View style={styles.inputIcon}>
            <Ionicons name="calendar-outline" size={24} color="#780b47" />
            <TextInput
              style={[styles.input, { flex: 1, marginLeft: 8 }]}
              placeholder="DD/MM/AAAA"
              value={dataNascimento}
              onChangeText={setDataNascimento}
            />
          </View>

          <Text style={styles.label}>Escola</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite a escola"
            value={escola}
            onChangeText={setEscola}
          />

          <Text style={styles.label}>Período</Text>
          <View style={styles.inputIcon}>
            <Ionicons name="time-outline" size={24} color="#780b47" />
            <TextInput
              style={[styles.input, { flex: 1, marginLeft: 8 }]}
              placeholder="Ex: 07h-16:30h"
              value={periodo}
              onChangeText={setPeriodo}
            />
          </View>

          <Text style={styles.label}>Conectar mochila</Text>
          <TextInput
            style={styles.input}
            placeholder="Insira o ID do sensor"
            value={sensorId}
            onChangeText={setSensorId}
          />

          <TouchableOpacity onPress={handleAdicionar} style={styles.button}>
            <LinearGradient
              colors={["#5f0738", "#f61f7c"]}
              style={styles.gradient}
            >
              <Text style={styles.buttonText}>Adicionar</Text>
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
    backgroundColor: "#e9e9ebff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
  },
  header: {
    height: 85,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingBottom: 12,
    paddingHorizontal: 15,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "500",
    color: "#fff",
  },
  backButton: {
    position: "absolute",
    left: 20,
    bottom: 20,
  },
  avatarWrapper: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#780b47",
    backgroundColor: "#fff",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  formContainer: {
    padding: 20,
  },
  fotoContainer: {
    alignItems: "center",
    marginBottom: 25,
  },
  fotoText: {
    marginTop: 10,
    fontSize: 16,
    color: "#780b47",
    fontWeight: "500",
  },
  label: {
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 6,
    marginTop: 15,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 8,
    fontSize: 18,
  },
  inputIcon: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 5,
  },
  button: {
    marginTop: 35,
    borderRadius: 18,
    overflow: "hidden",
    alignSelf: "center",
    width: 220,
  },
  gradient: {
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: 18,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 18,
  },
});
