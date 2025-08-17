import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';
import { RoundInput, RoundResult, Mode, computeRoundScore } from '../domain/rules/contreeRules';

const storage = new MMKV();

interface Game {
  mode: Mode;
  variant: boolean;
  targetScore: number;
  scoreA: number;
  scoreB: number;
  rounds: RoundResult[];
}

interface AppState {
  currentGame: Game | null;
  history: Game[];
  startNewGame: (mode?: Mode, variant?: boolean, targetScore?: number) => void;
  addRound: (round: RoundInput) => void;
  undoRound: () => void;
}

export const useGameStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentGame: null,
      history: [],
      startNewGame: (mode = 'POINTS_FAITS', variant = false, targetScore = 1500) => {
        set({
          currentGame: {
            mode,
            variant,
            targetScore,
            scoreA: 0,
            scoreB: 0,
            rounds: []
          }
        });
      },
      addRound: (roundInput) => {
        const state = get();
        if (!state.currentGame) return;
        const mode = state.currentGame.mode;
        const result = computeRoundScore(roundInput, mode);
        const newScoreA = state.currentGame.scoreA + result.scoreA;
        const newScoreB = state.currentGame.scoreB + result.scoreB;
        const updatedRounds = [...state.currentGame.rounds, result];
        const updatedGame: Game = { ...state.currentGame, scoreA: newScoreA, scoreB: newScoreB, rounds: updatedRounds };
        if (newScoreA >= state.currentGame.targetScore || newScoreB >= state.currentGame.targetScore) {
          set({
            history: [...state.history, { ...updatedGame }],
            currentGame: null
          });
        } else {
          set({ currentGame: updatedGame });
        }
      },
      undoRound: () => {
        const state = get();
        if (!state.currentGame || state.currentGame.rounds.length === 0) return;
        const rounds = [...state.currentGame.rounds];
        const lastRound = rounds.pop();
        if (!lastRound) return;
        const newScoreA = state.currentGame.scoreA - lastRound.scoreA;
        const newScoreB = state.currentGame.scoreB - lastRound.scoreB;
        set({
          currentGame: { ...state.currentGame, scoreA: newScoreA, scoreB: newScoreB, rounds }
        });
      }
    }),
    {
      name: 'app-contree-store',
      getStorage: () => ({
        setItem: (key, value) => storage.set(key, value),
        getItem: (key) => storage.getString(key) ?? null,
        removeItem: (key) => storage.delete(key)
      })
    }
  )
);