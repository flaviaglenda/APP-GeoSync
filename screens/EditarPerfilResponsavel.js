import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function EditarResponsavel({ navigation }) {
  const [email, setEmail] = useState("miguel@gmail.com");
  const [telefone, setTelefone] = useState("+55 12 99684-3436");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#000000ff", "#780b47"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Text style={styles.headerText}>EDITAR PERFIL</Text>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("PerfilResponsavel")}
        >
          <FontAwesome name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.avatarContainer}>
          <View style={styles.avatarWrapper}>
            <Ionicons name="person" size={120} color="#000" />
            <TouchableOpacity style={styles.editIcon}>
              <FontAwesome name="pencil" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.editPhotoText}>Alterar foto</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>EMAIL:</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <Text style={[styles.label, { marginTop: 20 }]}>TELEFONE:</Text>
          <TextInput
            style={styles.input}
            value={telefone}
            onChangeText={setTelefone}
            keyboardType="phone-pad"
          />

          <Text style={[styles.label, { marginTop: 20 }]}>NOVA SENHA:</Text>
          <TextInput
            style={styles.input}
            value={novaSenha}
            onChangeText={setNovaSenha}
            secureTextEntry
            placeholder="Digite sua nova senha"
          />

          <Text style={[styles.label, { marginTop: 20 }]}>
            CONFIRMAR NOVA SENHA:
          </Text>
          <TextInput
            style={styles.input}
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            secureTextEntry
            placeholder="Confirme sua nova senha"
          />
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.saveButtonText}>SALVAR</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
  },
  header: {
    marginTop: -55,
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
    left: 20,
    bottom: 25,
  },
  scrollContent: {
    paddingBottom: 50,
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  avatarWrapper: {
    position: "relative",
  },
  editIcon: {
    position: "absolute",
    bottom: 10,
    right: -17,
    backgroundColor: "#780b47",
    borderRadius: 20,
    padding: 6,
  },
  editPhotoText: {
    marginTop: 5,
    fontSize: 14,
    color: "#000",
  },
  inputContainer: {
    marginHorizontal: 30,
    marginTop: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#f2f2f2",
    color: "#000",
  },
  saveButton: {
    backgroundColor: "#780b47",
    paddingVertical: 12,
    marginHorizontal: 130,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
