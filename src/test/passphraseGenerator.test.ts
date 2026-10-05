import { describe, it, expect } from 'vitest';
import {
  generatePassphrase,
  validatePassphraseOptions,
  ALLOWED_SEPARATORS,
  PASSPHRASE_WORDS,
} from '../utils/passphraseGenerator';

describe('validatePassphraseOptions', () => {
  it('rejects word count outside 3 to 8', () => {
    expect(
      validatePassphraseOptions({
        wordCount: 2,
        separator: '-',
        capitalize: true,
        includeNumber: true,
      })
    ).toContain('between 3 and 8');

    expect(
      validatePassphraseOptions({
        wordCount: 9,
        separator: '-',
        capitalize: true,
        includeNumber: true,
      })
    ).toContain('between 3 and 8');
  });

  it('rejects disallowed separators', () => {
    expect(
      validatePassphraseOptions({
        wordCount: 4,
        separator: '/',
        capitalize: true,
        includeNumber: true,
      })
    ).toBe('Invalid passphrase separator.');
  });

  it('accepts valid configurations across all supported separators', () => {
    ALLOWED_SEPARATORS.forEach((sep) => {
      const err = validatePassphraseOptions({
        wordCount: 4,
        separator: sep.value,
        capitalize: true,
        includeNumber: true,
      });
      expect(err).toBeNull();
    });
  });
});

describe('generatePassphrase', () => {
  it('generates the specified number of words', () => {
    const passphrase = generatePassphrase({
      wordCount: 4,
      separator: '-',
      capitalize: false,
      includeNumber: false,
    });

    const parts = passphrase.split('-');
    expect(parts).toHaveLength(4);
    parts.forEach((part) => {
      expect(part.length).toBeGreaterThan(2);
      expect(part).toBe(part.toLowerCase());
    });
  });

  it('capitalizes each word when requested', () => {
    const passphrase = generatePassphrase({
      wordCount: 3,
      separator: '.',
      capitalize: true,
      includeNumber: false,
    });

    const parts = passphrase.split('.');
    expect(parts).toHaveLength(3);
    parts.forEach((part) => {
      expect(part[0]).toBe(part[0].toUpperCase());
    });
  });

  it('includes numeric suffix when requested', () => {
    const passphrase = generatePassphrase({
      wordCount: 4,
      separator: '_',
      capitalize: true,
      includeNumber: true,
    });

    const parts = passphrase.split('_');
    expect(parts).toHaveLength(5); // 4 words + 1 number
    const lastPart = parts[4];
    expect(Number(lastPart)).toBeGreaterThanOrEqual(10);
    expect(Number(lastPart)).toBeLessThanOrEqual(99);
  });

  it('guarantees unique words when avoidDuplicates is true across 100 iterations', () => {
    for (let i = 0; i < 100; i++) {
      const passphrase = generatePassphrase({
        wordCount: 6,
        separator: '+',
        capitalize: false,
        includeNumber: false,
        avoidDuplicates: true,
      });

      const words = passphrase.split('+');
      expect(words).toHaveLength(6);
      const uniqueWords = new Set(words);
      expect(uniqueWords.size).toBe(6);
    }
  });

  it('contains a sufficiently large local wordlist with zero duplicates', () => {
    expect(PASSPHRASE_WORDS.length).toBeGreaterThan(300);
    const uniqueWordSet = new Set(PASSPHRASE_WORDS);
    expect(uniqueWordSet.size).toBe(PASSPHRASE_WORDS.length);
  });
});
