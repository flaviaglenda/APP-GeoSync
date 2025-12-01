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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useTheme } from "../ThemeContext";
import { supabase } from "../supabaseConfig";
import { useFocusEffect } from '@react-navigation/native';

export default function GerenciarCriancas({ navigation }) {
    const { darkMode, theme } = useTheme();

    const [criancas, setCriancas] = useState([]);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        buscarCriancas();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            buscarCriancas();
        }, [])
    );

    async function buscarCriancas() {
        setCarregando(true);

        // Obtém o usuário logado
        const { data: userData } = await supabase.auth.getUser();
        const user = userData?.user;

        if (!user) {
            console.log("Nenhum usuário logado.");
            setCarregando(false);
            return;
        }

        const { data, error } = await supabase
            .from("criancas")
            .select("*")
            .eq("usuario_id", user.id); // Filtra as crianças do responsável

        if (error) {
            console.log("Erro ao buscar crianças:", error);
        } else {
            setCriancas(data);
        }

        setCarregando(false);
    }

    async function removerCrianca(id) {
        await supabase.from("criancas").delete().eq("id", id);
        buscarCriancas();
    }
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

                <LinearGradient
                    colors={["#5f0738", "#5f0738"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.header}
                >

                    <Text style={styles.headerText}>RASTREADORES</Text>
                </LinearGradient>

                {carregando ? (
                    <Text style={{ textAlign: "center", marginTop: 40, fontSize: 18 }}>
                        Carregando crianças...
                    </Text>
                ) : (
                    <ScrollView contentContainerStyle={styles.scrollContainer}>
                        {criancas.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={[
                                    styles.childCard,
                                    { backgroundColor: darkMode ? "#0d1727ff" : "#fff" },
                                ]}
                                onPress={() =>
                                    navigation.navigate("Localizacao", {
                                        id: item.id,
                                        nome: item.nome,
                                        escola: item.escola,
                                    })
                                }
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

                                </View>
                            </TouchableOpacity>
                        ))}


                    </ScrollView>
                )}
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
    }, header: {
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
