
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function PerfilResponsavel({ navigation }) {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <LinearGradient
          colors={["#000000", "#780b47"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}
        >
          <Text style={styles.headerText}>PERFIL RESPONSÁVEL</Text>
        </LinearGradient>

        <View style={styles.avatarContainer}>
          <View style={styles.avatarWrapper}>
            <Ionicons name="person" size={126} color="#000000ff" />
          </View>
        </View>

        <Text style={styles.sectionTitle}>INFORMAÇÕES GERAIS</Text>

        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => navigation.navigate("EditarResponsavel")}
        >
          <MaterialIcons name="edit" size={28} color="#ffffffff" />
          <Text style={styles.optionText}>Editar perfil</Text>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="#d0d0d0ff" style={styles.arrowIcon} />
        </TouchableOpacity>

        <View style={styles.optionCard}>
          <Ionicons name="moon" size={28} color="#ffffffff" />
          <Text style={styles.optionText}>Modo escuro</Text>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: "#e5e2e2ff", true: "#9e9c9cff" }}
            thumbColor={darkMode ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            style={styles.switchToggle}
          />
        </View>

        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => navigation.navigate("GerenciarCrianca")}
        >
          <Ionicons name="happy" size={28} color="#ffffffff" />
          <Text style={styles.optionText}>Gerenciar criança</Text>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="#d0d0d0ff" style={styles.arrowIcon} />
        </TouchableOpacity>
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
  avatarContainer: {
    alignItems: "center",
    marginVertical: 30,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333ff",
    marginLeft: 20,
    marginBottom: 15,
    marginTop: 10,
    textTransform: "uppercase",
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#5b133aff",
    marginHorizontal: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
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
    color: "#ffffffff",
    flex: 1, 
  },
  switchToggle: {
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }], 
  },
  arrowIcon: {
    marginLeft: 10,
  },
});

