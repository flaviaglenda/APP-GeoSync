import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Dimensions
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";

export default function LoginScreen({ navigation }) {
  const { height, width } = Dimensions.get("screen");

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate("Comeco");
    }
  };

  return (
    <LinearGradient colors={["#000000", "#780b47"]} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.innerContainer}
      >
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <FontAwesome name="arrow-left" size={28} color="#fff" />
        </TouchableOpacity>

        <Image
          source={require("../src/assets/logo_geosync_fundotransparente.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>ENTRAR</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>EMAIL:</Text>
          <TextInput
            style={[styles.input, { width: width * 0.8 }]}
            placeholderTextColor="#ccc"
            keyboardType="email-address"
          />

          <Text style={styles.label}>SENHA:</Text>
          <TextInput
            style={styles.input}
            placeholderTextColor="#ccc"
            secureTextEntry={true}
          />

          <TouchableOpacity
            style={styles.forgotButton}
            onPress={() => navigation.navigate("EsqueceuSenha")}
          >
            <Text style={styles.forgotText}>Esqueceu a senha?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("Main")}
        >
          <Text style={styles.loginText}>ENTRAR</Text>
        </TouchableOpacity>

        <Text style={styles.registerText}>
          Não possui conta?{" "}
          <Text
            style={styles.registerLink}
            onPress={() => navigation.navigate("Cadastrar")}
          >
            Cadastrar
          </Text>
        </Text>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    flex: 1,
    padding: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 70,
    left: 50,
    padding: 10,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 30,
  },
  logo: {
    width: 400,
    height: 400,
    marginBottom: -120,
    marginTop: -50,
  },
  title: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 90,
    marginTop: -40,
  },
  inputContainer: {
    marginBottom: 40,
  },
  label: {
    color: "#fff",
    marginBottom: 5,
    fontWeight: "bold",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    color: "#fff",
    marginBottom: 20,
    paddingVertical: 5,
  },
  forgotButton: {
    alignSelf: "flex-end",
  },
  forgotText: {
    color: "#ccc",
    fontSize: 17,
  },
  loginButton: {
    backgroundColor: "#ffffffff",
    width: 180,
    paddingVertical: 15,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  loginText: {
    color: "#50062F",
    fontSize: 18,
  },
  registerText: {
    color: "#fff",
    fontSize: 18,
  },
  registerLink: {
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
