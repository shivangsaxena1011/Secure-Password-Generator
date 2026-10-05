import { describe, it, expect } from 'vitest';
import { calculatePoolSize, calculateEntropy, getEntropyRating } from '../utils/entropy';
import { CHAR_POOLS } from '../utils/passwordGenerator';

describe('calculatePoolSize', () => {
  it('correctly calculates total character pool size', () => {
    // All categories enabled
    const totalChars =
      CHAR_POOLS.uppercase.length +
      CHAR_POOLS.lowercase.length +
      CHAR_POOLS.numbers.length +
      CHAR_POOLS.symbols.length;

    const fullPool = calculatePoolSize({
      length: 16,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
    });

    expect(fullPool).toBe(totalChars);
    expect(fullPool).toBe(26 + 26 + 10 + 27); // 89 total characters
  });

  it('correctly handles subsets of categories', () => {
    const numbersOnly = calculatePoolSize({
      length: 8,
      uppercase: false,
      lowercase: false,
      numbers: true,
      symbols: false,
    });
    expect(numbersOnly).toBe(10);
  });
});

describe('calculateEntropy', () => {
  it('returns 0 for length 0 or poolSize <= 1', () => {
    expect(calculateEntropy(0, 94)).toBe(0);
    expect(calculateEntropy(16, 0)).toBe(0);
    expect(calculateEntropy(16, 1)).toBe(0);
  });

  it('computes entropy according to Shannon formula length * log2(poolSize)', () => {
    // 16 characters with pool of 90:
    // log2(90) = ~6.49185
    // 16 * 6.49185 ≈ 104 bits
    const entropy = calculateEntropy(16, 90);
    expect(entropy).toBe(104);

    // 12 characters with alphanumeric pool of 62:
    // log2(62) = ~5.954
    // 12 * 5.954 ≈ 71 bits
    const entropyAlphaNum = calculateEntropy(12, 62);
    expect(entropyAlphaNum).toBe(71);
  });
});

describe('getEntropyRating', () => {
  it('returns appropriate labels for different entropy levels', () => {
    expect(getEntropyRating(20).label).toBe('Extremely Low');
    expect(getEntropyRating(35).label).toBe('Low');
    expect(getEntropyRating(55).label).toBe('Moderate');
    expect(getEntropyRating(75).label).toBe('Strong');
    expect(getEntropyRating(110).label).toBe('Extremely Strong');
  });
});
