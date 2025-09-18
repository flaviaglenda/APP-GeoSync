import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function EditarResponsavel({ navigation }) {
  const [email, setEmail] = useState("miguel@gmail.com");
  const [telefone, setTelefone] = useState("+55 12 99684-3436");

  return (
    <View style={styles.container}>
    <LinearGradient
            colors={["#000000ff", "#780b47"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.header}
          >
            <Text style={styles.headerText}>EDITAR PERFIL</Text>
          </LinearGradient>
    

      <View style={styles.avatarContainer}>
        <Ionicons name="person-circle-outline" size={100} color="#000" />
        <TouchableOpacity style={styles.editIcon}>
          <Ionicons name="pencil" size={20} color="#fff" />
        </TouchableOpacity>
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
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.saveButtonText}>SALVAR</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
    header: {
    marginTop: -60,
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
    marginVertical: 20,
  },
  editIcon: {
    position: "absolute",
    right: 100,
    bottom: 0,
    backgroundColor: "#780b47",
    borderRadius: 20,
    padding: 5,
  },
  editPhotoText: {
    marginTop: -11,
    fontSize: 14,
    color: "#000",
  },
  inputContainer: {
    marginHorizontal: 30,
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
    marginHorizontal: 30,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
