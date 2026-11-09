import { describe, it, expect } from 'vitest';
import { createDigitValidator, isValidGuess,generateSecret } from '../core/game';

describe('createDigitValidator', () => {
  it('должен правильно валидировать цифры для двоичной системы (base 2)', () => {
    const isBin = createDigitValidator(2);
    expect(isBin('0')).toBe(true);
    expect(isBin('1')).toBe(true);
    expect(isBin('2')).toBe(false);
  });

  it('должен регистронезависимо валидировать hex-символы (base 16)', () => {
    const isHex = createDigitValidator(16);
    expect(isHex('a')).toBe(true);
    expect(isHex('F')).toBe(true);
    expect(isHex('g')).toBe(false);
  });
});

describe('isValidGuess', () => {
  it('должен возвращать true для корректных попыток', () => {
    expect(isValidGuess('1234', 4, 10)).toBe(true);
    expect(isValidGuess('a1', 2, 16)).toBe(true);
  });

  it('должен возвращать false, если длина не совпадает, есть дубликаты или чужие символы', () => {
    expect(isValidGuess('1123', 4, 10)).toBe(false); 
    expect(isValidGuess('123', 4, 10)).toBe(false);  
    expect(isValidGuess('128', 3, 8)).toBe(false);  
  });
});

describe('generateSecret', () => {
  it('должен генерировать предсказуемый секрет на основе детерминированного random', () => {
    let callCount = 0;
    const mockRandom = () => {
      const values = [0.1, 0.5, 0.1, 0.9, 0.3]; 
      return values[callCount++] || 0;
    };

    const secret = generateSecret(3, 10, mockRandom);
    expect(secret).toHaveLength(3);
    expect(new Set(secret).size).toBe(3);
  });
});
