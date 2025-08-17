import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useGameStore } from '../state/store';

export default function HistoriqueScreen() {
  const history = useGameStore(state => state.history);
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Historique des Parties</Text>
      {history.map((game, index) => {
        const winner = game.scoreA > game.scoreB ? 'Équipe A' : 'Équipe B';
        return (
          <Text key={index} style={styles.entry}>
            Partie {index + 1} – {game.scoreA} pts vs {game.scoreB} pts (Victoire {winner})
          </Text>
        );
      })}
      {history.length === 0 && (
        <Text style={styles.entry}>Aucune partie terminée pour le moment.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 16 },
  title: { color: '#fff', fontSize: 24, marginBottom: 8 },
  entry: { color: '#ccc', fontSize: 16, marginVertical: 4 }
});