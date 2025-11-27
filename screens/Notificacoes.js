import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useIsFocused } from "@react-navigation/native";
import { useTheme } from "../ThemeContext"; // <<< pega tema global

export default function Notificacoes() {
  const { darkMode, theme } = useTheme();
  const [notificacoes, setNotificacoes] = useState([]);
  const [limpado, setLimpado] = useState(false);
  const isFocused = useIsFocused();

  const notificacoesIniciais = [
    { id: 1, icon: "exclamation-triangle", title: "Botão de pânico pressionado.", time: "Hoje, 19:00h" },
    { id: 2, icon: "exclamation-triangle", title: "Saída do perímetro seguro.", time: "Ontem, 16:30h" },
    { id: 3, icon: "battery-quarter", title: "Bateria baixa.", time: "Ontem, 19h" },
  ];

  useEffect(() => {
    if (isFocused && !limpado) setNotificacoes(notificacoesIniciais);
    if (isFocused && limpado) setLimpado(false);
  }, [isFocused]);

  const limparNotificacoes = () => {
    setNotificacoes([]);
    setLimpado(true);
  };

  return (
    <View   style={[styles.container, { backgroundColor: darkMode ? "#192230" : "#e9e9eb" }]}>
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
                name={item.icon}
                size={24}
                color={darkMode ? "#f61f7c" : "#780b47"}
                style={styles.icon}
              />
              <View style={styles.textContainer}>
                <Text style={[styles.title, { color: darkMode ? "#fff" : "#333" }]}>{item.title}</Text>
                <Text style={[styles.time, { color: darkMode ? "#ddd" : "#000" }]}>{item.time}</Text>
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
