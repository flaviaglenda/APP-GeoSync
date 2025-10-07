import React from "react";
import { View, Text, ScrollView, StyleSheet, Image, Dimensions } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function ManualMochila() {
  const { width } = Dimensions.get("screen");

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={["#000000ff", "#780b47"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Text style={styles.headerText}>MANUAL MOCHILA</Text>
      </LinearGradient>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        <Image
          source={require("../src/assets/img_manual.png")}
          style={[styles.image, { width: width - 120 }]}
          resizeMode="cover"
        />

        <View style={styles.paragraph}>
          <Text style={styles.paragraphText}>
            A mochila GeoSync foi criada para garantir a segurança de crianças,
            unindo tecnologia de rastreamento, sensores e conectividade. Ela permite que os
            responsáveis monitorem a localização em tempo real e acompanhem o trajeto completo
            através de um aplicativo intuitivo.
          </Text>
          <Text style={styles.paragraphText}>
            Este app também conta com uma loja através do site para adquirir diferentes modelos de mochilas,
            tornando a experiência completa e prática.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            <FontAwesome5 name="plug" size={20} color="#96125B" /> Como conectar?
          </Text>
          <Text style={styles.cardText}>
              Para começar, siga estes passos simples:{'\n\n'}
            1. Certifique-se de que o Bluetooth ou Wi‑Fi do aparelho está ligado.{'\n'}
            2. Ligue a mochila inteligente.{'\n'}
            3. No app, toque em “Conectar Mochila”.{'\n'}
            4. Aguarde a confirmação de conexão — e pronto! A mochila já estará rastreando em tempo real.
          </Text>
        </View>

        <View style={styles.paragraph}>
          <Text style={styles.paragraphTitle}>
            <FontAwesome5 name="cogs" size={20} color="#96125B" /> Funcionalidades
          </Text>
          <Text style={styles.paragraphText}>
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
    backgroundColor: "#e9e9ebff",
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
    height: 340,
    borderRadius: 15,
    marginBottom: 10,
    alignSelf: "center",
    marginTop: -30,
  },
  paragraph: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  paragraphTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#96125B",
    marginBottom: 10,
  },
  paragraphText: {
    fontSize: 17,
    color: "#333",
    lineHeight: 26,
    textAlign: "justify",
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#f9f1f7",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 6,
    borderLeftColor: "#96125B",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#96125B",
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    textAlign: "justify",
  },
});
