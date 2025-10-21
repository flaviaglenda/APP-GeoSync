import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useTheme } from "../ThemeContext";

export default function GerenciarCriancas({ navigation }) {
  const { darkMode } = useTheme();

  const criancas = [
    { id: 1, nome: "Lucas", escola: "SESI-Caçapava", alerta: true },
    { id: 2, nome: "Sabrina", escola: "Colégio Cecília", alerta: false },
  ];

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: darkMode ? "#000" : "#e9e9eb" },
      ]}
    >
      <View
        style={[styles.container, { backgroundColor: darkMode ? "#000" : "#e9e9eb" }]}
      >
        <LinearGradient
          colors={["#000000", "#780b47"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate("PerfilResponsavel")}
          >
            <FontAwesome name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerText}>LOCALIZADORES</Text>
        </LinearGradient>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {criancas.map((item) => (
            <View
              key={item.id}
              style={[
                styles.childCard,
                { backgroundColor: darkMode ? "#1a1a1a" : "#fff" },
              ]}
            >
              <View style={styles.childInfo}>
                <Ionicons
                  name="person-circle-outline"
                  size={60}
                  color={darkMode ? "#fff" : "#3f3d3dff"}
                />
                <View style={styles.childTextContainer}>
                  <Text
                    style={[
                      styles.childName,
                      { color: darkMode ? "#fff" : "#333" },
                    ]}
                  >
                    {item.nome}
                  </Text>
                  <Text
                    style={[
                      styles.childSchool,
                      { color: darkMode ? "#aaa" : "#666" },
                    ]}
                  >
                    {item.escola}
                  </Text>
                </View>
              </View>

              <View style={styles.iconContainer}>
                {item.alerta && (
                  <FontAwesome
                    name="exclamation-triangle"
                    size={25}
                    color={darkMode ? "#be1a74ff" : "#5b133aff"}
                    style={{ marginRight: 15 }}
                  />
                )}
                <TouchableOpacity
                  onPress={() => navigation.navigate("PerfilCrianca")}
                >
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={darkMode ? "#ffffffff" : "#161214ff"}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("AdicionarCrianca")}
          >
            <View style={styles.addButtonContent}>
              <FontAwesome name="plus" size={20} color="#fff" />
              <Text style={styles.addButtonText}>ADICIONAR CRIANÇA</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
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
  backButton: {
    position: "absolute",
    left: 23,
    bottom: 26,
  },
  scrollContainer: {
    paddingVertical: 20,
  },
  childCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#530b30ff",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 2.25,
  },
  childInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  childTextContainer: {
    marginLeft: 15,
  },
  childName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  childSchool: {
    fontSize: 15,
    marginTop: 2,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#780b47",
    paddingVertical: 15,
    marginHorizontal: 70,
    borderRadius: 28,
    alignItems: "center",
    marginTop: 30,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});
