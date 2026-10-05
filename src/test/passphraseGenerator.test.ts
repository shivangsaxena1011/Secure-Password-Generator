import { describe, it, expect } from 'vitest';
import { generatePassphrase } from '../utils/passphraseGenerator';

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
});
