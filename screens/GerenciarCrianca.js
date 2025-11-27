import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
  Alert,
  Image
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useTheme } from "../ThemeContext";
import { supabase } from "../supabaseConfig";

export default function GerenciarCriancas({ navigation }) {
  const { darkMode, theme } = useTheme();

  const [criancas, setCriancas] = useState([]);

  // 🔥 Atualiza na hora + realtime + ao focar na tela
  useEffect(() => {
    buscarCriancas();

    const canal = supabase
      .channel("realtime-criancas")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "criancas" },
        () => buscarCriancas()
      )
      .subscribe();

    const unsubscribe = navigation.addListener("focus", () => {
      buscarCriancas();
    });

    return () => {
      supabase.removeChannel(canal);
      unsubscribe();
    };
  }, []);

const buscarCriancas = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const userId = session?.user?.id;

  const { data, error } = await supabase
    .from("criancas")
    .select("*")
    .eq("usuario_id", userId)
    .order("id", { ascending: true });

  if (!error) setCriancas(data);
};

  const removerCrianca = (id, nome) => {
    Alert.alert(
      "Excluir criança",
      `Você deseja excluir ${nome}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase
              .from("criancas")
              .delete()
              .eq("id", id);

            if (error) {
              Alert.alert("Erro", "Não foi possível excluir a criança.");
            } else {
              buscarCriancas();
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <View
        style={[
          styles.container,
          { backgroundColor: darkMode ? "#192230" : "#e9e9eb" },
        ]}
      >
        {/* Header */}
        <LinearGradient
          colors={["#5f0738", "#5f0738"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() =>
              navigation.navigate("PerfilResponsavel")
            }
          >
            <FontAwesome name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerText}>GERENCIAR CRIANÇA</Text>
        </LinearGradient>

        {/* Conteúdo */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {criancas.map((item) => (
            <View
              key={item.id}
              style={[
                styles.childCard,
                { backgroundColor: darkMode ? "#0d1727ff" : "#fff" },
              ]}
            >
              <View style={styles.childInfo}>

                {/* FOTO */}
                {item.foto_url ? (
                  <Image
                    source={{ uri: item.foto_url }}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 30,
                      borderWidth: 2,
                      borderColor: darkMode ? "#881052ff" : "#780b47",
                    }}
                  />
                ) : (
                  <Ionicons
                    name="person-circle-outline"
                    size={60}
                    color={darkMode ? "#fff" : "#182437ff"}
                  />
                )}

                {/* NOME + ESCOLA */}
                <View style={styles.childTextContainer}>
                  <Text
                    style={[
                      styles.childName,
                      { color: darkMode ? "#fff" : "#182437ff" },
                    ]}
                  >
                    {item.nome}
                  </Text>

                  <Text
                    style={[
                      styles.childSchool,
                      { color: darkMode ? "#bbb" : "#444" },
                    ]}
                  >
                    {item.escola ? item.escola : "Escola não informada"}
                  </Text>
                </View>
              </View>

              <View style={styles.iconContainer}>
                {/* ALERTA */}
                {item.alerta && (
                  <FontAwesome
                    name="exclamation-triangle"
                    size={25}
                    color={darkMode ? "#be1a74ff" : "#5b133aff"}
                    style={{ marginRight: 15 }}
                  />
                )}

                {/* INFO */}
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("PerfilCrianca", { id: item.id })
                  }
                >
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={darkMode ? "#ffffffff" : "#182437ff"}
                    style={{ marginRight: 15 }}
                  />
                </TouchableOpacity>

                {/* DELETAR */}
                <TouchableOpacity
                  onPress={() => removerCrianca(item.id, item.nome)}
                >
                  <FontAwesome
                    name="trash"
                    size={24}
                    color={darkMode ? "#fff" : "#182437ff"}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {/* Botão adicionar */}
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
    marginTop: 3,
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
