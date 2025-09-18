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

// Importação corrigida dos ícones
import { FontAwesome } from "@react-native-vector-icons/fontawesome";

// Telas
import Comeco from "./screens/comeco";
import Login from "./screens/RealizarLogin";
import Cadastrar from "./screens/RealizarCadastro";
import HomeScreen from "./screens/HomeScreen";
import Notificacoes from "./screens/Notificacoes";
import PerfilResponsavel from "./screens/PerfilResponsavel";
import EsqueceuSenha from "./screens/esqueceuSenha";
import Localizacao from "./screens/Localizacao";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Menu lateral personalizado
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
        <FontAwesome5 name="times" size={24} color="#fff" solid />
      </TouchableOpacity>

      <DrawerItem
        label="Início"
        labelStyle={styles.label}
        icon={() => <FontAwesome5 name="home" size={20} color="#fff" solid />}
        onPress={() => props.navigation.navigate("Início")}
      />
      <DrawerItem
        label="Notificações"
        labelStyle={styles.label}
        icon={() => <FontAwesome5 name="bell" size={20} color="#fff" solid />}
        onPress={() => props.navigation.navigate("Notificações")}
      />
      <DrawerItem
        label="Perfil"
        labelStyle={styles.label}
        icon={() => <FontAwesome5 name="user" size={20} color="#fff" solid />}
        onPress={() => props.navigation.navigate("Perfil")}
      />
      <DrawerItem
        label="Localização"
        labelStyle={styles.label}
        icon={() => <FontAwesome5 name="map-marker-alt" size={20} color="#fff" solid />}
        onPress={() => props.navigation.navigate("Localização")}
      />

      <View style={styles.bottomArea}>
        <TouchableOpacity style={styles.logoutRow}>
          <FontAwesome5
            name="door-open"
            size={18}
            color="#fff"
            style={{ marginRight: 8 }}
            solid
          />
          <Text style={styles.logoutText}>SAIR</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

// Navegador lateral após login
function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: "#000" },
        headerTintColor: "#fff",
        headerTitle: "",
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <FontAwesome5
              name="bars"
              size={28}
              color="#fff"
              style={{ marginLeft: 15 }}
              solid
            />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <Image
            source={require("./src/assets/logo_geosync_fundotransparente.png")}
            style={{ width: 55, height: 55, marginRight: 15 }}
            resizeMode="contain"
          />
        ),
        drawerStyle: { backgroundColor: "#000" },
      })}
    >
      <Drawer.Screen name="Início" component={HomeScreen} />
      <Drawer.Screen name="Notificações" component={Notificacoes} />
      <Drawer.Screen name="Perfil" component={PerfilResponsavel} />
      <Drawer.Screen name="Localização" component={Localizacao} />
    </Drawer.Navigator>
  );
}

// Navegação principal
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Comeco" component={Comeco} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Cadastrar" component={Cadastrar} />
        <Stack.Screen name="Main" component={DrawerNavigator} />
        <Stack.Screen name="EsqueceuSenha" component={EsqueceuSenha} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Estilos
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
  },
  label: {
    color: "#fff",
    fontSize: 16,
    marginLeft: -20,
  },
  bottomArea: {
    marginTop: "auto",
    marginBottom: 30,
    paddingLeft: 20,
  },
  logoutRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

