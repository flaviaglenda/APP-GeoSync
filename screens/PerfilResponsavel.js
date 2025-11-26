import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../ThemeContext"; 

export default function PerfilResponsavel({ navigation }) {
const { darkMode, theme, toggleTheme } = useTheme();

  return (
    <SafeAreaView
     style={[
       styles.safeArea,
       { backgroundColor: theme.colors.background },
     ]}
   >
      <View   style={[styles.container, { backgroundColor: darkMode ? "#192230" : "#e9e9eb" }]}>
        <LinearGradient
          colors={["#000000", "#780b47"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}
        >
          <Text style={styles.headerText}>PERFIL RESPONSÁVEL</Text>
        </LinearGradient>

        <View style={styles.avatarContainer}>
          <View
            style={[
              styles.avatarWrapper,
              { borderColor: "#722044ff" }, 
            ]}
          >
            <Ionicons
              name="person"
              size={110}
              color={darkMode ? "#fff" : "#192230"}
            />
          </View>
        </View>

        <View style={styles.cardsContainer}>
          <TouchableOpacity
            style={[styles.optionCard, { backgroundColor: "#5f0738" }]} 
            onPress={() => navigation.navigate("EditarResponsavel")}
          >
            <MaterialIcons name="edit" size={28} color="#fff" />
            <Text style={[styles.optionText, { color: "#fff" }]}>Editar perfil</Text>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={24}
              color="#d0d0d0"
              style={styles.arrowIcon}
            />
          </TouchableOpacity>

          <View style={[styles.optionCard, { backgroundColor: "#5f0738" }]}> 
            <Ionicons name="moon" size={28} color="#fff" />
            <Text style={[styles.optionText, { color: "#fff" }]}>Modo escuro</Text>
            <Switch
              value={darkMode}
              onValueChange={toggleTheme} 
              trackColor={{ false: "#e5e2e2", true: "#9e9c9c" }}
              thumbColor={darkMode ? "#f9f4f6ff" : "#f4f3f4"} 
              ios_backgroundColor="#3e3e3e"
              style={styles.switchToggle}
            />
          </View>

          <TouchableOpacity
            style={[styles.optionCard, { backgroundColor: "#5f0738" }]}
            onPress={() => navigation.navigate("GerenciarCrianca")}
          >
            <Ionicons name="happy" size={28} color="#fff" />
            <Text style={[styles.optionText, { color: "#fff" }]}>Gerenciar criança</Text>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={24}
              color="#d0d0d0"
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
        </View>
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
  avatarContainer: {
    alignItems: "center",
    marginVertical: 30,
  },
  avatarWrapper: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    marginBottom: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardsContainer: {
    marginTop: 14,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginBottom: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  optionText: {
    marginLeft: 15,
    fontSize: 18,
    flex: 1,
  },
  switchToggle: {
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
  },
  arrowIcon: {
    marginLeft: 10,
  },
});