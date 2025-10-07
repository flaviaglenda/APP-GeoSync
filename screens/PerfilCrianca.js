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

export default function PerfilCrianca({ navigation }) {
  const [escola, setEscola] = useState("SESI CAÇAPAVA");
  const [turma, setTurma] = useState("3° Ano fundamental");
  const [periodo, setPeriodo] = useState("07:00 - 15:30h");

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
            <FontAwesome name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerText}>PERFIL CRIANÇA</Text>
        </LinearGradient>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.avatarContainer}>
            <View style={styles.avatarWrapper}>
              <Ionicons name="person" size={100} color="#000000ff" />
              <TouchableOpacity style={styles.editIcon}>
                <FontAwesome name="pencil" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.nomeCrianca}>Lucas</Text>
            <Text style={styles.idadeCrianca}>7 anos</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>ESCOLA</Text>
            <TextInput
              style={styles.input}
              value={escola}
              onChangeText={setEscola}
              placeholder="Nome da Escola"
              placeholderTextColor="#888"
            />
            <Text style={styles.label}>TURMA</Text>
            <TextInput
              style={styles.input}
              value={turma}
              onChangeText={setTurma}
              placeholder="Turma"
              placeholderTextColor="#888"
            />
            <Text style={styles.label}>PERÍODO</Text>
            <TextInput
              style={styles.input}
              value={periodo}
              onChangeText={setPeriodo}
              placeholder="Período"
              placeholderTextColor="#888"
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: "#e9e9ebff",
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
    borderColor: "#780b47",
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
    color: "#333",
    fontWeight: "bold",
    marginBottom: 5,
  },
  idadeCrianca: {
    fontSize: 18,
    color: "#666",
    fontWeight: "normal",
  },
  inputContainer: {
    marginHorizontal: 25,
    marginTop: 20,
    backgroundColor: "#fff",
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
    color: "#555",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  input: {
     height: 45,
    borderBottomWidth: 1, 
    borderBottomColor: "#929292ff", 
    borderRadius: 0, 
    paddingHorizontal: 0, 
    backgroundColor: "transparent", 
    color: "#333",
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#780b47",
    paddingVertical: 15,
    marginHorizontal: 130,
    borderRadius: 15,
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
