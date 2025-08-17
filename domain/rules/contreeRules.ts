/**
 * Logique de calcul des scores pour une manche de Contrée (Belote Contrée).
 */
export type Team = 'A' | 'B';
export type Mode = 'POINTS_FAITS' | 'POINTS_ANNONCES';
export type Suit = 'Pique' | 'Trèfle' | 'Carreau' | 'Cœur' | 'SA' | 'TA';  // SA = Sans Atout, TA = Tout Atout

export interface RoundInput {
  taker: Team;
  contractValue: number;    // valeur du contrat (80 à 160, ou 250 pour un Capot)
  isCapot?: boolean;
  suit: Suit;
  pointsTaken: number;      // Points réalisés par l'équipe preneuse (incluant Belote/Rebelote et Dix de der éventuels)
  contre?: boolean;
  surcontre?: boolean;
  beloteA?: boolean;
  beloteB?: boolean;
}

export interface RoundResult {
  scoreA: number;
  scoreB: number;
  contractAchieved: boolean;
  summary: string;
}

/**
 * Calcule le score d'une manche à partir des données de saisie et du mode de comptage.
 * Renvoie les points marqués par l'équipe A et l'équipe B, ainsi qu'un résumé formaté.
 */
export function computeRoundScore(input: RoundInput, mode: Mode): RoundResult {
  const { taker, suit } = input;
  const multiplier = input.surcontre ? 4 : input.contre ? 2 : 1;
  const isCapotContract = !!input.isCapot;
  // Ajuster la valeur de contrat pour Capot
  let contractValue = input.contractValue;
  if (isCapotContract) {
    contractValue = 250;
  }
  // Gestion de la Belote/Rebelote : pas de belote en Sans Atout
  const beloteA = suit === 'SA' ? false : !!input.beloteA;
  const beloteB = suit === 'SA' ? false : !!input.beloteB;
  const belotePointsA = beloteA ? 20 : 0;
  const belotePointsB = beloteB ? 20 : 0;
  // Points de la preneuse (hors belote)
  const takerIsA = taker === 'A';
  const takerBelotePoints = takerIsA ? belotePointsA : belotePointsB;
  const defenderBelotePoints = takerIsA ? belotePointsB : belotePointsA;
  let takerTrickPoints = input.pointsTaken - takerBelotePoints;
  if (takerTrickPoints < 0) takerTrickPoints = 0;
  // Contrat réussi ?
  let contractAchieved: boolean;
  if (isCapotContract) {
    // Capot réussi si la preneuse a pris tous les points de carte (152)
    contractAchieved = takerTrickPoints === 152;
  } else {
    // Inclure la belote de la preneuse dans le calcul du seuil
    contractAchieved = takerTrickPoints + takerBelotePoints >= input.contractValue;
  }
  // Initialiser scores bruts
  let scoreA = 0;
  let scoreB = 0;
  if (mode === 'POINTS_ANNONCES') {
    // Mode points annoncés : seuls les points du contrat comptent, belote non ajoutée au score final
    if (contractAchieved) {
      // L'équipe preneuse remporte les points du contrat
      const base = isCapotContract ? 500 : contractValue;
      const pointsWon = base * multiplier;
      if (takerIsA) {
        scoreA = pointsWon;
        scoreB = 0;
      } else {
        scoreA = 0;
        scoreB = pointsWon;
      }
    } else {
      // La défense (adverse) remporte les points du contrat
      const base = isCapotContract ? 410 : contractValue;
      const pointsWon = base * multiplier;
      if (takerIsA) {
        scoreA = 0;
        scoreB = pointsWon;
      } else {
        scoreA = pointsWon;
        scoreB = 0;
      }
    }
    // Belote/Rebelote n'affecte pas le score final en mode annonces
  } else {
    // Mode points faits : cumule points réalisés + valeur du contrat
    if (contractAchieved) {
      // Contrat réussi
      let takerRaw = input.pointsTaken; // comprend la Belote de la preneuse si applicable
      let defenderRaw;
      if (isCapotContract) {
        // Capot réussi : l'équipe adverse n'a aucun point de pli
        defenderRaw = 0;
        // Si l'équipe adverse avait annoncé une Belote, elle ne compte pas (aucun pli)
        if (defenderBelotePoints > 0) {
          takerRaw += defenderBelotePoints;
          defenderRaw = 0;
        }
      } else {
        // Points de l'équipe défense (base 162 - points de la preneuse)
        defenderRaw = Math.max(0, 162 - takerTrickPoints) + defenderBelotePoints;
      }
      // Ajouter la valeur du contrat à la preneuse
      takerRaw += contractValue * multiplier;
      if (typeof defenderRaw === 'undefined') defenderRaw = 0;
      if (takerIsA) {
        scoreA = takerRaw;
        scoreB = defenderRaw;
      } else {
        scoreA = defenderRaw;
        scoreB = takerRaw;
      }
    } else {
      // Contrat chuté
      let defendersScore;
      if (multiplier > 1) {
        // Formule atténuée en cas de Contrée/Surcontrée : ne pas doubler le bonus de jeu
        defendersScore = contractValue * multiplier + 160;
      } else {
        defendersScore = contractValue + 160;
      }
      // Ajouter les points de Belote éventuels (toutes Belotes à l'équipe gagnante)
      defendersScore += belotePointsA + belotePointsB;
      if (takerIsA) {
        scoreA = 0;
        scoreB = defendersScore;
      } else {
        scoreA = defendersScore;
        scoreB = 0;
      }
    }
    // Arrondir chaque score à la dizaine la plus proche
    scoreA = Math.round(scoreA / 10) * 10;
    scoreB = Math.round(scoreB / 10) * 10;
  }
  // Construire la phrase de résumé lisible
  const contractDesc = isCapotContract ? 'Capot' : `contrat ${input.contractValue}`;
  const suitStr = suit === 'SA' ? 'Sans Atout' : suit === 'TA' ? 'Tout Atout' : suit;
  const outcomeStr = contractAchieved ? 'réussit' : 'chute';
  let contreStr = '';
  if (input.surcontre) {
    contreStr = ' surcontré';
  } else if (input.contre) {
    contreStr = ' contré';
  }
  const teamStr = taker === 'A' ? 'Équipe A' : 'Équipe B';
  const summary = `${teamStr} ${outcomeStr} ${contractDesc} ${suitStr}${contreStr} – ${scoreA} pts vs ${scoreB} pts`;
  return { scoreA, scoreB, contractAchieved, summary };
}