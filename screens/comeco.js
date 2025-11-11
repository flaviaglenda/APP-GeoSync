import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";

export default function Comeco({ navigation }) {
  return (
    <LinearGradient colors={["#000000", "#780b47"]} style={styles.container}>
      <Image
        source={require("../src/assets/logo_geosync_fundotransparente.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>GeoSync</Text>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => navigation.navigate("RealizarCadastro")}
      >
        <Text style={styles.registerText}>Cadastrar</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 600,
    height: 600,
    marginBottom: -180,
    marginTop: -110,
  },
  title: {
    fontSize: 55,
    fontWeight: "bold",
    color: "#fff",
    marginTop: -100,
    marginBottom: 28,
  },
  loginButton: {
    backgroundColor: "#AE156B",
    paddingVertical: 12,
    paddingHorizontal: 53,
    borderRadius: 28,
    marginBottom: 15,
    marginTop: 100,
  },
  loginText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  registerButton: {
    borderWidth: 2,
    borderColor: "#AE156B",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 28,
    marginBottom: 15,
  },
  registerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});

