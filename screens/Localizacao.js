import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

export default function MapScreen() {
  const region = {
    latitude: -23.099,
    longitude: -45.707,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <View style={styles.container}>
      {/* Mapa */}
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

      {/* Painel de informações */}
      <View style={styles.infoContainer}>
        <Text style={styles.nome}>Lucas</Text>
        <Text style={styles.subtitulo}>SESI-Caçapava</Text>
        <Text style={styles.distancia}>2 km de distância</Text>

        <View style={styles.statusContainer}>
          <Text style={styles.statusTitle}>Status</Text>
          <View style={styles.statusBox}>
            <Text style={styles.mocha}>Mochila GeoKid Pro - Lucas</Text>
            <View style={styles.statusRow}>
              <MaterialIcons name="wifi-off" size={20} color="#fff" />
              <Text style={styles.semConexao}> Sem conexão.</Text>
              <Text style={styles.bateria}> 100%</Text>
            </View>
            <Text style={styles.atualizacao}>Última atualização há 1 hora.</Text>
            <Ionicons name="warning-outline" size={32} color="#ff0099" style={styles.iconAlerta} />
          </View>
        </View>

        {/* Botão Histórico */}
        <TouchableOpacity style={styles.botaoHistorico}>
          <Ionicons name="time-outline" size={20} color="#fff" />
          <Text style={styles.textoBotao}>Histórico de localização</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  map: {
    flex: 1,
  },
  infoContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  nome: {
    color: "#c2185b",
    fontWeight: "bold",
    fontSize: 20,
  },
  subtitulo: {
    color: "#555",
  },
  distancia: {
    color: "#777",
    marginBottom: 10,
  },
  statusContainer: {
    marginTop: 10,
  },
  statusTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  statusBox: {
    backgroundColor: "#000",
    borderRadius: 10,
    padding: 15,
    position: "relative",
  },
  mocha: {
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 5,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  semConexao: {
    color: "#fff",
    fontSize: 14,
  },
  bateria: {
    color: "#fff",
    marginLeft: "auto",
    fontWeight: "bold",
  },
  atualizacao: {
    color: "#bbb",
    fontSize: 12,
  },
  iconAlerta: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  botaoHistorico: {
    flexDirection: "row",
    backgroundColor: "#000",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    marginTop: 15,
  },
  textoBotao: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 5,
  },
});


