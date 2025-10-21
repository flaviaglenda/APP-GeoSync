import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { FontAwesome5 } from "@expo/vector-icons";

import Comeco from "./screens/comeco";
import Login from "./screens/RealizarLogin";
import Cadastrar from "./screens/RealizarCadastro";
import HomeScreen from "./screens/HomeScreen";
import Notificacoes from "./screens/Notificacoes";
import PerfilResponsavel from "./screens/PerfilResponsavel";
import EditarResponsavel from "./screens/EditarPerfilResponsavel";
import EsqueceuSenha from "./screens/esqueceuSenha";
import Localizacao from "./screens/Localizacao";
import ManualMochila from "./screens/ManualMochila";
import GerenciarCrianca from "./screens/GerenciarCrianca";
import PerfilCrianca from "./screens/PerfilCrianca";
import AdicionarCrianca from "./screens/AdicionarCrianca";

import { ThemeProvider } from "./ThemeContext"; 

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
const PerfilStack = createStackNavigator();

function PerfilStackNavigator() {
  return (
    <PerfilStack.Navigator screenOptions={{ headerShown: false }}>
      <PerfilStack.Screen
        name="PerfilResponsavel"
        component={PerfilResponsavel}
      />
      <PerfilStack.Screen
        name="EditarResponsavel"
        component={EditarResponsavel}
      />
      <PerfilStack.Screen
        name="GerenciarCrianca"
        component={GerenciarCrianca}
      />
      <PerfilStack.Screen
        name="PerfilCrianca"
        component={PerfilCrianca}
      />
      <PerfilStack.Screen
        name="AdicionarCrianca"
        component={AdicionarCrianca}
      />
    </PerfilStack.Navigator>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: "#000" },
        headerTintColor: "#fff",
        headerTitle: "",
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <FontAwesome5
              name="bars"
              size={20}
              color="#fff"
              style={{ marginLeft: 15 }}
            />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <Image
            source={require("./src/assets/logo_geosync_fundotransparente.png")}
            style={{
              width: 200,
              height: 200,
              marginRight: -55,
              marginTop: 35,
            }}
            resizeMode="contain"
          />
        ),
        drawerStyle: { backgroundColor: "#000" },
      })}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Início" component={HomeScreen} />
      <Drawer.Screen name="Notificações" component={Notificacoes} />
      <Drawer.Screen name="Perfil" component={PerfilStackNavigator} />
      <Drawer.Screen name="Localização" component={Localizacao} />
      <Drawer.Screen name="Manual" component={ManualMochila} />
    </Drawer.Navigator>
  );
}

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.drawerContent}
    >
      <TouchableOpacity
        style={styles.closeBtn}
        onPress={() => props.navigation.closeDrawer()}
      >
        <FontAwesome5 name="times" size={24} color="#fff" />
      </TouchableOpacity>

      <DrawerItem
        label="Início"
        labelStyle={styles.label}
        icon={() => <FontAwesome5 name="home" size={20} color="#fff" />}
        onPress={() => props.navigation.navigate("Início")}
      />

      <DrawerItem
        label="Notificações"
        labelStyle={styles.label}
        icon={() => <FontAwesome5 name="bell" size={20} color="#fff" />}
        onPress={() => props.navigation.navigate("Notificações")}
      />

      <DrawerItem
        label="Perfil"
        labelStyle={styles.label}
        icon={() => <FontAwesome5 name="user" size={20} color="#fff" />}
        onPress={() => props.navigation.navigate("Perfil")}
      />

      <DrawerItem
        label="Localização"
        labelStyle={styles.label}
        icon={() => (
          <FontAwesome5 name="map-marker-alt" size={20} color="#fff" />
        )}
        onPress={() => props.navigation.navigate("Localização")}
      />

      <DrawerItem
        label="Manual"
        labelStyle={styles.label}
        icon={() => <FontAwesome5 name="book" size={20} color="#fff" />}
        onPress={() => props.navigation.navigate("Manual")}
      />

      <View style={styles.bottomArea}>
        <TouchableOpacity
          style={styles.logoutRow}
          onPress={() => props.navigation.navigate("Comeco")}
        >
          <FontAwesome5
            name="door-open"
            size={18}
            color="#fff"
            style={{ marginRight: 12 }}
          />
          <Text style={styles.logoutText}>SAIR</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

export default function App() {
  return (
    <ThemeProvider> 
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Comeco" component={Comeco} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Cadastrar" component={Cadastrar} />
          <Stack.Screen name="EsqueceuSenha" component={EsqueceuSenha} />
          <Stack.Screen name="Main" component={DrawerNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    backgroundColor: "#000", 
    paddingTop: 20,
  },
  closeBtn: {
    alignItems: "flex-start",
    marginLeft: 15,
    marginBottom: 20,
    marginTop: 30,
  },
  label: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 10,
  },
  bottomArea: {
    marginTop: "auto",
    marginBottom: 30,
    paddingLeft: 20,
  },
  logoutRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
