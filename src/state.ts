import { GuessResult } from './core/game';

export interface GameSettings {
  length: number;
  base: number;
}

export interface HistoryEntry {
  guess: string;
  result: GuessResult;
}

export interface GameState {
  status: 'SETTINGS' | 'PLAYING' | 'WON';
  settings: GameSettings;
  secret: string;
  history: readonly HistoryEntry[];
  startTime: number | null;
  duration: number | null;
}

export const createInitialState = (): GameState => ({
  status: 'SETTINGS',
  settings: { length: 4, base: 10 },
  secret: '',
  history: [],
  startTime: null,
  duration: null,
});

export const updateSettings = (
  state: GameState,
  newSettings: Partial<GameSettings>
): GameState => ({
  ...state,
  settings: { ...state.settings, ...newSettings },
});

export const startNewRound = (state: GameState, secret: string): GameState => ({
  ...state,
  status: 'PLAYING',
  secret,
  history: [],
  startTime: Date.now(),
  duration: null,
});

export const addGuessAttempt = (
  state: GameState,
  guess: string,
  result: GuessResult
): GameState => {
  const updatedHistory = [...state.history, { guess, result }];
  const isWon = result.bulls === state.settings.length;

  return {
    ...state,
    history: updatedHistory,
    status: isWon ? 'WON' : state.status,
    duration:
      isWon && state.startTime
        ? Math.floor((Date.now() - state.startTime) / 1000)
        : state.duration,
  };
};
