import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useTheme } from "../ThemeContext";
import { supabase } from "../supabaseConfig";
import { Polyline } from "react-native-maps";

export default function MapScreen() {
  const { darkMode } = useTheme();
  const [mostrarHistorico, setMostrarHistorico] = useState(false);
  const [historico, setHistorico] = useState([]);
  const [posicao, setPosicao] = useState(null);
  const [carregando, setCarregando] = useState(true);

  async function buscarUltimaLocalizacao() {
    const { data, error } = await supabase
      .from("gps_dados")
      .select("*")
      .eq("mochila_id", 1)  // <- troque dinamicamente depois se quiser
      .order("data_hora", { ascending: false })
      .limit(1);

    if (!error && data.length > 0) {
      setPosicao(data[0]);
    }
    // Defina área segura (ex: escola)
    const areaSegura = {
      latitude: -23.099,
      longitude: -45.707
    };

    const distancia = calcularDistancia(
      areaSegura.latitude,
      areaSegura.longitude,
      data[0].latitude,
      data[0].longitude
    );

    console.log("Distância atual da área segura:", distancia, "metros");

    
    if (distancia > 150) { 
      alert("⚠️ A criança saiu da área segura!");
    }
    setCarregando(false);
  }
  async function carregarHistorico() {
    const { data, error } = await supabase
      .from("gps_dados")
      .select("*")
      .eq("mochila_id", 1)
      .order("data_hora", { ascending: true });

    if (!error) {
      setHistorico(data);
      setMostrarHistorico(true);
    }
  }

  useEffect(() => {
    buscarUltimaLocalizacao();

    const interval = setInterval(buscarUltimaLocalizacao, 5000);
    return () => clearInterval(interval);
  }, []);

  const region = {
    latitude: posicao?.latitude || -23.099,
    longitude: posicao?.longitude || -45.707,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };
  function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Raio da Terra em metros
    const toRad = (value) => (value * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // retorna metros
  }
  return (
    <View style={[styles.container, { backgroundColor: darkMode ? "#000" : "#fff" }]}>

      {carregando ? (
        <ActivityIndicator size="large" color="#ff0099" style={{ marginTop: 50 }} />
      ) : (
        <MapView style={styles.map} region={region}>
          {posicao && (
            <Marker
              coordinate={{ latitude: posicao.latitude, longitude: posicao.longitude }}
              title="Localização Atual"
              description={`Atualizado em: ${new Date(posicao.data_hora).toLocaleTimeString()}`}
            />
          )}
          {mostrarHistorico && (
            <Polyline
              coordinates={historico.map(p => ({
                latitude: p.latitude,
                longitude: p.longitude
              }))}
              strokeWidth={4}
              strokeColor="#ff0099"
            />
          )}
        </MapView>
      )}
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

        <TouchableOpacity onPress={carregarHistorico}
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
    fontSize: 30,
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
