// mobile/App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider } from 'react-native-paper';
import HomeScreen from './screens/HomeScreen';
import AddDeviceScreen from './screens/AddDeviceScreen';
import HistoryScreen from './screens/HistoryScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'NetWatch' }} />
          <Stack.Screen name="AddDevice" component={AddDeviceScreen} options={{ title: 'Novo Dispositivo' }} />
          <Stack.Screen name="History" component={HistoryScreen} options={{ title: 'Histórico de Testes' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}