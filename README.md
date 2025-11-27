# 🛰️ GeoSync — Monitoramento Escolar em Tempo Real

O **GeoSync** é um sistema completo de rastreamento escolar que integra hardware, nuvem e aplicativo mobile para oferecer segurança, precisão e acompanhamento em tempo real do trajeto dos alunos. A solução combina dispositivos GPS, processamento em nuvem e um app intuitivo para pais e responsáveis.

---

## Como rodar o projeto?

- git clone https://github.com/flaviaglenda/APP-GeoSync
- cd geosync

- npm install

- npx expo start ou npx expo start --tunnel


## 🚀 Visão Geral

A plataforma funciona reunindo três camadas principais:

- **Hardware (NEO-6M + microcontrolador Wi-Fi/Bluetooth)** responsável por capturar e enviar os dados de localização.
- **Supabase**, que serve como banco de dados em nuvem, com autenticação, APIs e recursos de tempo real.
- **Aplicativo mobile em React Native**, onde pais visualizam o trajeto em tempo real, histórico e alertas.

O objetivo é proporcionar um monitoramento seguro, confiável e simples de acompanhar.

---

## 🛠️ Hardware — NEO-6M + MCU

O módulo GPS **NEO-6M**, integrado a um microcontrolador com Wi-Fi/Bluetooth, coleta:

- 📍 Coordenadas de GPS  
- 🕒 Horário da coleta  
- ⚠️ Eventos de abertura fora do horário/local permitido  

Após coletados, os dados são enviados para o **Supabase**, onde são processados e armazenados.

---

## ☁️ Backend — Supabase

O Supabase é utilizado para:

- Armazenamento de localização em tempo real  
- Registro de histórico de rotas  
- Emissão de alertas automáticos  
- Sistema de autenticação de usuários  
- APIs rápidas com suporte a WebSockets (Realtime)

A comunicação é segura e protegida com políticas RLS.

---

## 📱 Aplicativo Mobile — React Native

O app, desenvolvido em **React Native**, permite:

- Ver o trajeto em tempo real  
- Receber alertas no celular  
- Consultar histórico de rotas  
- Navegar por uma interface simples e responsiva  

Compatível com **Android e iOS**.



