// Map_and_Config_Areas.js
// Arquivo contendo duas telas React Native: MapScreen e ConfigAreas
// Atenção: coloque seu supabaseConfig em ../supabaseConfig (export const supabase = createClient(...))
// Imagem de referência: /mnt/data/2a641b39-690e-4702-b692-6614d02240ea.png

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, FlatList, TextInput } from 'react-native';
import MapView, { Marker, Polyline, Circle } from 'react-native-maps';
import Slider from '@react-native-community/slider';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../ThemeContext';
import { supabase } from '../supabaseConfig';

// NOTE: Este arquivo exporta dois componentes:
// - MapScreen: tela principal com mapa, histórico, criação de áreas e geofence
// - ConfigAreas: tela de configuração para editar raio, nome e remover áreas
// Integração: adicione ambos aos seus navegators (ex: createStackNavigator)

/*
  Dependências que você deve instalar no seu projeto:
  npm install @supabase/supabase-js @react-native-community/slider react-native-maps
  (e seguir instruções de instalação do react-native-maps para seu ambiente)
*/

// ---------------- MapScreen ----------------
export function MapScreen({ navigation }) {
  const { darkMode } = useTheme();

  const [mostrarHistorico, setMostrarHistorico] = useState(false);
  const [historico, setHistorico] = useState([]);
  const [posicao, setPosicao] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const [modoAreaSegura, setModoAreaSegura] = useState(false);
  const [areaSegura, setAreaSegura] = useState(null); // área atual selecionada local (não necessariamente salva)
  const [areasSegurasLista, setAreasSegurasLista] = useState([]); // áreas carregadas do supabase

  // Função Haversine
  function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // metros
    const toRad = (v) => (v * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  async function buscarUltimaLocalizacao() {
    try {
      const { data, error } = await supabase
        .from('gps_dados')
        .select('*')
        .eq('mochila_id', 1)
        .order('data_hora', { ascending: false })
        .limit(1);

      if (!error && data && data.length > 0) {
        setPosicao(data[0]);

        // checar geofence para todas as areas carregadas
        if (areasSegurasLista && areasSegurasLista.length > 0) {
          for (const area of areasSegurasLista) {
            const distancia = calcularDistancia(
              Number(area.latitude),
              Number(area.longitude),
              Number(data[0].latitude),
              Number(data[0].longitude)
            );

            if (distancia > Number(area.raio)) {
              // alerta: saiu da area
              // Você pode melhorar para evitar múltiplos alerts (ex: debounce, estado de alerta)
              Alert.alert('⚠️ Alerta', `A criança saiu da área segura: ${area.nome || 'Área'} (${Math.round(distancia)} m)`);
              break; // ou continue, conforme sua lógica
            }
          }
        }
      }
    } catch (err) {
      console.log('Erro ao buscar última localização:', err);
    } finally {
      setCarregando(false);
    }
  }

  async function carregarHistorico() {
    try {
      const { data, error } = await supabase
        .from('gps_dados')
        .select('*')
        .eq('mochila_id', 1)
        .order('data_hora', { ascending: true });

      if (!error && data) {
        setHistorico(data);
        setMostrarHistorico(true);
      }
    } catch (err) {
      console.log('Erro ao carregar histórico:', err);
    }
  }
 function ativarModoAreaSegura() {
    setModoAreaSegura(true);
    Alert.alert("Modo Área Segura", "Clique no mapa para definir o ponto seguro.");
  }
  async function carregarAreasSeguras() {
    try {
      const { data, error } = await supabase
        .from('areas_seguras')
        .select('*')
        .eq('mochila_id', 1);

      if (!error && data) {
        setAreasSegurasLista(data);
      }
    } catch (err) {
      console.log('Erro ao carregar areas seguras:', err);
    }
  }

  async function salvarAreaSeguraNoBanco(latitude, longitude, raio, nome = 'Área') {
    try {
      // limite de áreas (ex: 5)
      if (areasSegurasLista.length >= 5) {
        Alert.alert('Limite atingido', 'Você já tem o número máximo de áreas (5).');
        return;
      }

      const { data, error } = await supabase
        .from('areas_seguras')
        .insert([{ mochila_id: 1, latitude, longitude, raio, nome }])
        .select();

      if (error) {
        console.log('Erro ao salvar área:', error);
        Alert.alert('Erro', 'Não foi possível salvar a área.');
      } else {
        Alert.alert('Sucesso', 'Área segura salva!');
        // recarrega lista
        carregarAreasSeguras();
      }
    } catch (err) {
      console.log('Erro salvarAreaSeguraNoBanco:', err);
    }
  }

  // Ativa modo de seleção: ao clicar no mapa o centro é definido e salvamos
  function iniciarSelecaoAreaSegura() {
    setModoAreaSegura(true);
    Alert.alert('Modo Área Segura', 'Toque no mapa para definir o centro da área.');
  }

  // Ao carregar a tela
  useEffect(() => {
    buscarUltimaLocalizacao();
    carregarAreasSeguras();

    const interval = setInterval(buscarUltimaLocalizacao, 5000);
    return () => clearInterval(interval);
  }, []);

  // quando areasSegurasLista muda, re-checa para garantir lógica
  useEffect(() => {
    // você pode escolher revalidar posição atual
  }, [areasSegurasLista]);

  const region = {
    latitude: posicao?.latitude || -23.099,
    longitude: posicao?.longitude || -45.707,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? '#000' : '#fff' }]}> 
      {carregando ? (
        <ActivityIndicator size="large" color="#ff0099" style={{ marginTop: 50 }} />
      ) : (
        <MapView
          style={styles.map}
          region={region}
          onPress={(e) => {
            if (modoAreaSegura) {
              const { latitude, longitude } = e.nativeEvent.coordinate;
              const raioPadrao = 150;
              setAreaSegura({ latitude, longitude, raio: raioPadrao });
              setModoAreaSegura(false);
              // Salvar no supabase (ou abrir modal para nome/raio antes)
              salvarAreaSeguraNoBanco(latitude, longitude, raioPadrao, 'Área salva');
            }
          }}
        >
          {posicao && (
            <Marker
              coordinate={{ latitude: posicao.latitude, longitude: posicao.longitude }}
              title="Localização Atual"
              description={`Atualizado em: ${new Date(posicao.data_hora).toLocaleTimeString()}`}
            />
          )}

          {mostrarHistorico && (
            <Polyline
              coordinates={historico.map(p => ({ latitude: p.latitude, longitude: p.longitude }))}
              strokeWidth={4}
              strokeColor="#ff0099"
            />
          )}

          {/* Desenha todas as áreas salvas */}
          {areasSegurasLista.map((area, idx) => (
            <Circle
              key={`area-${idx}`}
              center={{ latitude: Number(area.latitude), longitude: Number(area.longitude) }}
              radius={Number(area.raio)}
              strokeWidth={2}
              strokeColor="#ff0099"
              fillColor="rgba(255,0,153,0.15)"
            />
          ))}

          {/* Desenha a área local selecionada (antes de salvar) */}
          {areaSegura && (
            <Circle
              center={{ latitude: areaSegura.latitude, longitude: areaSegura.longitude }}
              radius={areaSegura.raio}
              strokeWidth={2}
              strokeColor="#00b894"
              fillColor="rgba(0,184,148,0.15)"
            />
          )}
        </MapView>
      )}

     <View
             style={[
               styles.infoContainer,
               { backgroundColor: darkMode ? "#1a1a1a" : "#fff" },
             ]}
           >
             <Text style={[styles.nome, { color: darkMode ? "#f61f7c" : "#c2185b" }]}>Lucas</Text>
             <Text style={[styles.subtitulo, { color: darkMode ? "#ccc" : "#555" }]}>
               SESI-Caçapava
             </Text>
             <Text style={[styles.distancia, { color: darkMode ? "#aaa" : "#777" }]}>
               2 km de distância
             </Text>
     
            
             <View style={styles.statusContainer}>
               <Text style={[styles.statusTitle, { color: darkMode ? "#fff" : "#000" }]}>
                 Status
               </Text>
               <View
                 style={[
                   styles.statusBox,
                   { backgroundColor: darkMode ? "#2a2a2a" : "#000" },
                 ]}
               >
                 <Text style={[styles.mocha, { color: darkMode ? "#fff" : "#fff" }]}>
                   Mochila GeoKid Pro - Lucas
                 </Text>
                 <View style={styles.statusRow}>
                   <MaterialIcons
                     name="wifi-off"
                     size={20}
                     color={darkMode ? "#fff" : "#fff"}
                   />
                   <Text style={[styles.semConexao, { color: darkMode ? "#fff" : "#fff" }]}>
                     {" "}Sem conexão.
                   </Text>
                   <Text style={[styles.bateria, { color: darkMode ? "#ffffffff" : "#fff" }]}>
                     {" "}100%
                   </Text>
                 </View>
                 <Text style={[styles.atualizacao, { color: darkMode ? "#bbb" : "#bbb" }]}>
                   Última atualização há 1 hora.
                 </Text>
                 <Ionicons
                   name="warning-outline"
                   size={32}
                   color="#ff0099"
                   style={styles.iconAlerta}
                 />
               </View>
             </View>
     
             {/* BOTÕES */}
             <TouchableOpacity onPress={carregarHistorico}
               style={[styles.botaoHistorico, { backgroundColor: darkMode ? "#780b47" : "#000" }]}
             >
               <Ionicons name="time-outline" size={20} color="#fff" />
               <Text style={styles.textoBotao}>Histórico</Text>
             </TouchableOpacity>
     
             <TouchableOpacity onPress={ativarModoAreaSegura}
               style={[styles.botaoHistorico, { backgroundColor: "#ff0099" }]}
             >
               <Ionicons name="map-outline" size={20} color="#fff" />
               <Text style={styles.textoBotao}>Criar Área Segura</Text>
             </TouchableOpacity>
             
              <TouchableOpacity
               onPress={() => navigation.navigate("ConfigAreas")}
               style={[styles.botaoHistorico, { backgroundColor: "#333" }]}
             >
               <Ionicons name="settings-outline" size={20} color="#fff" />
     
             </TouchableOpacity>
             
     
           </View>
         </View>
       );
}

// ---------------- ConfigAreas ----------------
export function ConfigAreas({ navigation }) {
  const { darkMode } = useTheme();
  const [areas, setAreas] = useState([]);
  const [raioSelecionado, setRaioSelecionado] = useState(150);
  const [nome, setNome] = useState('');

  async function carregarAreas() {
    try {
      const { data, error } = await supabase.from('areas_seguras').select('*').eq('mochila_id', 1);
      if (!error && data) setAreas(data);
    } catch (err) { console.log(err); }
  }

  async function atualizarArea(id, novoRaio, novoNome) {
    try {
      const { error } = await supabase.from('areas_seguras').update({ raio: novoRaio, nome: novoNome }).eq('id', id);
      if (error) return Alert.alert('Erro', 'Não foi possível atualizar.');
      Alert.alert('Sucesso', 'Área atualizada!');
      carregarAreas();
    } catch (err) { console.log(err); }
  }

  async function excluirArea(id) {
    try {
      const { error } = await supabase.from('areas_seguras').delete().eq('id', id);
      if (error) return Alert.alert('Erro', 'Não foi possível excluir.');
      carregarAreas();
    } catch (err) { console.log(err); }
  }

  useEffect(() => { carregarAreas(); }, []);

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? '#000' : '#fff', padding: 12 }]}> 
      <Text style={[styles.heading, { color: darkMode ? '#fff' : '#000' }]}>Configurações de Áreas</Text>

      <View style={{ marginVertical: 12 }}>
        <Text style={{ color: darkMode ? '#fff' : '#000' }}>Raio padrão: {raioSelecionado} m</Text>
        <Slider
          minimumValue={50}
          maximumValue={1000}
          step={10}
          value={raioSelecionado}
          onValueChange={(v) => setRaioSelecionado(Math.round(v))}
        />
      </View>

      <View style={{ marginVertical: 8 }}>
        <TextInput placeholder="Nome da nova área" value={nome} onChangeText={setNome} style={[styles.input, { backgroundColor: darkMode ? '#222' : '#fff' }]} />
      </View>

      <TouchableOpacity style={[styles.botaoSalvar, { backgroundColor: '#ff0099' }]} onPress={async () => {
        // Insere nova area usando valores do slider e nome
        try {
          if (!nome) return Alert.alert('Preencha o nome');
          const { error } = await supabase.from('areas_seguras').insert([{ mochila_id: 1, latitude: -23.099, longitude: -45.707, raio: raioSelecionado, nome }]);
          if (error) return Alert.alert('Erro ao salvar');
          setNome('');
          carregarAreas();
          Alert.alert('Sucesso', 'Área adicionada (padrão centro atual)');
        } catch (err) { console.log(err); }
      }}>
        <Text style={styles.textoBotao}>Adicionar área (centro padrão)</Text>
      </TouchableOpacity>

      <Text style={[styles.subtitulo, { marginTop: 12, color: darkMode ? '#fff' : '#000' }]}>Áreas Salvas</Text>

      <FlatList
        data={areas}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={[styles.areaItem, { backgroundColor: darkMode ? '#111' : '#f5f5f5' }]}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: darkMode ? '#fff' : '#000', fontWeight: '600' }}>{item.nome || 'Área'}</Text>
              <Text style={{ color: darkMode ? '#ccc' : '#444' }}>Raio: {item.raio} m</Text>
              <Text style={{ color: darkMode ? '#ccc' : '#444' }}>Lat: {item.latitude}, Lon: {item.longitude}</Text>
            </View>

            <View style={{ justifyContent: 'center' }}>
              <TouchableOpacity onPress={() => atualizarArea(item.id, item.raio === raioSelecionado ? item.raio : raioSelecionado, item.nome)} style={{ marginBottom: 8 }}>
                <Ionicons name="pencil-outline" size={20} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => excluirArea(item.id)}>
                <Ionicons name="trash-outline" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    flex: 1
  },
  infoContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  nome: {
    fontWeight: "bold",
    fontSize: 20
  },
  subtitulo: {
    marginTop: 2
  },
  distancia: {
    marginBottom: 10
  },
  statusContainer: {
    marginTop: 10
  },
  statusTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5
  },
  statusBox: {
    borderRadius: 10,
    padding: 15,
    position: "relative",
  },
  mocha: {
    fontWeight: "bold",
    marginBottom: 5
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5
  },
  semConexao: {
    fontSize: 14
  },
  bateria: {
    marginLeft: "auto",
    fontWeight: "bold"
  },
  atualizacao: {
    fontSize: 12
  },
  iconAlerta: {
    fontSize: 30,
    position: "absolute",
    bottom: 10,
    right: 10
  },
  botaoHistorico: {
    flexDirection: "row",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    marginTop: 15,
  },
  textoBotao: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 5
  },
});
