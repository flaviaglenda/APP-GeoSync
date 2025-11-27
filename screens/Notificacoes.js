import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useIsFocused } from "@react-navigation/native";
import { useTheme } from "../ThemeContext";
import { supabase } from "../supabaseConfig";

export default function Notificacoes() {
  const { darkMode } = useTheme();
  const [notificacoes, setNotificacoes] = useState([]);
  const [limpado, setLimpado] = useState(false);
  const isFocused = useIsFocused();

  const buscarNotificacoes = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      if (!userId) return;

      // Pegar crianças do usuário
      const { data: criancas, error: criancaError } = await supabase
        .from("criancas")
        .select("id,nome,mochila_id")
        .eq("usuario_id", userId);

      if (criancaError) {
        console.error("Erro ao buscar crianças:", criancaError);
        return;
      }

      const mochilaIds = criancas.map(c => c.mochila_id).filter(Boolean);
      if (mochilaIds.length === 0) {
        setNotificacoes([]);
        return;
      }

      // Buscar notificações das mochilas do usuário
      const { data, error } = await supabase
        .from("notificacoes")
        .select("*")
        .in("mochila_id", mochilaIds)
        .order("data_hora", { ascending: false });

      if (error) {
        console.error("Erro ao buscar notificações:", error);
        return;
      }

      // Adicionar nome da criança quando for saída do perímetro
      const notificacoesComNome = data.map(n => {
        if (n.tipo_alerta === "perimetro") {
          const crianca = criancas.find(c => c.mochila_id === n.mochila_id);
          return { ...n, mensagem: `${crianca?.nome || "Criança"} saiu do perímetro seguro.` };
        }
        return n;
      });

      setNotificacoes(notificacoesComNome);

    } catch (e) {
      console.error("Erro inesperado:", e);
    }
  };

  const limparNotificacoes = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      if (!userId) return;

      // Pegar mochilas do usuário
      const { data: criancas } = await supabase
        .from("criancas")
        .select("mochila_id")
        .eq("usuario_id", userId);

      const mochilaIds = criancas.map(c => c.mochila_id).filter(Boolean);

      if (mochilaIds.length > 0) {
        await supabase
          .from("notificacoes")
          .delete()
          .in("mochila_id", mochilaIds);
      }

      setNotificacoes([]);
      setLimpado(true);
    } catch (e) {
      console.error("Erro ao limpar notificações:", e);
    }
  };

  useEffect(() => {
    if (isFocused && !limpado) buscarNotificacoes();
    if (isFocused && limpado) setLimpado(false);
  }, [isFocused]);

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? "#192230" : "#e9e9eb" }]}>
      <LinearGradient
        colors={["#5f0738", "#5f0738"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Text style={styles.headerText}>NOTIFICAÇÕES</Text>
      </LinearGradient>

      <TouchableOpacity onPress={limparNotificacoes}>
        <Text style={[styles.limparText, { color: darkMode ? "#f61f7c" : "#6d1232ff" }]}>
          Limpar notificações
        </Text>
      </TouchableOpacity>

      {notificacoes.length === 0 ? (
        <View style={styles.semNotifContainer}>
          <Text style={[styles.semNotifText, { color: darkMode ? "#fff" : "#333" }]}>
            SEM NOTIFICAÇÕES
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollContainer}>
          {notificacoes.map((item) => (
            <View
              key={item.id}
              style={[
                styles.card,
                {
                  backgroundColor: darkMode ? "#131b26ff" : "#fff",
                  borderColor: darkMode ? "#828282ff" : "#ccc",
                },
              ]}
            >
              <FontAwesome5
                name="exclamation-triangle"
                size={24}
                color={darkMode ? "#f61f7c" : "#780b47"}
                style={styles.icon}
              />
              <View style={styles.textContainer}>
                <Text style={[styles.title, { color: darkMode ? "#fff" : "#333" }]}>
                  {item.mensagem}
                </Text>
                <Text style={[styles.time, { color: darkMode ? "#ddd" : "#000" }]}>
                  {new Date(item.data_hora).toLocaleString()}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
 header: {
    marginTop: -30,
    height: 95,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingBottom: 10,
    borderRadius: 33,
  },
  headerText: {
    marginBottom: 9,
    fontSize: 30,
    fontWeight: "100",
    color: "#fff",
  },
  limparText: {
    marginTop: 20,
    marginLeft: 260,
    fontSize: 14,
    marginBottom: 9,
  },
  scrollContainer: {
    padding: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 30,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
  },
  time: {
    fontSize: 14,
    marginTop: 5,
  },
  semNotifContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -120,
  },
  semNotifText: {
    fontSize: 32,
    fontWeight: "bold",
  },
});
