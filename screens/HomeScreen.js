import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../ThemeContext";
import { supabase } from "../supabaseConfig";
import { useIsFocused } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";

export default function HomeScreen({ navigation }) {
  const [localizacao, setLocalizacao] = useState(null);
  const { darkMode, theme } = useTheme();
  const isFocused = useIsFocused();

  const [criancas, setCriancas] = useState([]);

  // 🔥 Quando carregar crianças → pega última localização
  useEffect(() => {
    if (criancas.length > 0) {
      const c = criancas[0];

      if (c.mochila_id) {
        buscarUltimaLocalizacao(c.mochila_id);
      } else {
        console.log("⚠ Criança não possui mochila cadastrada.");
      }
    }
  }, [criancas]);

  // 🔥 Recarregar crianças quando voltar pra tela
  useEffect(() => {
    if (isFocused) {
      carregarCriancas();
    }
  }, [isFocused]);

  // ✔ Buscar crianças do usuário
  const carregarCriancas = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      setCriancas([]);
      return;
    }

    const userId = session.user.id;

    const { data, error } = await supabase
      .from("criancas")
      .select(`*,mochila:mochila_id (*)`)
      .eq("usuario_id", userId);

    if (error) {
      console.log("⚠ Erro ao carregar crianças:", error.message);
      setCriancas([]);
      return;
    }

    setCriancas(data || []);
  };

 function verificarCriancaAntesDeAbrirLocalizacao() {
  if (criancas.length === 0) {
    alert("Você precisa adicionar uma criança primeiro!");
    navigation.navigate("Perfil", {
      screen: "GerenciarCrianca"
    });
    return; // 👈 Impede que continue executando
  }

  // Se tiver criança → abre a tela normal
  navigation.navigate("listarCrianca");
}
  // ✔ Buscar a última localização no gps_dados
  async function buscarUltimaLocalizacao(mochilaId) {
    console.log("📌 Mochila ID recebido:", mochilaId);

    if (!mochilaId) {
      console.log("⚠ mochila_id é null");
      return;
    }

    const { data, error } = await supabase
      .from("gps_dados")
      .select("*")
      .eq("mochila_id", mochilaId)
      .order("data_hora", { ascending: false })
      .limit(1);

    if (error) {
      console.log("Erro GPS:", error);
      return;
    }

    console.log("📡 Dados crus recebidos do GPS:", data);

    if (data && data.length > 0) {
      const registro = data[0];

      if (registro.latitude && registro.longitude) {
        setLocalizacao({
          latitude: Number(registro.latitude),
          longitude: Number(registro.longitude)
        });
      }
    }
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >

      {/* BOTÃO LOCALIZAÇÃO */}
      <TouchableOpacity
        style={[
          styles.btnDetalhes,
          { backgroundColor: darkMode ? "#fff" : "#192230" }
        ]}
        onPress={verificarCriancaAntesDeAbrirLocalizacao}
      >
        <Ionicons
          name="location-outline"
          size={22}
          color={darkMode ? "#000" : "#fff"}
          style={{ marginRight: 5 }}
        />
        <Text
          style={[
            styles.btnDetalhesText,
            { color: darkMode ? "#000" : "#fff" }
          ]}
        >
          Ver localização detalhada
        </Text>
      </TouchableOpacity>

      {/* TÍTULO */}
      <Text style={[styles.title, { color: darkMode ? "#fff" : "#000" }]}>
        Supervisão de atividades
      </Text>

      {/* MAPA */}
      <View style={styles.mapContainer}>
        {localizacao ? (
          <MapView
            style={styles.mapImage}
            initialRegion={{
              latitude: localizacao.latitude,
              longitude: localizacao.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={localizacao}
              title="Localização atual"
            />
          </MapView>
        ) : (
          <TouchableOpacity onPress={verificarCriancaAntesDeAbrirLocalizacao}>
            <Image
              source={require("../src/assets/mapa_visual.png")}
              style={styles.mapImage}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* DOIS BOTÕES GRANDES */}
      <View style={styles.buttonsRow}>
        {/* LOCALIZAÇÃO */}
        {darkMode ? (
          <TouchableOpacity
            style={[styles.btnRoxo, { backgroundColor: "#961f53ff" }]}
            onPress={verificarCriancaAntesDeAbrirLocalizacao}
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
              onPress={verificarCriancaAntesDeAbrirLocalizacao}
            >
              <Text style={styles.btnTitle}>Clique para ver</Text>
              <Text style={styles.btnMain}>Localização{"\n"}em tempo real</Text>
              <MaterialIcons name="arrow-forward-ios" size={20} color="#fff" style={styles.arrow} />
            </TouchableOpacity>
          </LinearGradient>
        )}

        {/* ALARME */}
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

      {/* STATUS */}
      <Text
        style={[
          styles.statusTitle,
          { color: darkMode ? "#fff" : "#000" }
        ]}
      >
        Status
      </Text>

      <View
        style={[
          styles.card,
          { backgroundColor: darkMode ? "#f2efef" : "#192230" }
        ]}
      >
        {/* SE NÃO TIVER NENHUMA CRIANÇA */}
        {criancas.length === 0 ? (
          <View style={{ alignItems: "center", paddingVertical: 30 }}>
            <Ionicons
              name="sad-outline"
              size={60}
              color={darkMode ? "#000" : "#fff"}
            />
            <Text
              style={{
                marginTop: 15,
                fontSize: 20,
                color: darkMode ? "#000" : "#fff"
              }}
            >
              Nenhuma mochila adicionada
            </Text>
          </View>
        ) : (
          // SE TIVER CRIANÇAS, LISTA NORMAL
          criancas.map((c, index) => (
            <View key={c.id}>
              <Text style={[styles.cardTitle, { color: darkMode ? "#000" : "#fff" }]}>
                {c.nome}
              </Text>

              <View style={styles.row}>
                <FontAwesome5 name="wifi" size={28} color={darkMode ? "#000" : "#fff"} />
                <Text style={[styles.cardStatus, { color: darkMode ? "#000" : "#fff" }]}>
                  {c.conectado ? "Conectado" : "Sem conexão."}
                </Text>
                <Text style={[styles.percent, { color: darkMode ? "#000" : "#fff" }]}>
                  {c.bateria || 100}%
                </Text>
                <Ionicons name="battery-full" size={28} color={darkMode ? "#000" : "#fff"} />
              </View>

              <Text style={[styles.updateText, { color: darkMode ? "#333" : "#aaa" }]}>
                Última atualização há 1 hora.
              </Text>

           

              {index !== criancas.length - 1 && <View style={styles.separator} />}
            </View>
          ))
        )}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 40 },
  btnDetalhes: { flexDirection: "row", alignItems: "center", justifyContent: "center", borderRadius: 28, paddingVertical: 10, marginBottom: 30 },
  btnDetalhesText: { fontSize: 20, marginLeft: 5, fontWeight: "600" },
  title: { fontWeight: "700", fontSize: 23, marginBottom: 10 },
  mapContainer: { borderRadius: 15, overflow: "hidden", marginBottom: 15 },
  mapImage: { width: "100%", height: 230, resizeMode: "cover" },
  buttonsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 30 },
  btnRoxo: { borderRadius: 20, width: "48%", height: 150, marginTop: 15, overflow: "hidden", justifyContent: "center" },
  btnContent: { flex: 1, padding: 10, justifyContent: "space-between" },
  btnTitle: { color: "#fff", fontSize: 15, marginBottom: 10 },
  btnMain: { color: "#fff", fontSize: 22, fontWeight: "600" },
  arrow: { alignSelf: "flex-end", marginTop: 10 },
  statusTitle: { fontSize: 23, fontWeight: "700", marginBottom: 10 },
  card: { borderRadius: 29, padding: 15 },
  cardTitle: { fontWeight: "700", marginBottom: 15, fontSize: 20 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  cardStatus: { fontSize: 18, flex: 1, marginLeft: 5 },
  percent: { fontSize: 18, marginRight: 5 },
  updateText: { fontSize: 15, marginTop: 5 },
  separator: { borderBottomColor: "#fff", borderBottomWidth: 1, opacity: 0.4, marginVertical: 10 },
  warningIcon: { position: "absolute", top: 10, right: 10 }
});
