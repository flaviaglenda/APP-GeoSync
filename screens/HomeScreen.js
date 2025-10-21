import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from "react-native";
import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../ThemeContext";

export default function HomeScreen({ navigation }) {
  const { darkMode } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: darkMode ? "#000" : "#e9e9eb" }]}>
      <TouchableOpacity
        style={[styles.btnDetalhes, { backgroundColor: darkMode ? "#fff" : "#000" }]}
        onPress={() => navigation.navigate("Localização")}
      >
        <Ionicons
          name="location-outline"
          size={22}
          color={darkMode ? "#000" : "#f2efefff"}
          style={{ marginRight: 5 }}
        />
        <Text style={[styles.btnDetalhesText, { color: darkMode ? "#000" : "#fff" }]}>
          Ver localização detalhada
        </Text>
      </TouchableOpacity>

      <Text style={[styles.title, { color: darkMode ? "#fff" : "#000" }]}>
        Supervisão de atividades
      </Text>

      <View style={styles.mapContainer}>
        <Image
          source={require("../src/assets/mapa_visual.png")}
          style={styles.mapImage}
        />
      </View>

      <View style={styles.buttonsRow}>
        {darkMode ? (
          <TouchableOpacity
            style={[styles.btnRoxo, { backgroundColor: "#961f53ff" }]}
            onPress={() => navigation.navigate("Localização")}
          >
            <View style={styles.btnContent}>
              <Text style={styles.btnTitle}>Clique para ver</Text>
              <Text style={styles.btnMain}>Localização{"\n"}em tempo real</Text>
              <MaterialIcons name="arrow-forward-ios" size={20} color="#fff" style={styles.arrow} />
            </View>
          </TouchableOpacity>
        ) : (
          <LinearGradient
            colors={["#000000ff", "#6b093fff"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.btnRoxo}
          >
            <TouchableOpacity
              style={styles.btnContent}
              onPress={() => navigation.navigate("Localização")}
            >
              <Text style={styles.btnTitle}>Clique para ver</Text>
              <Text style={styles.btnMain}>Localização{"\n"}em tempo real</Text>
              <MaterialIcons name="arrow-forward-ios" size={20} color="#fff" style={styles.arrow} />
            </TouchableOpacity>
          </LinearGradient>
        )}

        {darkMode ? (
          <TouchableOpacity
            style={[styles.btnRoxo, { backgroundColor: "#961f53ff" }]}
            onPress={() => navigation.navigate("Notificações")}
          >
            <View style={styles.btnContent}>
              <Text style={styles.btnTitle}>Clique para ver</Text>
              <Text style={styles.btnMain}>Alarme{"\n"}de emergência</Text>
              <MaterialIcons name="arrow-forward-ios" size={20} color="#fff" style={styles.arrow} />
            </View>
          </TouchableOpacity>
        ) : (
          <LinearGradient
            colors={["#000000ff", "#6b093fff"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.btnRoxo}
          >
            <TouchableOpacity
              style={styles.btnContent}
              onPress={() => navigation.navigate("Notificações")}
            >
              <Text style={styles.btnTitle}>Clique para ver</Text>
              <Text style={styles.btnMain}>Alarme{"\n"}de emergência</Text>
              <MaterialIcons name="arrow-forward-ios" size={20} color="#fff" style={styles.arrow} />
            </TouchableOpacity>
          </LinearGradient>
        )}
      </View>

      <Text style={[styles.statusTitle, { color: darkMode ? "#ffffffff" : "#000" }]}>Status</Text>

      <View style={[styles.card, { backgroundColor: darkMode ? "#f2efefff" : "#000" }]}>
        <Text style={[styles.cardTitle, { color: darkMode ? "#000" : "#fff" }]}>
          Mochila GeoKid Pro - Lucas
        </Text>
        <View style={styles.row}>
          <FontAwesome5 name="wifi" size={28} color={darkMode ? "#000" : "#fff"} />
          <Text style={[styles.cardStatus, { color: darkMode ? "#000" : "#fff" }]}>Sem conexão.</Text>
          <Text style={[styles.percent, { color: darkMode ? "#000" : "#fff" }]}>100%</Text>
          <Ionicons name="battery-full" size={28} color={darkMode ? "#000" : "#fff"} />
        </View>
        <Text style={[styles.updateText, { color: darkMode ? "#333" : "#aaa" }]}>
          Última atualização há 1 hora.
        </Text>
        <MaterialIcons name="warning" size={30} color="#a90b50ff" style={styles.warningIcon} />

        <View style={styles.separator} />

        <Text style={[styles.cardTitle, { color: darkMode ? "#000" : "#fff" }]}>
          Mochila GeoGuard - Sabrina
        </Text>
        <View style={styles.row}>
          <FontAwesome5 name="wifi" size={28} color={darkMode ? "#000" : "#fff"} />
          <Text style={[styles.cardStatus, { color: darkMode ? "#000" : "#fff" }]}>Conectado</Text>
          <Text style={[styles.percent, { color: darkMode ? "#000" : "#fff" }]}>100%</Text>
          <Ionicons name="battery-full" size={28} color={darkMode ? "#000" : "#fff"} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40
  },
  btnDetalhes: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 28,
    paddingVertical: 10,
    marginBottom: 30
  },
  btnDetalhesText: {
    fontSize: 20,
    marginLeft: 5,
    fontWeight: "600"
  },
  title: {
    fontWeight: "700",
    fontSize: 23,
    marginBottom: 10
  },
  mapContainer: {
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 15
  },
  mapImage: {
    width: "100%",
    height: 230,
    resizeMode: "cover"
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30
  },
  btnRoxo: {
    borderRadius: 20,
    width: "48%",
    height: 150,
    marginTop: 15,
    overflow: "hidden",
    justifyContent: "center"
  },
  btnContent: {
    flex: 1,
    padding: 10,
    justifyContent: "space-between"
  },
  btnTitle: {
    color: "#fff",
    fontSize: 15,
    marginBottom: 10
  },
  btnMain: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "600"
  },
  arrow: {
    alignSelf: "flex-end",
    marginTop: 10
  },
  statusTitle: {
    fontSize: 23,
    fontWeight: "700",
    marginBottom: 10
  },
  card: {
    borderRadius: 29,
    padding: 15,
    marginBottom: 20,
    height: 260
  },
  cardTitle: {
    fontWeight: "700",
    marginBottom: 15,
    fontSize: 20
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10
  },
  cardStatus: {
    fontSize: 18,
    flex: 1,
    marginLeft: 5
  },
  percent: {
    fontSize: 18,
    marginRight: 5
  },
  updateText: {
    fontSize: 15,
    marginTop: 5
  },
  separator: {
    borderBottomColor: "#fff",
    borderBottomWidth: 1,
    opacity: 0.4,
    marginVertical: 10
  },
  warningIcon: {
    position: "absolute",
    bottom: 210,
    right: 10
  }
});
