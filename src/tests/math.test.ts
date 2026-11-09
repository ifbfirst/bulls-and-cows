import { describe, it, expect } from 'vitest';
import { countPossibleSecrets } from '../core/math';

describe('countPossibleSecrets', () => {
  it('должен правильно вычислять количество перестановок', () => {
    expect(countPossibleSecrets(4, 10)).toBe(5040); 
    expect(countPossibleSecrets(2, 2)).toBe(2);   
    expect(countPossibleSecrets(0, 10)).toBe(1);   
  });
});
