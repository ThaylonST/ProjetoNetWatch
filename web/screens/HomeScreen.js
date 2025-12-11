// mobile/screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, FlatList, RefreshControl, Modal, Text, TouchableOpacity } from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  FAB,
  Badge,
  Snackbar,
} from 'react-native-paper';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:3000';

export default function HomeScreen({ navigation }) {
  const [devices, setDevices] = useState([]);
  const [scanned, setScanned] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Snackbar
  const [snackVisible, setSnackVisible] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');

  // Modal de exclusão (funciona 100% no web)
  const [modalVisible, setModalVisible] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState(null);

  const loadDevices = async () => {
    try {
      const res = await axios.get(`${API_URL}/devices?t=${Date.now()}`);
      setDevices(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const loadScanned = async () => {
    try {
      const res = await axios.get(`${API_URL}/network/scan`);
      setScanned(res.data.devices || []);
    } catch (e) {
      setScanned([]);
    }
  };

  const testNow = async (id) => {
    try {
      await axios.post(`${API_URL}/devices/${id}/test`);
      await loadDevices();
      showSnack('Teste realizado!');
    } catch (e) {
      showSnack('Erro ao testar', true);
    }
  };

  const showSnack = (msg, error = false) => {
    setSnackMessage(msg);
    setSnackVisible(true);
  };

    const openDeleteModal = (id, name) => {
    setDeviceToDelete({ id, name });
    setModalVisible(true);
  };

   const confirmDelete = async () => {
    if (!deviceToDelete) return;

    try {
      // Primeiro fecha o modal (evita tela branca)
      setModalVisible(false);

      // Depois faz a exclusão
      await axios.post(`${API_URL}/devices/${deviceToDelete.id}/delete`);
      
      // Atualiza a lista
      await loadDevices();

      // Mostra sucesso
      showSnack('Dispositivo excluído com sucesso!');
    } catch (e) {
      console.log("Erro ao excluir:", e);
      showSnack('Erro ao excluir dispositivo', true);
    } finally {
      // Garante que limpa mesmo se der erro
      setDeviceToDelete(null);
    }
  };
  useEffect(() => {
    loadDevices();
    loadScanned();
  }, []);

  useEffect(() => {
    const interval = setInterval(loadDevices, 5000);
    return () => clearInterval(interval);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadDevices(), loadScanned()]);
    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#26007e' }}>
      <FlatList
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        data={devices}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={
          <Title style={{ color: '#fff', fontSize: 24, fontWeight: 'bold', margin: 20 }}>
            Dispositivos Cadastrados
          </Title>
        }
        renderItem={({ item }) => (
          <Card style={{ margin: 12, elevation: 6 }}>
            <Card.Content>
              <Title style={{ fontWeight: 'bold' }}>{item.name}</Title>
              <Paragraph>{item.ip_address} • {item.type || 'Sem tipo'}</Paragraph>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                <Badge status={item.lastStatus === 'up' ? 'success' : 'error'} size={36} />
                <Paragraph style={{ marginLeft: 12, fontWeight: 'bold', color: item.lastStatus === 'up' ? '#4CAF50' : '#F44336' }}>
                  {item.lastStatus === 'up' ? 'Online' : 'Offline'}
                </Paragraph>
              </View>
            </Card.Content>
            <Card.Actions style={{ justifyContent: 'space-between' }}>
              <Button mode="contained" onPress={() => testNow(item.id)}>Testar</Button>
              <Button mode="outlined" onPress={() => navigation.navigate('History', { deviceId: item.id, deviceName: item.name })}>
                Histórico
              </Button>
              <Button mode="contained" buttonColor="#c62828" onPress={() => openDeleteModal(item.id, item.name)}>
                Excluir
              </Button>
            </Card.Actions>
          </Card>
        )}
        ListFooterComponent={
          scanned.length > 0 && (
            <View style={{ padding: 20 }}>
              <Title style={{ color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
                Dispositivos na rede ({scanned.length})
              </Title>
              {scanned.map((d, i) => (
                <Card key={i} style={{ marginVertical: 5 }}>
                  <Card.Content>
                    <Paragraph>{d.ip} • {d.mac}</Paragraph>
                  </Card.Content>
                  <Card.Actions>
                    <Button onPress={() => navigation.navigate('AddDevice', { ip: d.ip })}>
                      Cadastrar
                    </Button>
                  </Card.Actions>
                </Card>
              ))}
            </View>
          )
        }
      />

      <FAB
        icon="plus"
        label="Adicionar"
        style={{ position: 'absolute', margin: 20, right: 0, bottom: 0, backgroundColor: '#6200ee' }}
        onPress={() => navigation.navigate('AddDevice')}
      />

      {/* MODAL DE EXCLUSÃO (FUNCIONA 100% NO WEB) */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 12, width: '80%', maxWidth: 400 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
              Excluir dispositivo
            </Text>
            <Text style={{ fontSize: 16, marginBottom: 20 }}>
              Tem certeza que deseja excluir "{deviceToDelete?.name}"?
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginRight: 15 }}>
                <Text style={{ color: '#666', fontSize: 16 }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmDelete}>
                <Text style={{ color: '#c62828', fontWeight: 'bold', fontSize: 16 }}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Snackbar
        visible={snackVisible}
        onDismiss={() => setSnackVisible(false)}
        duration={3000}
      >
        {snackMessage}
      </Snackbar>
    </View>
  );
}