import { describe, it, expect } from 'vitest';
import {
  calculatePoolSize,
  calculatePasswordEntropy,
  calculatePassphraseEntropy,
  getEntropyRating,
} from '../utils/entropy';
import { CHAR_POOLS, STANDARD_SYMBOLS, COMPATIBLE_SYMBOLS } from '../utils/passwordGenerator';

describe('calculatePoolSize', () => {
  it('correctly calculates total character pool size with standard symbols', () => {
    const totalChars =
      CHAR_POOLS.uppercase.length +
      CHAR_POOLS.lowercase.length +
      CHAR_POOLS.numbers.length +
      STANDARD_SYMBOLS.length;

    const fullPool = calculatePoolSize({
      length: 16,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
      symbolMode: 'standard',
    });

    expect(fullPool).toBe(totalChars);
    expect(fullPool).toBe(26 + 26 + 10 + 27); // 89 total characters
  });

  it('correctly calculates pool size with compatible symbols mode', () => {
    const compatPool = calculatePoolSize({
      length: 16,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
      symbolMode: 'compatible',
    });

    expect(compatPool).toBe(26 + 26 + 10 + COMPATIBLE_SYMBOLS.length);
    expect(compatPool).toBe(26 + 26 + 10 + 14); // 76 total characters
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

describe('calculatePasswordEntropy', () => {
  it('returns 0 for length 0 or poolSize <= 1', () => {
    expect(calculatePasswordEntropy(0, 89)).toBe(0);
    expect(calculatePasswordEntropy(16, 0)).toBe(0);
    expect(calculatePasswordEntropy(16, 1)).toBe(0);
  });

  it('computes entropy according to search-space formula length * log2(poolSize)', () => {
    // 16 characters with pool of 89:
    // log2(89) = ~6.4757
    // 16 * 6.4757 ≈ 104 bits
    const entropy = calculatePasswordEntropy(16, 89);
    expect(entropy).toBe(104);

    // 12 characters with alphanumeric pool of 62:
    // log2(62) = ~5.954
    // 12 * 5.954 ≈ 71 bits
    const entropyAlphaNum = calculatePasswordEntropy(12, 62);
    expect(entropyAlphaNum).toBe(71);
  });
});

describe('calculatePassphraseEntropy', () => {
  it('computes passphrase entropy based on wordlist size and word count', () => {
    // 4 words with 400 words dictionary:
    // log2(400) ≈ 8.64 bits
    // 4 * 8.64 = ~35 bits
    const bits4 = calculatePassphraseEntropy({
      wordCount: 4,
      separator: '-',
      capitalize: true,
      includeNumber: false,
    }, 400);

    expect(bits4).toBe(35);
  });

  it('adds numeric suffix entropy when includeNumber is true', () => {
    // 4 words from 400 words + 2-digit number (90 possibilities):
    // 34.57 + log2(90) (6.49) = ~41 bits
    const bitsWithNum = calculatePassphraseEntropy({
      wordCount: 4,
      separator: '-',
      capitalize: true,
      includeNumber: true,
    }, 400);

    expect(bitsWithNum).toBe(41);
  });

  it('returns 0 for 0 wordCount', () => {
    const bits0 = calculatePassphraseEntropy({
      wordCount: 0,
      separator: '-',
      capitalize: true,
      includeNumber: false,
    }, 400);

    expect(bits0).toBe(0);
  });
});

describe('getEntropyRating', () => {
  it('returns search-space complexity descriptions without misleading crack-time claims', () => {
    expect(getEntropyRating(20).label).toBe('Very Low');
    expect(getEntropyRating(35).label).toBe('Low');
    expect(getEntropyRating(55).label).toBe('Moderate');
    expect(getEntropyRating(75).label).toBe('High');
    expect(getEntropyRating(110).label).toBe('Very High');

    // Check that complexityTier uses search-space representation (~2^X)
    expect(getEntropyRating(75).complexityTier).toContain('2^75');
  });
});
