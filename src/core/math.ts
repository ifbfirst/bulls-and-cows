type PermutationFn = (length: number, base: number) => number;

const memoize = (fn: PermutationFn): PermutationFn => {
  const cache: Record<string, number> = {};

  return (length: number, base: number): number => {
    const key = `${length}:${base}`;
    if (key in cache) return cache[key];

    const result = fn(length, base);
    cache[key] = result;
    return result;
  };
};

const calculatePermutations = (length: number, base: number): number => {
  if (length === 0) return 1;
  if (length > base || base <= 0) return 0;

  return base * countPossibleSecrets(length - 1, base - 1);
};

export const countPossibleSecrets = memoize(calculatePermutations);
