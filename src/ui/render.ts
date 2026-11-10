import { GameState, GameSettings } from '../state';
import { createDigitValidator } from '../core/game';

type ActionHandlers = {
  onSettingsChange: (settings: Partial<GameSettings>) => void;
  onStartGame: () => void;
  onGuessSubmit: (guess: string) => void;
  onReset: () => void;
};

const el = (
  tag: string,
  props: Partial<HTMLElement> & Record<string, unknown> = {},
  children: (HTMLElement | string)[] = []
): HTMLElement => {
  const element = document.createElement(tag);
  Object.assign(element, props);
  children.forEach((child) => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else {
      element.appendChild(child);
    }
  });
  return element;
};

export const renderApp = (
  root: HTMLElement,
  state: GameState,
  handlers: ActionHandlers
) => {
  root.textContent = '';

  const container = el('div', { className: 'game-container' });

  if (state.status === 'SETTINGS') {
    container.appendChild(renderSettingsScreen(state.settings, handlers));
  } else {
    container.appendChild(renderGameScreen(state, handlers));
  }

  root.appendChild(container);
};

const renderSettingsScreen = (
  settings: GameSettings,
  handlers: ActionHandlers
): HTMLElement => {
  const bases = [
    { name: 'bin (2)', value: 2 },
    { name: 'oct (8)', value: 8 },
    { name: 'dec (10)', value: 10 },
    { name: 'hex (16)', value: 16 },
  ];

  const baseSelect = el(
    'select',
    {
      value: settings.base.toString(),
      onchange: (e: Event) => {
        const base = parseInt((e.target as HTMLSelectElement).value, 10);
        const length = base === 2 ? 2 : settings.length;
        handlers.onSettingsChange({ base, length });
      },
    },
    bases.map((b) => el('option', { value: b.value.toString() }, [b.name]))
  ) as HTMLSelectElement;

  baseSelect.value = settings.base.toString();

  const lengthSelect = el(
    'select',
    {
      value: settings.length.toString(),
      onchange: (e: Event) => {
        const length = parseInt((e.target as HTMLSelectElement).value, 10);
        handlers.onSettingsChange({ length });
      },
    },
    Array.from({ length: 5 }, (_, i) => i + 2).map((len) => {
      const disabled = settings.base === 2 && len !== 2;
      return el('option', { value: len.toString(), disabled }, [
        len.toString(),
      ]);
    })
  ) as HTMLSelectElement;

  lengthSelect.value = settings.length.toString();

  const startBtn = el(
    'button',
    {
      className: 'btn-start',
      onclick: handlers.onStartGame,
    },
    ['Начать игру']
  );

  return el('div', { className: 'settings-screen' }, [
    el('h1', {}, ['Быки и Коровы']),
    el('div', { className: 'form-group' }, [
      el('label', {}, ['Система счисления: ', baseSelect]),
    ]),
    el('div', { className: 'form-group' }, [
      el('label', {}, ['Длина секретного числа: ', lengthSelect]),
    ]),
    startBtn,
  ]);
};

const renderGameScreen = (
  state: GameState,
  handlers: ActionHandlers
): HTMLElement => {
  const elements: HTMLElement[] = [];

  elements.push(
    el('h2', {}, [
      `Режим: ${state.settings.length} цифр, основание ${state.settings.base}`,
    ])
  );

  if (state.status === 'PLAYING') {
    const input = el('input', {
      type: 'text',
      maxLength: state.settings.length,
      placeholder: `Введите ${state.settings.length} уник. цифр`,
      oninput: (e: Event) => {
        const target = e.target as HTMLInputElement;
        const validator = createDigitValidator(state.settings.base);

        target.value = target.value.split('').filter(validator).join('');
      },
      onkeydown: (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
          handlers.onGuessSubmit((e.target as HTMLInputElement).value);
        }
      },
    }) as HTMLInputElement;

    const submitBtn = el(
      'button',
      {
        onclick: () => handlers.onGuessSubmit(input.value),
      },
      ['Проверить']
    );

    elements.push(el('div', { className: 'input-block' }, [input, submitBtn]));
  }

  if (state.status === 'WON') {
    elements.push(
      el('div', { className: 'victory-block' }, [
        el('h3', {}, ['Вы угадали число!']),
        el('p', {}, [`Загаданное число: ${state.secret.toUpperCase()}`]),
        el('p', {}, [`Всего попыток: ${state.history.length}`]),
        el('p', {}, [`Затраченное время: ${state.duration} сек.`]),
        el('button', { className: 'btn-reset', onclick: handlers.onReset }, [
          'Играть снова',
        ]),
      ])
    );
  }

  const historyItems = state.history.map((entry, index) =>
    el('li', { className: 'history-item' }, [
      el('span', { className: 'attempt-num' }, [`#${index + 1} `]),
      el('span', { className: 'attempt-guess' }, [
        `${entry.guess.toUpperCase()} `,
      ]),
      el('span', { className: 'badge-bulls' }, [`Быки: ${entry.result.bulls}`]),
      ' ',
      el('span', { className: 'badge-cows' }, [`Коровы: ${entry.result.cows}`]),
    ])
  );

  elements.push(
    el('div', { className: 'history-block' }, [
      el('h4', {}, ['История попыток:']),
      el('ul', { className: 'history-list' }, historyItems),
    ])
  );

  return el('div', { className: 'game-screen' }, elements);
};
