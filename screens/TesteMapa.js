import React from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function TesteMapa() {
  const region = {
    latitude: -23.099,
    longitude: -45.707,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <MapView
          style={StyleSheet.absoluteFillObject}
          initialRegion={region}
          onMapReady={() => console.log("✅ Mapa carregou!")}
        >
          <Marker coordinate={{ latitude: -23.099, longitude: -45.707 }} title="Teste" />
        </MapView>
      </View>
    </GestureHandlerRootView>
  );
}
