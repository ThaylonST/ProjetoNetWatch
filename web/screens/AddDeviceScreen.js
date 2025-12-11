// mobile/screens/AddDeviceScreen.js
import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { TextInput, Button, HelperText } from 'react-native-paper';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:3000'; // ← MESMO IP

export default function AddDeviceScreen({ navigation, route }) {
  const [name, setName] = useState('');
  const [ip, setIp] = useState(route.params?.ip || '');
  const [type, setType] = useState('');

  const salvar = async () => {
    if (!name || !ip) return Alert.alert("Erro", "Nome e IP são obrigatórios");

    try {
      await axios.post(`${API_URL}/devices`, { name, ip_address: ip, type });
      Alert.alert("Sucesso", "Dispositivo cadastrado!");
      navigation.goBack();
    } catch (e) {
      Alert.alert("Erro", "Não foi possível salvar");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput label="Nome" value={name} onChangeText={setName} mode="outlined" style={{ marginBottom: 12 }} />
      <TextInput label="IP" value={ip} onChangeText={setIp} mode="outlined" style={{ marginBottom: 12 }} />
      <TextInput label="Tipo (opcional)" value={type} onChangeText={setType} mode="outlined" />
      <Button mode="contained" onPress={salvar} style={{ marginTop: 20 }}>Salvar</Button>
    </View>
  );
}