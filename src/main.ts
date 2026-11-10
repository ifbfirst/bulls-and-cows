import './style.css';
import {
  createInitialState,
  updateSettings,
  startNewRound,
  addGuessAttempt,
  GameState,
  GameSettings,
} from './state';
import { generateSecret, evaluateGuess, isValidGuess } from './core/game';
import { renderApp } from './ui/render';

const appRoot = document.getElementById('app');

if (!appRoot) {
  throw new Error('Контейнер #app не найден в index.html');
}

let globalState = createInitialState();

const dispatch = (nextState: GameState) => {
  globalState = nextState;
  renderApp(appRoot, globalState, handlers);
};

const handlers = {
  onSettingsChange: (newSettings: Partial<GameSettings>) => {
    dispatch(updateSettings(globalState, newSettings));
  },
  onStartGame: () => {
    const { length, base } = globalState.settings;
    const secret = generateSecret(length, base);
    dispatch(startNewRound(globalState, secret));
  },
  onGuessSubmit: (guess: string) => {
    const { length, base } = globalState.settings;

    if (!isValidGuess(guess, length, base)) {
      alert(
        `Неверный ввод! Число должно состоять из ${length} уникальных символов для базы ${base}.`
      );
      return;
    }

    const result = evaluateGuess(globalState.secret, guess);
    dispatch(addGuessAttempt(globalState, guess, result));
  },
  onReset: () => {
    dispatch(createInitialState());
  },
};

renderApp(appRoot, globalState, handlers);
