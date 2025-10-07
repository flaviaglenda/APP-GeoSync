import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome, Ionicons } from "@expo/vector-icons";

export default function GerenciarCriancas({ navigation }) {
  // Lista de exemplo
  const criancas = [
    { id: 1, nome: "Lucas", escola: "SESI-Caçapava", alerta: true },
    { id: 2, nome: "Sabrina", escola: "Colégio Cecília", alerta: false },
  ];

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <LinearGradient
        colors={["#000000ff", "#780b47"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>CRIANÇAS</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.sectionTitle}>LOCALIZADORES</Text>

        {/* LISTA DE CRIANÇAS */}
        {criancas.map((item) => (
          <View key={item.id} style={styles.childCard}>
            <View style={styles.childInfo}>
              <Ionicons name="person-circle-outline" size={60} color="#000" />
              <View style={styles.childTextContainer}>
                <Text style={styles.childName}>{item.nome}</Text>
                <Text style={styles.childSchool}>{item.escola}</Text>
              </View>
            </View>

            <View style={styles.iconContainer}>
              <TouchableOpacity
                onPress={() => navigation.navigate("PerfilCrianca")}
              >
                <FontAwesome name="info-circle" size={25} color="#000" />
              </TouchableOpacity>

              {item.alerta && (
                <FontAwesome
                  name="exclamation-triangle"
                  size={18}
                  color="red"
                  style={{ marginLeft: 5 }}
                />
              )}
            </View>
          </View>
        ))}

        {/* BOTÃO ADICIONAR */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => alert("Adicionar nova criança")}
        >
          <View style={styles.addButtonContent}>
            <FontAwesome name="plus" size={18} color="#fff" />
            <Text style={styles.addButtonText}>Adicionar</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    height: 80,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "400",
    color: "#fff",
    marginBottom: 6,
  },
  backButton: {
    position: "absolute",
    left: 20,
    bottom: 10,
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginTop: 25,
    marginBottom: 15,
    marginLeft: 25,
  },
  childCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 25,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  childInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  childTextContainer: {
    marginLeft: 10,
  },
  childName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  childSchool: {
    fontSize: 14,
    color: "#555",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#780b47",
    borderRadius: 10,
    marginHorizontal: 90,
    marginTop: 35,
    paddingVertical: 10,
  },
  addButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
