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
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function LoginScreen({ navigation }) {

  return (
    <LinearGradient colors={["#000000", "#780b47"]} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.innerContainer}
      >
         <TouchableOpacity
      style={styles.backButton}
      onPress={() => navigation.navigate("Comeco")}
    >
      <FontAwesome name="chevron-left" size={28} color="#fff" />
    </TouchableOpacity>

        <Image
          source={require("../src/assets/logo_geosync_fundotransparente.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>CADASTRO</Text>



        <View style={styles.inputContainer}>

          <Text style={styles.label}>NOME:</Text>
          <TextInput
            style={styles.input}
            placeholderTextColor="#ccc"
            keyboardType="name-address"
          />


          <Text style={styles.label}>EMAIL:</Text>
          <TextInput
            style={styles.input}
            placeholderTextColor="#ccc"
            keyboardType="email-address"
          />

          <Text style={styles.label}>SENHA:</Text>
          <TextInput
            style={styles.input}
            placeholderTextColor="#ccc"
            secureTextEntry={true}
          />

          <TouchableOpacity style={styles.forgotButton}>
            <Text style={styles.forgotText}
             onPress={() => navigation.navigate("EsqueceuSenha")} >Esqueceu a senha?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.loginButton}
        onPress={() => navigation.replace("Main")}

        >
          <Text style={styles.loginText}>ENTRAR</Text>
        </TouchableOpacity>

        <Text style={styles.registerText}>
          Já possui conta? <Text style={styles.registerLink}
           onPress={() => navigation.navigate("Login")} >Entrar</Text>
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
   backButton: {
    backgroundColor: "#ffffffff",
    padding: 3,
    borderRadius: 50,
    position: "absolute",
    top: 40,
    left: 20,
  },
  innerContainer: {
    flex: 1,
    padding: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: -80,
    marginTop: -50,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 90,
    marginTop: -40,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 30,
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
    fontSize: 12,
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
  },
  registerText: {
    color: "#fff",
    fontSize: 14,
  },
  registerLink: {
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});