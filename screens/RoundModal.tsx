import React, { useState } from 'react';
import { View, Text, TextInput, Switch, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useGameStore } from '../state/store';
import { GlassButton } from '../ui/GlassButton';
import { Team, Suit } from '../domain/rules/contreeRules';

export default function RoundModal({ navigation }: any) {
  const addRound = useGameStore(state => state.addRound);
  const [taker, setTaker] = useState<Team>('A');
  const [contractValue, setContractValue] = useState<number>(80);
  const [isCapot, setIsCapot] = useState<boolean>(false);
  const [suit, setSuit] = useState<Suit>('Cœur');
  const [points, setPoints] = useState<string>('');
  const [contre, setContre] = useState<boolean>(false);
  const [surcontre, setSurcontre] = useState<boolean>(false);
  const [beloteA, setBeloteA] = useState<boolean>(false);
  const [beloteB, setBeloteB] = useState<boolean>(false);

  const handleAddRound = () => {
    const pts = parseInt(points, 10) || 0;
    const roundInput = {
      taker,
      contractValue: isCapot ? 250 : contractValue,
      isCapot,
      suit,
      pointsTaken: pts,
      contre,
      surcontre,
      beloteA,
      beloteB
    };
    addRound(roundInput);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nouvelle Manche</Text>
      <Text style={styles.label}>Équipe preneuse</Text>
      <Picker
        selectedValue={taker}
        onValueChange={(value) => setTaker(value as Team)}
        style={styles.picker}
      >
        <Picker.Item label="Équipe A" value="A" />
        <Picker.Item label="Équipe B" value="B" />
      </Picker>
      <Text style={styles.label}>Contrat</Text>
      <TextInput
        style={styles.input}
        placeholder="80"
        placeholderTextColor="#777"
        keyboardType="numeric"
        onChangeText={(text) => setContractValue(parseInt(text, 10) || 80)}
        value={contractValue.toString()}
      />
      <View style={styles.switchRow}>
        <Text style={styles.label}>Capot</Text>
        <Switch value={isCapot} onValueChange={setIsCapot} />
      </View>
      <Text style={styles.label}>Couleur d'atout</Text>
      <Picker
        selectedValue={suit}
        onValueChange={(value) => setSuit(value as Suit)}
        style={styles.picker}
      >
        <Picker.Item label="Cœur" value="Cœur" />
        <Picker.Item label="Carreau" value="Carreau" />
        <Picker.Item label="Pique" value="Pique" />
        <Picker.Item label="Trèfle" value="Trèfle" />
        <Picker.Item label="Sans Atout" value="SA" />
        <Picker.Item label="Tout Atout" value="TA" />
      </Picker>
      <View style={styles.switchRow}>
        <Text style={styles.label}>Contré</Text>
        <Switch value={contre} onValueChange={setContre} />
      </View>
      <View style={styles.switchRow}>
        <Text style={styles.label}>Surcontré</Text>
        <Switch value={surcontre} onValueChange={setSurcontre} />
      </View>
      <View style={styles.switchRow}>
        <Text style={styles.label}>Belote Équipe A</Text>
        <Switch value={beloteA} onValueChange={setBeloteA} />
      </View>
      <View style={styles.switchRow}>
        <Text style={styles.label}>Belote Équipe B</Text>
        <Switch value={beloteB} onValueChange={setBeloteB} />
      </View>
      <Text style={styles.label}>Points réalisés (preneur)</Text>
      <TextInput
        style={styles.input}
        placeholder="0"
        placeholderTextColor="#777"
        keyboardType="numeric"
        onChangeText={setPoints}
        value={points}
      />
      <GlassButton title="Valider la manche" onPress={handleAddRound} style={{ marginTop: 20 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  title: { color: '#fff', fontSize: 24, marginBottom: 20 },
  label: { color: '#fff', fontSize: 18, marginVertical: 8 },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    fontSize: 18,
    padding: 10,
    borderRadius: 6,
    marginVertical: 8
  },
  picker: {
    color: '#fff',
    backgroundColor: '#222',
    marginVertical: 8
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8
  }
});