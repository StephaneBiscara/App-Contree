import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import RoundModal from './screens/RoundModal';
import HistoriqueScreen from './screens/HistoriqueScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="RoundModal" component={RoundModal} options={{ presentation: 'modal' }} />
        <Stack.Screen name="Historique" component={HistoriqueScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
