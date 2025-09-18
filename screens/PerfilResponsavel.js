import React, { useState } from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function PerfilResponsavel({ navigation }) { 
  const [darkMode, setDarkMode] = useState(false);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#000000ff", "#780b47"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Text style={styles.headerText}>PERFIL</Text>
      </LinearGradient>

      <View style={styles.avatarContainer}>
        <Ionicons name="person" size={130} color="black" />
      </View>

      <Text style={styles.sectionTitle}>INFORMAÇÕES GERAIS</Text>

      {/* Navegar para EditarResponsavel */}
      <TouchableOpacity
        style={styles.option}
        onPress={() => navigation.navigate("EditarResponsavel")}
      >
        <MaterialIcons name="edit" size={35} color="black" />
        <Text style={styles.optionText}>Editar perfil.</Text>
      </TouchableOpacity>

      <View style={styles.option}>
        <Ionicons name="moon-outline" size={35} color="black" />
        <Switch value={darkMode} onValueChange={setDarkMode} />
        <Text style={styles.optionText}>Modo escuro.</Text>
      </View>

      <TouchableOpacity
        style={styles.option}
        onPress={() => navigation.navigate("Main")}
      >
        <Ionicons name="happy-outline" size={35} color="black" />
        <Text style={styles.optionText}>Gerenciar criança.</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  sectionTitle: {
    fontSize: 24,
    fontWeight: "regular",
    marginLeft: 20,
    marginBottom: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginVertical: 10,
    marginLeft: 20,
  },
  optionText: {
    marginLeft: 20,
    fontSize: 20,
    fontWeight: "100",
  },
});
