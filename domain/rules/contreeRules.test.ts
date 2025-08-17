import { computeRoundScore, Mode, RoundInput } from './contreeRules';

describe('computeRoundScore - mode points faits', () => {
  it('calcule un contrat réussi sans annonces', () => {
    const round: RoundInput = {
      taker: 'A', contractValue: 100, isCapot: false, suit: 'Cœur',
      pointsTaken: 110, contre: false, surcontre: false,
      beloteA: true, beloteB: false
    };
    const result = computeRoundScore(round, 'POINTS_FAITS');
    expect(result.contractAchieved).toBe(true);
    expect(result.scoreA).toBe(210);
    expect(result.scoreB).toBe(70);
    expect(result.summary).toContain('Équipe A réussit contrat 100 Cœur');
  });
  it('calcule un contrat chuté avec Contrée', () => {
    const round: RoundInput = {
      taker: 'A', contractValue: 120, isCapot: false, suit: 'Trèfle',
      pointsTaken: 100, contre: true, surcontre: false,
      beloteA: false, beloteB: false
    };
    const result = computeRoundScore(round, 'POINTS_FAITS');
    expect(result.contractAchieved).toBe(false);
    expect(result.scoreA).toBe(0);
    expect(result.scoreB).toBe(400);
    expect(result.summary).toContain('Équipe A chute contrat 120 Trèfle contré');
  });
  it('gère une annonce de Capot réussie', () => {
    const round: RoundInput = {
      taker: 'B', contractValue: 250, isCapot: true, suit: 'Pique',
      pointsTaken: 252, contre: false, surcontre: false,
      beloteA: false, beloteB: true
    };
    const result = computeRoundScore(round, 'POINTS_FAITS');
    expect(result.contractAchieved).toBe(true);
    expect(result.scoreA).toBe(0);
    expect(result.scoreB).toBe(520);
    expect(result.summary).toContain('Équipe B réussit Capot Pique');
  });
  it('gère une annonce de Capot chutée', () => {
    const round: RoundInput = {
      taker: 'A', contractValue: 250, isCapot: true, suit: 'Cœur',
      pointsTaken: 200, contre: false, surcontre: false,
      beloteA: true, beloteB: false
    };
    const result = computeRoundScore(round, 'POINTS_FAITS');
    expect(result.contractAchieved).toBe(false);
    expect(result.scoreA).toBe(0);
    expect(result.scoreB).toBe(430);
    expect(result.summary).toContain('Équipe A chute Capot Cœur');
  });
});

describe('computeRoundScore - mode points annoncés', () => {
  it('attribue uniquement les points du contrat (réussite)', () => {
    const round: RoundInput = {
      taker: 'B', contractValue: 90, isCapot: false, suit: 'Carreau',
      pointsTaken: 100, contre: false, surcontre: false,
      beloteA: false, beloteB: true
    };
    const result = computeRoundScore(round, 'POINTS_ANNONCES');
    expect(result.contractAchieved).toBe(true);
    expect(result.scoreA).toBe(0);
    expect(result.scoreB).toBe(90);
    expect(result.summary).toContain('Équipe B réussit contrat 90 Carreau');
  });
  it('attribue uniquement les points du contrat (chute contrée)', () => {
    const round: RoundInput = {
      taker: 'A', contractValue: 110, isCapot: false, suit: 'Pique',
      pointsTaken: 80, contre: true, surcontre: false,
      beloteA: true, beloteB: false
    };
    const result = computeRoundScore(round, 'POINTS_ANNONCES');
    expect(result.contractAchieved).toBe(false);
    expect(result.scoreA).toBe(0);
    expect(result.scoreB).toBe(220);
    expect(result.summary).toContain('Équipe A chute contrat 110 Pique contré');
  });
  it('ne compte pas la Belote dans le score final', () => {
    const inputBase: RoundInput = {
      taker: 'B', contractValue: 80, isCapot: false, suit: 'Trèfle',
      pointsTaken: 90, contre: false, surcontre: false,
      beloteA: false, beloteB: false
    };
    const inputBelote: RoundInput = { ...inputBase, beloteB: true, pointsTaken: 110 };
    const res1 = computeRoundScore(inputBase, 'POINTS_ANNONCES');
    const res2 = computeRoundScore(inputBelote, 'POINTS_ANNONCES');
    expect(res1.scoreA).toEqual(res2.scoreA);
    expect(res1.scoreB).toEqual(res2.scoreB);
  });
});