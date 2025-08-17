import React from 'react';
import { View, Text } from 'react-native';
import { useGameStore } from '../state/store';
import { GlassButton } from '../ui/GlassButton';

export default function HomeScreen({ navigation }: any) {
  const currentGame = useGameStore(state => state.currentGame);
  const startNewGame = useGameStore(state => state.startNewGame);
  const undoRound = useGameStore(state => state.undoRound);
  if (!currentGame) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#fff', fontSize: 32, marginBottom: 20 }}>App Contrée</Text>
        <GlassButton title="Nouvelle partie" onPress={() => startNewGame()} />
      </View>
    );
  }
  const { scoreA, scoreB, targetScore } = currentGame;
  return (
    <View style={{ flex: 1, backgroundColor: '#000', padding: 20, justifyContent: 'center' }}>
      <Text style={{ color: '#fff', fontSize: 28, textAlign: 'center', marginBottom: 10 }}>
        Équipe A : {scoreA} pts  –  Équipe B : {scoreB} pts
      </Text>
      <GlassButton title="Ajouter une manche" onPress={() => navigation.navigate('RoundModal')} />
      <GlassButton title="Annuler la dernière manche" onPress={() => undoRound()} style={{ marginTop: 10 }} />
      <GlassButton title="Historique des parties" onPress={() => navigation.navigate('Historique')} style={{ marginTop: 10 }} />
      {(scoreA >= targetScore || scoreB >= targetScore) && (
        <Text style={{ color: '#8e44ad', fontSize: 20, textAlign: 'center', marginTop: 20 }}>
          Partie terminée ! {scoreA >= targetScore ? 'Équipe A' : 'Équipe B'} gagne.
        </Text>
      )}
    </View>
  );
}