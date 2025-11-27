import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import MapView, { Marker, Polyline, Circle } from "react-native-maps";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useTheme } from "../ThemeContext";
import { supabase } from "../supabaseConfig";
import * as Notifications from "expo-notifications";

export default function Localizacao() {
  const { darkMode, theme } = useTheme();
  const [alertaEnviado, setAlertaEnviado] = useState(false);
  const alertaEnviadoRef = useRef(false);
  const [mostrarHistorico, setMostrarHistorico] = useState(false);
  const [historico, setHistorico] = useState([]);
  const [posicao, setPosicao] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // AREA SEGURA
  const [modoAreaSegura, setModoAreaSegura] = useState(false);
  const [areaSegura, setAreaSegura] = useState(null); // {latitude, longitude, raio}

  // --- FUNÇÃO DISTÂNCIA (Haversine)
  function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371e3;
    const toRad = (v) => (v * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }


  function verificarDistancia(local) {
    if (!areaSegura) return;

    const distancia = calcularDistancia(
      Number(areaSegura.latitude),
      Number(areaSegura.longitude),
      Number(local.latitude),
      Number(local.longitude)
    );

    console.log("=== VERIFICANDO DISTÂNCIA ===");
    console.log("Local atual:", local.latitude, local.longitude);
    console.log("Área segura:", areaSegura.latitude, areaSegura.longitude, areaSegura.raio);
    console.log("Distância calculada:", distancia);
    console.log("foraDaArea =", distancia > areaSegura.raio);
    console.log("=============================");
    async function enviarNotificacaoLocal() {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "⚠️ Alerta de Segurança",
          body: "A criança saiu da área segura!",
        },
        trigger: null, // dispara imediatamente
      });
    }
    console.log("Distância:", distancia, "m");

    const foraDaArea = distancia > areaSegura.raio;

    if (foraDaArea) {
      if (!alertaEnviadoRef.current) {
        Alert.alert("⚠️ Alerta!", "A criança saiu da área segura!");
        alertaEnviadoRef.current = true;
        setAlertaEnviado(true);
        salvarNotificacaoNoBanco("fora_da_area", "A criança saiu da área segura!");
        enviarNotificacaoLocal();
      }
    } else {
      if (alertaEnviadoRef.current) {
        console.log("Voltou para a área, alerta resetado");
        alertaEnviadoRef.current = false;
        setAlertaEnviado(false);
      }
    }
  }


  async function salvarNotificacaoNoBanco(tipo, mensagem) {
    const { data, error } = await supabase
      .from("notificacoes")
      .insert([{
        mochila_id: 1,
        tipo_alerta: tipo,
        mensagem: mensagem,
        lida: false,
        data_hora: new Date()
      }]);

    if (error) {
      console.log("Erro ao salvar notificação:", error);
    } else {
      console.log("Notificação salva no banco:", data);
    }
  }

  async function buscarUltimaLocalizacao() {
    const { data, error } = await supabase
      .from("gps_dados")
      .select("*")
      .eq("mochila_id", 1)
      .order("data_hora", { ascending: false })
      .limit(1);
    if (!error && data.length > 0) {

      setPosicao(data[0]);

      if (areaSegura) {
        verificarDistancia(data[0]);
      }
    }
    setCarregando(false);
  }
  async function carregarAreaSegura() {
    const { data, error } = await supabase
      .from("areas_seguras")
      .select("*")
      .eq("mochila_id", 1)
      .limit(1);

    if (error) {
      console.log("Erro ao carregar área segura:", error);
      return;
    }

    if (data.length > 0) {
      setAreaSegura({
        latitude: Number(data[0].latitude),
        longitude: Number(data[0].longitude),
        raio: Number(data[0].raio)
      });
      console.log("Área segura carregada do banco:", data[0]);
    }
  }

  // HISTÓRICO
  async function carregarHistorico() {
    // Se já está mostrando → vai esconder
    if (mostrarHistorico) {
      setMostrarHistorico(false);
      return;
    }

    // Se NÃO está mostrando → vai carregar do banco
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
  if (posicao && areaSegura) {
    verificarDistancia(posicao);
  }
}, [posicao, areaSegura]);

  useEffect(() => {
    carregarAreaSegura();
    buscarUltimaLocalizacao();
    const interval = setInterval(buscarUltimaLocalizacao, 5000);
    return () => clearInterval(interval);
  }, []);

  // REGIÃO DO MAPA
  const region = {
    latitude: posicao?.latitude || -23.099,
    longitude: posicao?.longitude || -45.707,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  function ativarModoAreaSegura() {
    setModoAreaSegura(true);
    Alert.alert("Modo Área Segura", "Clique no mapa para definir o ponto seguro.");
  }
  async function salvarAreaSeguraNoBanco(latitude, longitude, raio) {

    const { data, error } = await supabase
      .from("areas_seguras")
      .update({
        latitude,
        longitude,
        raio
      })
      .eq("mochila_id", 1);

    if (error) console.log("Erro ao salvar:", error);
    else {
      alert("Área segura atualizada!");
      carregarAreaSegura();
    }
  }


  return (
    <View style={[styles.container, { backgroundColor: darkMode ? "#000" : "#fff" }]}>
      {carregando ? (
        <ActivityIndicator size="large" color="#ff0099" style={{ marginTop: 50 }} />
      ) : (
        <MapView
          style={styles.map}
          region={region}
          onPress={(e) => {
            if (modoAreaSegura) {
              const { latitude, longitude } = e.nativeEvent.coordinate;
              setAreaSegura({ latitude, longitude, raio: 150 });
              setModoAreaSegura(false);
              salvarAreaSeguraNoBanco(latitude, longitude, 150);
            }
          }}
        >
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

          {areaSegura && (
            <Circle
              center={{
                latitude: areaSegura.latitude,
                longitude: areaSegura.longitude
              }}
              radius={areaSegura.raio}
              strokeWidth={2}
              strokeColor="#ff0099"
              fillColor="rgba(255,0,153,0.15)"
            />
          )}
        </MapView>
      )}
      {/* painel informações */}
      <View
      pointerEvents="box-none"
        style={[styles.container, { backgroundColor: darkMode ? "#192230" : "#e9e9eb" }]}
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
              { backgroundColor: darkMode ? "#0d1727ff" : "#0d1727ff" },
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

        {/* BOTÕES */}
        <TouchableOpacity onPress={carregarHistorico}
          style={[styles.botaoHistorico, { backgroundColor: darkMode ? "#780b47" : "#000" }]}
        >
          <Ionicons name="time-outline" size={20} color="#fff" />
          <Text style={styles.textoBotao}>Histórico</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={ativarModoAreaSegura}
          style={[styles.botaoHistorico, { backgroundColor: "#ff0099" }]}
        >
          <Ionicons name="map-outline" size={20} color="#fff" />
          <Text style={styles.textoBotao}>Criar Área Segura</Text>
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
  botaoHistorico: {
    borderRadius: 70,
    marginTop: 2
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
