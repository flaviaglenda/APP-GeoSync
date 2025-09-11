import React, { useState } from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function PerfilScreen() {
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
        <Ionicons name="person-circle-outline" size={100} color="black" />
      </View>

    
      <Text style={styles.sectionTitle}>INFORMAÇÕES GERAIS</Text>

      
      <TouchableOpacity style={styles.option}>
        <MaterialIcons name="edit" size={24} color="black" />
        <Text style={styles.optionText}>Editar perfil.</Text>
      </TouchableOpacity>

    
      <View style={styles.option}>
        <Ionicons name="moon-outline" size={24} color="black" />
        <Switch value={darkMode} onValueChange={setDarkMode} />
        <Text style={styles.optionText}>Modo escuro.</Text>
      </View>

      
      <TouchableOpacity style={styles.option}>
        <Ionicons name="happy-outline" size={24} color="black" />
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
    height: 80,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 10,
    width: "100%",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  avatarContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 20,
    marginBottom: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    marginLeft: 20,
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
  },
});