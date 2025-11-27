
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
import { useEffect, useState } from "react";

export default function GerenciarCriancas({ navigation }) {
    const { darkMode } = useTheme();

    // agora o array é um estado pra podermos remover sem banco
    const [criancas, setCriancas] = useState([]);

    const [carregando, setCarregando] = useState(true);
    // função pra remover criança
    const removerCrianca = (id) => {
        setCriancas((prev) => prev.filter((item) => item.id !== id));
    };

    useEffect(() => {
        buscarCriancas();
    }, []);


    async function buscarCriancas() {
        setCarregando(true);

        const { data, error } = await supabase
            .from("criancas")
            .select("*");

        if (error) {
            console.log("Erro ao buscar crianças:", error);
        } else {
            setCriancas(data);
        }

        setCarregando(false);
    }
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
    
                    <Text style={styles.headerText}>Rastreadores</Text>
                </LinearGradient>

                {carregando && (
                    <Text style={{ textAlign: "center", marginTop: 20, fontSize: 18 }}>
                        Carregando crianças...
                    </Text>
                )}


                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {criancas.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={[
                                styles.childCard,
                                { backgroundColor: darkMode ? "#1a1a1a" : "#fff" },
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
                                {item.alerta && (
                                    <FontAwesome
                                        name="exclamation-triangle"
                                        size={25}
                                        color={darkMode ? "#be1a74ff" : "#5b133aff"}
                                        style={{ marginRight: 15 }}
                                    />
                                )}

                                {/* Ícone de informação */}
                                <TouchableOpacity
                                    onPress={() => navigation.navigate("PerfilCrianca")}
                                >
                                    <FontAwesome
                                        name="info-circle"
                                        size={25}
                                        color={darkMode ? "#ffffffff" : "#161214ff"}
                                        style={{ marginRight: 15 }}
                                    />
                                </TouchableOpacity>

                            
                            </View>
                        </TouchableOpacity>
                    ))}

                   
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
