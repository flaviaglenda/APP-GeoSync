import React from "react";
import { View, Text, ScrollView, StyleSheet, Image, Dimensions } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../ThemeContext";

export default function ManualMochila() {
  const { darkMode } = useTheme();
  const { width } = Dimensions.get("screen");

  return (
    <View style={{ flex: 1, backgroundColor: darkMode ? "#000" : "#e9e9eb" }}>
      <LinearGradient
        colors={["#000000ff", "#780b47"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Text style={styles.headerText}>MANUAL MOCHILA</Text>
      </LinearGradient>

      <ScrollView
        style={[styles.container, { backgroundColor: darkMode ? "#000" : "#e9e9eb" }]}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={require("../src/assets/img_manual.png")}
          style={[styles.image, { width: width - 100 }]}
          resizeMode="cover"
        />

        <View style={styles.paragraph}>
          <Text style={[styles.paragraphText, { color: darkMode ? "#fff" : "#333" }]}>
            A mochila GeoSync foi criada para garantir a segurança de crianças,
            unindo tecnologia de rastreamento, sensores e conectividade. Ela permite que os
            responsáveis monitorem a localização em tempo real e acompanhem o trajeto completo
            através de um aplicativo intuitivo.
          </Text>
          <Text style={[styles.paragraphText, { color: darkMode ? "#fff" : "#333" }]}>
            Este app também conta com uma loja através do site para adquirir diferentes modelos de mochilas,
            tornando a experiência completa e prática.
          </Text>
        </View>

        <View style={[styles.card, {
          backgroundColor: darkMode ? "#1a1a1a" : "#f9f1f7",
          borderLeftColor: darkMode ? "#f61f7c" : "#96125B"
        }]}>
          <Text style={[styles.cardTitle, { color: darkMode ? "#f61f7c" : "#96125B" }]}>
            <FontAwesome5 name="plug" size={20} color={darkMode ? "#f61f7c" : "#96125B"} /> Como conectar?
          </Text>
          <Text style={[styles.cardText, { color: darkMode ? "#fff" : "#333" }]}>
            Para começar, siga estes passos simples:{'\n\n'}
            1. Certifique-se de que o Bluetooth ou Wi‑Fi do aparelho está ligado.{'\n'}
            2. Ligue a mochila inteligente.{'\n'}
            3. No app, toque em “Conectar Mochila”.{'\n'}
            4. Aguarde a confirmação de conexão — e pronto! A mochila já estará rastreando em tempo real.
          </Text>
        </View>

        <View style={styles.paragraph}>
          <Text style={[styles.paragraphTitle, { color: darkMode ? "#f61f7c" : "#96125B" }]}>
            <FontAwesome5 name="cogs" size={20} color={darkMode ? "#f61f7c" : "#96125B"} /> Funcionalidades
          </Text>
          <Text style={[styles.paragraphText, { color: darkMode ? "#fff" : "#333" }]}>
            - Rastreamento em tempo real.{'\n'}
            - Módulo Wi-Fi para envio de dados.{'\n'}
            - Alimentação por bateria portátil.{'\n'}
            - Botão de pânico para emergências.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
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
  image: {
    height: 280,
    borderRadius: 15,
    marginBottom: 10,
    alignSelf: "center",
    marginTop: -10,
    marginRight: -20,
  },
  paragraph: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  paragraphTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  paragraphText: {
    fontSize: 17,
    lineHeight: 26,
    textAlign: "justify",
    marginBottom: 15,
  },
  card: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "justify",
  },
});
