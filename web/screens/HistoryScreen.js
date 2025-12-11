// web/screens/HistoryScreen.js
import React, { useState, useEffect } from 'react';
import { View, FlatList } from 'react-native';
import { Title, List, Badge, Paragraph } from 'react-native-paper';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:3000';

export default function HistoryScreen({ route }) {
  const { deviceId, deviceName } = route.params;
  const [tests, setTests] = useState([]);

  const loadHistory = async () => {
    try {
      const res = await axios.get(`${API_URL}/devices/${deviceId}/tests`);
      setTests(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    loadHistory();
    const interval = setInterval(loadHistory, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 16 }}>
      <Title style={{ fontSize: 24, fontWeight: 'bold', color: '#000', marginBottom: 20 }}>
        Histórico - {deviceName}
      </Title>

      <FlatList
        data={tests}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <List.Item
            title={new Date(item.timestamp).toLocaleString('pt-BR')}
            description={`Latência: ${item.latency ? item.latency + ' ms' : 'N/A'}`}
            titleStyle={{ color: '#000', fontWeight: 'bold' }}
            descriptionStyle={{ color: '#333' }}
            left={() => (
              <Badge
                status={item.status === 'up' ? 'success' : 'error'}
                size={36}
                style={{ alignSelf: 'center' }}
              />
            )}
          />
        )}
        ListEmptyComponent={
          <Paragraph style={{ textAlign: 'center', color: '#666', marginTop: 50 }}>
            Nenhum teste realizado ainda
          </Paragraph>
        }
      />
    </View>
  );
}