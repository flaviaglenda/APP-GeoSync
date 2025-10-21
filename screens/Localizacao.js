import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useTheme } from "../ThemeContext";

export default function MapScreen() {
  const { darkMode } = useTheme();

  const region = {
    latitude: -23.099,
    longitude: -45.707,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? "#000" : "#fff" }]}>
      {/* mapa */}
      <MapView style={styles.map} initialRegion={region}>
        <Marker
          coordinate={{ latitude: -23.099, longitude: -45.707 }}
          title="Lucas"
          description="Está aqui há 2h26min"
        />
        <Marker
          coordinate={{ latitude: -23.09, longitude: -45.72 }}
          title="SESI-Caçapava"
          description="2 km de distância"
        />
      </MapView>

      {/* painel informações */}
      <View
        style={[
          styles.infoContainer,
          { backgroundColor: darkMode ? "#1a1a1a" : "#fff" },
        ]}
      >
        <Text style={[styles.nome, { color: darkMode ? "#f61f7c" : "#c2185b" }]}>Lucas</Text>
        <Text style={[styles.subtitulo, { color: darkMode ? "#ccc" : "#555" }]}>
          SESI-Caçapava
        </Text>
        <Text style={[styles.distancia, { color: darkMode ? "#aaa" : "#777" }]}>
          2 km de distância
        </Text>

        <View style={styles.statusContainer}>
          <Text style={[styles.statusTitle, { color: darkMode ? "#fff" : "#000" }]}>
            Status
          </Text>
          <View
            style={[
              styles.statusBox,
              { backgroundColor: darkMode ? "#2a2a2a" : "#000" },
            ]}
          >
            <Text style={[styles.mocha, { color: darkMode ? "#fff" : "#fff" }]}>
              Mochila GeoKid Pro - Lucas
            </Text>
            <View style={styles.statusRow}>
              <MaterialIcons
                name="wifi-off"
                size={20}
                color={darkMode ? "#fff" : "#fff"}
              />
              <Text style={[styles.semConexao, { color: darkMode ? "#fff" : "#fff" }]}>
                {" "}Sem conexão.
              </Text>
              <Text style={[styles.bateria, { color: darkMode ? "#ffffffff" : "#fff" }]}>
                {" "}100%
              </Text>
            </View>
            <Text style={[styles.atualizacao, { color: darkMode ? "#bbb" : "#bbb" }]}>
              Última atualização há 1 hora.
            </Text>
            <Ionicons
              name="warning-outline"
              size={32}
              color="#ff0099"
              style={styles.iconAlerta}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.botaoHistorico,
            { backgroundColor: darkMode ? "#780b47" : "#000" },
          ]}
        >
          <Ionicons name="time-outline" size={20} color="#fff" />
          <Text style={styles.textoBotao}>Histórico de localização</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    flex: 1
  },
  infoContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  nome: {
    fontWeight: "bold",
    fontSize: 20
  },
  subtitulo: {
    marginTop: 2
  },
  distancia: {
    marginBottom: 10
  },
  statusContainer: {
    marginTop: 10
  },
  statusTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5
  },
  statusBox: {
    borderRadius: 10,
    padding: 15,
    position: "relative",
  },
  mocha: {
    fontWeight: "bold",
    marginBottom: 5
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5
  },
  semConexao: {
    fontSize: 14
  },
  bateria: {
    marginLeft: "auto",
    fontWeight: "bold"
  },
  atualizacao: {
    fontSize: 12
  },
  iconAlerta: {
    position: "absolute",
    bottom: 10,
    right: 10
  },
  botaoHistorico: {
    flexDirection: "row",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    marginTop: 15,
  },
  textoBotao: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 5
  },
});
