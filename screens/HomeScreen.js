import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from "react-native";
import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.btnDetalhes}>
        <Ionicons name="add" size={18} color="#fff" />
        <Text style={styles.btnDetalhesText}>Ver localização detalhada</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Supervisão de atividades</Text>

      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, styles.tabAtivo]}>
          <Text style={styles.tabTextAtivo}>Todos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Semanal</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Mensal</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Anual</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mapContainer}>
        <Image source={require("../src/assets/mapa_visual.png")} style={styles.mapImage} />
      
      </View>

      <View style={styles.buttonsRow}>
        <TouchableOpacity style={styles.btnRoxo}>
          <Text style={styles.btnTitle}>Clique para ver</Text>
          <Text style={styles.btnMain}>Localização{"\n"}em tempo real</Text>
          <MaterialIcons name="arrow-forward-ios" size={16} color="#fff" style={styles.arrow} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnRoxo}>
          <Text style={styles.btnTitle}>Clique para ver</Text>
          <Text style={styles.btnMain}>Alarme{"\n"}de emergência</Text>
          <MaterialIcons name="arrow-forward-ios" size={16} color="#fff" style={styles.arrow} />
        </TouchableOpacity>
      </View>

      <Text style={styles.statusTitle}>Status</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Mochila GeoKid Pro - Lucas</Text>
        <View style={styles.row}>
          <FontAwesome5 name="wifi" size={16} color="#fff" />
          <Text style={styles.cardStatus}>Sem conexão.</Text>
          <Text style={styles.percent}>100%</Text>
          <Ionicons name="battery-full" size={16} color="#fff" />
        </View>
        <Text style={styles.updateText}>Última atualização há 1 hora.</Text>
        <MaterialIcons name="warning" size={24} color="#ff008c" style={styles.warningIcon} />
      </View>

      <View style={[styles.card, styles.cardConnected]}>
        <Text style={styles.cardTitle}>Mochila GeoGuard - Sabrina</Text>
        <View style={styles.row}>
          <FontAwesome5 name="wifi" size={16} color="#fff" />
          <Text style={styles.cardStatus}>Conectado</Text>
          <Text style={styles.percent}>100%</Text>
          <Ionicons name="battery-full" size={16} color="#fff" />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  btnDetalhes: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    borderRadius: 20,
    paddingVertical: 10,
    marginBottom: 20,
  },
  btnDetalhesText: {
    color: "#fff",
    fontSize: 14,
    marginLeft: 5,
    fontWeight: "600",
  },
  title: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 10,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#e8e8e8",
    borderRadius: 10,
    padding: 5,
    marginBottom: 15,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 6,
    borderRadius: 8,
  },
  tabAtivo: {
    backgroundColor: "#4b002f",
  },
  tabText: {
    fontSize: 12,
    color: "#000",
  },
  tabTextAtivo: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
  mapContainer: {
    position: "relative",
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 15,
  },
  mapImage: {
    width: "100%",
    height: 160,
    resizeMode: "cover",
  },
  percentText: {
    position: "absolute",
    bottom: 25,
    left: 15,
    fontSize: 28,
    color: "#000",
    fontWeight: "700",
  },
  addressText: {
    position: "absolute",
    bottom: 10,
    left: 15,
    fontSize: 12,
    color: "#555",
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  btnRoxo: {
    backgroundColor: "#4b002f",
    borderRadius: 10,
    width: "48%",
    padding: 10,
  },
  btnTitle: {
    color: "#fff",
    fontSize: 10,
    marginBottom: 4,
  },
  btnMain: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  arrow: {
    alignSelf: "flex-end",
    marginTop: 5,
  },
  statusTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#000",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  cardConnected: {
    marginTop: 10,
  },
  cardTitle: {
    color: "#fff",
    fontWeight: "700",
    marginBottom: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardStatus: {
    color: "#fff",
    fontSize: 13,
    flex: 1,
    marginLeft: 5,
  },
  percent: {
    color: "#fff",
    fontSize: 13,
    marginRight: 5,
  },
  updateText: {
    color: "#aaa",
    fontSize: 11,
    marginTop: 4,
  },
  warningIcon: {
    position: "absolute",
    top: 12,
    right: 10,
  },
});
