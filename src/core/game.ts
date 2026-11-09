export const createDigitValidator = (base: number) => {
  const validChars = '0123456789abcdefghijklmnopqrstuvwxyz'.slice(0, base);

  return (char: string): boolean => {
    if (char.length !== 1) return false;
    return validChars.includes(char.toLowerCase());
  };
};

export const isValidGuess = (
  guess: string,
  length: number,
  base: number
): boolean => {
  if (guess.length !== length) return false;

  const validator = createDigitValidator(base);
  const chars = guess.toLowerCase().split('');

  const allValid = chars.every(validator);
  const isUnique = new Set(chars).size === length;

  return allValid && isUnique;
};

export const generateSecret = (
  length: number,
  base: number,
  random: () => number = Math.random
): string => {
  const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz'
    .slice(0, base)
    .split('');

  const build = (current: string[]): string[] => {
    if (current.length === length) return current;

    const randomIndex = Math.floor(random() * alphabet.length);
    const nextChar = alphabet[randomIndex];

    if (current.includes(nextChar)) {
      return build(current);
    }

    return build([...current, nextChar]);
  };

  return build([]).join('');
};
