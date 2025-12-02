import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import MapView, { Marker, Polyline, Circle } from "react-native-maps";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useTheme } from "../ThemeContext";
import { supabase } from "../supabaseConfig";
import * as Notifications from "expo-notifications";

export default function Localizacao({ route, navigation }) {
  if (!route || !route.params) {
    console.log("ERRO: route.params está vazio!");
    return <Text>Erro: nenhuma informação recebida.</Text>;
  }

  const { id } = route.params; // id da criança
  const { darkMode } = useTheme();

  const [crianca, setCrianca] = useState(null);
  const [mochilaId, setMochilaId] = useState(null);
  const [posicao, setPosicao] = useState(null);
  const [areaSegura, setAreaSegura] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [mostrarHistorico, setMostrarHistorico] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const alertaEnviadoRef = useRef(false);
  const [alertaEnviado, setAlertaEnviado] = useState(false);
  const [modoAreaSegura, setModoAreaSegura] = useState(false);

  // --- FUNÇÃO DISTÂNCIA (Haversine) retorna metros
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
  

  // calcula distância em km entre a posição atual e a área segura (se existir)
  const distanciaKm =
    posicao && areaSegura
      ? (calcularDistancia(areaSegura.latitude, areaSegura.longitude, posicao.latitude, posicao.longitude) / 1000).toFixed(2)
      : "—";

  // 1) Buscar dados da criança (nome, escola, mochila_id)
  async function carregarDadosCrianca() {
  try {
    const { data, error } = await supabase
      .from("criancas")
      .select("id, nome, escola, mochila_id")
      .eq("id", id)
      .single();

    if (error) {
      console.log("Erro ao carregar criança:", error);
      return;
    }

    setCrianca(data);
    setMochilaId(data.mochila_id);

    // chama a função para carregar o nome da mochila
    carregarNomeMochila(data.mochila_id);

  } catch (err) {
    console.log("Erro inesperado ao buscar criança:", err);
  }
}

  // 2) Buscar última localização da mochila específica
  async function buscarUltimaLocalizacao() {
    if (!mochilaId) return;
    try {
      const { data, error } = await supabase
        .from("gps_dados")
        .select("*")
        .eq("mochila_id", mochilaId)
        .order("data_hora", { ascending: false })
        .limit(1);

      if (error) {
        console.log("Erro ao buscar ultima localizacao:", error);
        return;
      }

      if (data && data.length > 0) {
        setPosicao(data[0]);
        // verifica distância imediatamente se já tiver area segura
        if (areaSegura) verificarDistancia(data[0]);
      } else {
        console.log("Nenhuma localização encontrada para mochila:", mochilaId);
      }
    } finally {
      setCarregando(false);
    }
  }

 async function carregarNomeMochila(idMochila) {
  if (!idMochila) return;
  try {
    const { data, error } = await supabase
      .from("mochilas")
      .select("nome")
      .eq("id", idMochila)
      .single();

    if (error) {
      console.log("Erro ao carregar nome da mochila:", error);
      return;
    }

    setCrianca(prev => ({ ...prev, mochila_nome: data.nome }));
  } catch (err) {
    console.log("Erro inesperado ao buscar nome da mochila:", err);
  }
}

  async function carregarAreaSegura() {
    if (!mochilaId) return;
    try {
      const { data, error } = await supabase
        .from("areas_seguras")
        .select("*")
        .eq("mochila_id", mochilaId)
        .limit(1);

      if (error) {
        console.log("Erro ao carregar área segura:", error);
        return;
      }

      if (data && data.length > 0) {
        setAreaSegura({
          latitude: Number(data[0].latitude),
          longitude: Number(data[0].longitude),
          raio: Number(data[0].raio),
        });
        console.log("Área segura carregada do banco:", data[0]);
      } else {
        console.log("Nenhuma área segura configurada para mochila:", mochilaId);
        setAreaSegura(null);
      }
    } catch (err) {
      console.log("Erro carregarAreaSegura:", err);
    }
  }

  // 4) Criar ou atualizar area segura no banco (usa upsert para garantir criação se não houver)
  async function salvarAreaSeguraNoBanco(latitude, longitude, raio) {
    if (!mochilaId) return;

    // primeiro tentamos atualizar
    const { data: updated, error: updateError } = await supabase
      .from("areas_seguras")
      .update({ latitude, longitude, raio })
      .eq("mochila_id", mochilaId);

    if (updateError) {
      console.log("Erro ao atualizar área segura:", updateError);
    }

    if (!updated || updated.length === 0) {
      // se não tinha linha, inserimos
      const { data: inserted, error: insertError } = await supabase
        .from("areas_seguras")
        .insert([{ mochila_id: mochilaId, latitude, longitude, raio }]);

      if (insertError) {
        console.log("Erro ao criar área segura:", insertError);
        Alert.alert("Erro", "Não foi possível salvar a área segura.");
        return;
      }
      console.log("Área segura criada:", inserted);
    } else {
      console.log("Área segura atualizada:", updated);
    }

    carregarAreaSegura();
    Alert.alert("Sucesso", "Área segura salva!");
  }

  // 5) Histórico — trazer todos os pontos **da mochila** e mostrar como Polyline
  async function carregarHistorico() {
    if (!mochilaId) {
      Alert.alert("Aguarde", "Carregando dados da mochila...");
      return;
    }

    // se já está mostrando → alterna para esconder
    if (mostrarHistorico) {
      setMostrarHistorico(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("gps_dados")
        .select("*")
        .eq("mochila_id", mochilaId)
        .order("data_hora", { ascending: true });

      if (error) {
        console.log("Erro ao carregar histórico:", error);
        return;
      }

      // filtra/garante pontos válidos e converte para números
      const pontos = (data || []).map((p) => ({
        latitude: Number(p.latitude),
        longitude: Number(p.longitude),
        data_hora: p.data_hora,
      }));

      setHistorico(pontos);
      setMostrarHistorico(true);
    } catch (err) {
      console.log("Erro carregarHistorico:", err);
    }
  }

  // 6) Verificar distância e disparar alerta
 function verificarDistancia(local) {
  if (!areaSegura || !local) return;

  const distancia = calcularDistancia(
    Number(areaSegura.latitude),
    Number(areaSegura.longitude),
    Number(local.latitude),
    Number(local.longitude)
  );

  const foraDaArea = distancia > Number(areaSegura.raio);

  console.log({
    areaLat: areaSegura.latitude,
    areaLng: areaSegura.longitude,
    posicaoLat: local.latitude,
    posicaoLng: local.longitude,
    distancia,
    foraDaArea,
    raio: areaSegura.raio,
  });

  // dispara alerta apenas se ainda não foi enviado
  if (foraDaArea && !alertaEnviadoRef.current) {
    Alert.alert("⚠️ Alerta!", "A criança saiu da área segura!");
    Notifications.scheduleNotificationAsync({
      content: { title: "⚠️ Alerta de Segurança", body: "A criança saiu da área segura!" },
      trigger: null,
    });

      salvarNotificacaoNoBanco("fora_area", "A criança saiu da área segura!");
      
    alertaEnviadoRef.current = true;
  }

  // Atualiza o estado do ícone
  setAlertaEnviado(foraDaArea);

  // Reseta o ref caso a criança volte para dentro da área
  if (!foraDaArea && alertaEnviadoRef.current) {
    alertaEnviadoRef.current = false;
  }
}
  async function salvarNotificacaoNoBanco(tipo, mensagem) {
    try {
      const { data, error } = await supabase.from("notificacoes").insert([{
        mochila_id: mochilaId,
        tipo_alerta: tipo,
        mensagem,
        lida: false,
        data_hora: new Date()
      }]);
      if (error) console.log("Erro ao salvar notificação:", error);
      else console.log("Notificação salva:", data);
    } catch (err) {
      console.log("Erro salvarNotificacaoNoBanco:", err);
    }
  }

  // EFEITOS
  // buscar dados da criança ao montar (e sempre que id mudar)
  useEffect(() => {
    setCarregando(true);
    carregarDadosCrianca();
  }, [id]);

  // quando mochilaId estiver disponível → carregar área + última posição + iniciar polling
  useEffect(() => {
    if (!mochilaId) return;
    carregarAreaSegura();
    buscarUltimaLocalizacao();
    const interval = setInterval(buscarUltimaLocalizacao, 5000);
    return () => clearInterval(interval);
  }, [mochilaId]);

  // check sempre que posicao/area mudarem
  useEffect(() => {
    if (posicao && areaSegura) verificarDistancia(posicao);
  }, [posicao, areaSegura]);

  // REGIÃO DO MAPA (padrão se posicao undefined)
  const region = {
    latitude: posicao?.latitude || -23.099,
    longitude: posicao?.longitude || -45.707,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };


  
  function ativarModoAreaSegura() {
    if (!mochilaId) {
      Alert.alert("Aguarde", "Ainda carregando dados da mochila.");
      return;
    }
    setModoAreaSegura(true);
    Alert.alert("Modo Área Segura", "Toque no mapa para definir o ponto seguro.");
  }

  // salva área quando o usuário clica no mapa (use esse onPress no MapView)
  async function onMapPressSalvarArea(e) {
    if (!modoAreaSegura) return;
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setAreaSegura({ latitude, longitude, raio: 150 });
    setModoAreaSegura(false);
    await salvarAreaSeguraNoBanco(latitude, longitude, 150);
  }

  // RENDER
  return (
    <View style={[styles.container, { backgroundColor: darkMode ? "#000" : "#fff" }]}>
  {carregando ? (
    <ActivityIndicator size="large" color="#ff0099" style={{ marginTop: 50 }} />
  ) : (
    <MapView
      style={styles.map}
      region={region}
      onPress={onMapPressSalvarArea}
    >
      {posicao && (
        <Marker
          coordinate={{ latitude: posicao.latitude, longitude: posicao.longitude }}
          title="Localização Atual"
          description={`Atualizado em: ${new Date(posicao.data_hora).toLocaleString()}`}
        />
      )}

      {/* Histórico da criança selecionada */}
      {mostrarHistorico && historico.length > 0 && (
        <Polyline
          coordinates={historico.map(p => ({ latitude: p.latitude, longitude: p.longitude }))}
          strokeWidth={4}
          strokeColor="#ff0099"
        />
      )}

      {/* Área segura da criança */}
      {areaSegura && (
        <Circle
          center={{ latitude: areaSegura.latitude, longitude: areaSegura.longitude }}
          radius={areaSegura.raio}
          strokeWidth={2}
          strokeColor="#ff0099"
          fillColor="rgba(255,0,153,0.15)"
        />
      )}
    </MapView>
  )}

  {/* Painel inferior */}
  <View
    pointerEvents="box-none"
    style={[styles.panel, { backgroundColor: darkMode ? "#192230" : "#e9e9eb",padding: 20, marginBottom: 50 }]}
  >
    <Text style={[styles.nome, { color: darkMode ? "#f61f7c" : "#c2185b" }]}>
      {crianca?.nome || "—"}
    </Text>
    <Text style={[styles.subtitulo, { color: darkMode ? "#ccc" : "#555" }]}>
      {crianca?.escola || "—"}
    </Text>
    <Text style={[styles.distancia, { color: darkMode ? "#aaa" : "#777" }]}>
      {distanciaKm} km de distância
    </Text>

    <View style={styles.statusContainer}>
      <Text style={[styles.statusTitle, { color: darkMode ? "#fff" : "#000" }]}>Status</Text>
      <View style={[styles.statusBox, { backgroundColor: darkMode ? "#0d1727ff" : "#0d1727ff" }]}>
        <Text style={[styles.mocha, { color: "#fff" }]}>
          {crianca ? `Mochila: ${crianca.mochila_nome || ""}` : "—"}
        </Text>
        <View style={styles.statusRow}>
          <MaterialIcons name="wifi-off" size={20} color="#fff" />
          <Text style={[styles.semConexao, { color: "#fff" }]}> Sem conexão.</Text>
          <Text style={[styles.bateria, { color: "#fff" }]}> 100%</Text>
        </View>
        <Text style={[styles.atualizacao, { color: "#bbb" }]}>
          Última atualização: {posicao ? new Date(posicao.data_hora).toLocaleString() : "—"}
        </Text>

        {/* Ícone de alerta visível apenas quando fora da área segura */}
        {alertaEnviado && (
          <Ionicons
            name="warning-outline"
            size={32}
            color="#ff0099"
            style={{ position: "absolute", top: 10, right: 10, zIndex: 999 }}
          />
        )}
      </View>
    </View>

    {/* Botões */}
    <TouchableOpacity
      onPress={carregarHistorico}
      style={[styles.botaoHistorico, { backgroundColor: darkMode ? "#780b47" : "#000" }]}
    >
      <Ionicons name="time-outline" size={20} color="#fff" />
      <Text style={styles.textoBotao}>Histórico</Text>
    </TouchableOpacity>

    <TouchableOpacity
      onPress={ativarModoAreaSegura}
      style={[styles.botaoHistorico, { backgroundColor: "#8b0756ff" }]}
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
