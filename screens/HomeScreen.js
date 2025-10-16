import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from "react-native";
import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function HomeScreen({navigation}) {
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.btnDetalhes}>
        <Ionicons name="add" size={28} color="#fff" />
        <Text style={styles.btnDetalhesText}
        onPress={() => navigation.navigate("Localização")}>Ver localização detalhada</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Supervisão de atividades</Text>

      <View style={styles.mapContainer}>
        <Image
          source={require("../src/assets/mapa_visual.png")}
          style={styles.mapImage}
        />
      </View>

      <View style={styles.buttonsRow}>
        <LinearGradient
          colors={["#000000ff", "#6b093fff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.btnRoxo}
        >
          <TouchableOpacity style={{ flex: 1 }}onPress={() => navigation.navigate("Localização")}>
            <Text style={styles.btnTitle}
            >Clique para ver</Text>
            <Text style={styles.btnMain}>Localização{"\n"}em tempo real</Text>
            <MaterialIcons
              name="arrow-forward-ios"
              size={20}
              color="#fff"
              style={styles.arrow}
            />
          </TouchableOpacity>
        </LinearGradient>

        <LinearGradient
          colors={["#000000ff", "#6b093fff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.btnRoxo}
        >
          <TouchableOpacity style={{ flex: 1 }}onPress={() => navigation.navigate("Notificações")}>
            <Text style={styles.btnTitle}>Clique para ver</Text>
            <Text style={styles.btnMain}>Alarme{"\n"}de emergência</Text>
            <MaterialIcons
              name="arrow-forward-ios"
              size={20}
              color="#fff"
              style={styles.arrow}
            />
          </TouchableOpacity>
        </LinearGradient>
      </View>

      <Text style={styles.statusTitle}>Status</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Mochila GeoKid Pro - Lucas</Text>
        <View style={styles.row}>
          <FontAwesome5 name="wifi" size={28} color="#fff" />
          <Text style={styles.cardStatus}>Sem conexão.</Text>
          <Text style={styles.percent}>100%</Text>
          <Ionicons name="battery-full" size={28} color="#fff" />
        </View>
        <Text style={styles.updateText}>Última atualização há 1 hora.</Text>
        <MaterialIcons
          name="warning"
          size={30}
          color="#cf065dff"
          style={styles.warningIcon}
        />

        <View style={styles.separator} />

        <Text style={styles.cardTitle}>Mochila GeoGuard - Sabrina</Text>
        <View style={styles.row}>
          <FontAwesome5 name="wifi" size={28} color="#fff" />
          <Text style={styles.cardStatus}>Conectado</Text>
          <Text style={styles.percent}>100%</Text>
          <Ionicons name="battery-full" size={28} color="#fff" />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e9e9ebff",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  btnDetalhes: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    borderRadius: 17,
    paddingVertical: 10,
    marginBottom: 30,
    marginTop: -18,
  },
  btnDetalhesText: {
    color: "#fff",
    fontSize: 20,
    marginLeft: 5,
    fontWeight: "600",
  },
  title: {
    fontWeight: "700",
    fontSize: 23,
    marginBottom: 10,
  },
  mapContainer: {
    position: "relative",
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 15,
  },
  mapImage: {
    width: "100%",
    height: 230,
    resizeMode: "cover",
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  btnRoxo: {
    borderRadius: 20,
    width: "48%",
    padding: 10,
    height: 150,
    marginTop: 15,
  },
  btnTitle: {
    color: "#fff",
    fontSize: 15,
    marginBottom: 25,
    marginTop: 5,
  },
  btnMain: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "600",
  },
  arrow: {
    alignSelf: "flex-end",
    marginTop: -18,
  },
  statusTitle: {
    fontSize: 23,
    fontWeight: "700",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#000",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    height: 260,
  },
  cardTitle: {
    color: "#fff",
    fontWeight: "700",
    marginBottom: 20,
    fontSize: 23,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardStatus: {
    color: "#fff",
    fontSize: 20,
    flex: 1,
    marginLeft: 5,
  },
  percent: {
    color: "#fff",
    fontSize: 18,
    marginRight: 5,
  },
  updateText: {
    color: "#aaa",
    fontSize: 15,
    marginTop: 4,
    marginBottom: 20,
  },
  separator: {
    borderBottomColor: "#fff",
    borderBottomWidth: 1,
    opacity: 0.4,
    marginVertical: 10,
  },
  warningIcon: {
    position: "absolute",
    bottom: 210,
    right: 10,
  },
});
