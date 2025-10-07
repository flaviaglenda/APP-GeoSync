import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useIsFocused } from "@react-navigation/native";

export default function Notificacoes() {
  const [notificacoes, setNotificacoes] = useState([]);
  const [limpado, setLimpado] = useState(false);
  const isFocused = useIsFocused();

  const notificacoesIniciais = [
    {
      id: 1,
      icon: "exclamation-triangle",
      title: "Botão de pânico pressionado.",
      time: "Hoje, 19:00h",
    },
    {
      id: 2,
      icon: "exclamation-triangle",
      title: "Saída do perímetro seguro.",
      time: "Ontem, 16:30h",
    },
    {
      id: 3,
      icon: "battery-quarter",
      title: "Bateria baixa.",
      time: "Ontem, 19h",
    },
  ];

  useEffect(() => {
    if (isFocused && !limpado) {
      setNotificacoes(notificacoesIniciais);
    }
    if (isFocused && limpado) {
      setLimpado(false); 
    }
  }, [isFocused]);

  const limparNotificacoes = () => {
    setNotificacoes([]);
    setLimpado(true); 
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#000000ff", "#780b47"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Text style={styles.headerText}>NOTIFICAÇÕES</Text>
      </LinearGradient>

      <TouchableOpacity onPress={limparNotificacoes}>
        <Text style={styles.limparText}>Limpar notificações</Text>
      </TouchableOpacity>

      {notificacoes.length === 0 ? (
        <View style={styles.semNotifContainer}>
          <Text style={styles.semNotifText}>SEM NOTIFICAÇÕES</Text>
          <Image
            source={require("../src/assets/semnot_img.png")}
            style={styles.semNotifImage}
          />
        </View>
      ) : (
        <ScrollView style={styles.scrollContainer}>
          {notificacoes.map((item) => (
            <View key={item.id} style={styles.card}>
              <FontAwesome5
                name={item.icon}
                size={24}
                color="#c2185b"
                style={styles.icon}
              />
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.time}>{item.time}</Text>
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
    backgroundColor: "#e9e9ebff",
  },
  header: {
    marginTop: -10,
    height: 80,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  headerText: {
    marginBottom: 9,
    fontSize: 30,
    fontWeight: "100",
    color: "#fff",
  },
  limparText: {
    marginTop: 30,
    marginLeft: 270,
    color: "#6d1232ff",
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
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    backgroundColor: "#fff",
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
    color: "#333",
  },
  time: {
    fontSize: 14,
    color: "#000000ff",
    marginTop: 5,
      fontWeight: "110",
  },
  semNotifContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -180,
  },
  semNotifText: {
    fontSize: 32,
     fontWeight: "110",
    marginBottom: 20,
    color: "#333",
  },
  semNotifImage: {
    width: 300,
    height: 300,
  },
});
