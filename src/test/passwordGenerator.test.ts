import { describe, it, expect } from 'vitest';
import {
  generatePassword,
  validatePasswordOptions,
  AMBIGUOUS_CHARS,
  PRESETS,
  COMPATIBLE_SYMBOLS,
  QUICK_LENGTHS,
} from '../utils/passwordGenerator';
import type { PasswordOptions } from '../types';

describe('validatePasswordOptions', () => {
  it('rejects length below minimum (4)', () => {
    const error = validatePasswordOptions({
      length: 3,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
    });
    expect(error).toBe('Password length must be at least 4.');
  });

  it('rejects length above maximum (128)', () => {
    const error = validatePasswordOptions({
      length: 129,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
    });
    expect(error).toBe('Password length cannot exceed 128.');
  });

  it('rejects configuration with no enabled character categories', () => {
    const error = validatePasswordOptions({
      length: 16,
      uppercase: false,
      lowercase: false,
      numbers: false,
      symbols: false,
    });
    expect(error).toBe('Select at least one character type.');
  });

  it('rejects length smaller than enabled category count', () => {
    const error = validatePasswordOptions({
      length: 2,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
    });
    expect(error).toContain('must be at least');
  });

  it('accepts valid configurations', () => {
    const error = validatePasswordOptions({
      length: 16,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
    });
    expect(error).toBeNull();
  });
});

describe('generatePassword', () => {
  it('generates passwords of exact requested lengths up to 128 characters', () => {
    const lengths = [4, 8, 12, 16, 20, 24, 32, 64, 128];
    lengths.forEach((len) => {
      const pwd = generatePassword({
        length: len,
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true,
      });
      expect(pwd).toHaveLength(len);
    });
  });

  it('strictly respects character category restrictions', () => {
    // Only numbers
    for (let i = 0; i < 20; i++) {
      const pwd = generatePassword({
        length: 16,
        uppercase: false,
        lowercase: false,
        numbers: true,
        symbols: false,
      });
      expect(pwd).toMatch(/^[0-9]+$/);
    }

    // Only lowercase
    for (let i = 0; i < 20; i++) {
      const pwd = generatePassword({
        length: 16,
        uppercase: false,
        lowercase: true,
        numbers: false,
        symbols: false,
      });
      expect(pwd).toMatch(/^[a-z]+$/);
    }

    // No symbols
    for (let i = 0; i < 20; i++) {
      const pwd = generatePassword({
        length: 20,
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: false,
      });
      expect(pwd).toMatch(/^[A-Za-z0-9]+$/);
    }
  });

  it('guarantees at least 1 character from each enabled category', () => {
    const options: PasswordOptions = {
      length: 16,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
    };

    for (let i = 0; i < 100; i++) {
      const pwd = generatePassword(options);
      expect(/[A-Z]/.test(pwd)).toBe(true);
      expect(/[a-z]/.test(pwd)).toBe(true);
      expect(/[0-9]/.test(pwd)).toBe(true);
      expect(/[^A-Za-z0-9]/.test(pwd)).toBe(true);
    }
  });

  it('filters out ambiguous characters when excludeSimilar is true', () => {
    const options: PasswordOptions = {
      length: 32,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
      excludeSimilar: true,
    };

    for (let i = 0; i < 50; i++) {
      const pwd = generatePassword(options);
      for (const char of pwd) {
        expect(AMBIGUOUS_CHARS.has(char)).toBe(false);
      }
    }
  });

  it('supports symbol compatibility mode (standard vs compatible)', () => {
    const compatibleOpts: PasswordOptions = {
      length: 32,
      uppercase: false,
      lowercase: false,
      numbers: false,
      symbols: true,
      symbolMode: 'compatible',
    };

    for (let i = 0; i < 30; i++) {
      const pwd = generatePassword(compatibleOpts);
      for (const ch of pwd) {
        expect(COMPATIBLE_SYMBOLS.includes(ch)).toBe(true);
      }
    }
  });

  it('strictly preserves the avoidRepeated invariant across 250 randomized iterations', () => {
    const options: PasswordOptions = {
      length: 32,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
      avoidRepeated: true,
    };

    for (let i = 0; i < 250; i++) {
      const pwd = generatePassword(options);
      expect(pwd).toHaveLength(32);
      for (let j = 0; j < pwd.length - 1; j++) {
        expect(pwd[j]).not.toBe(pwd[j + 1]);
      }
    }
  });

  it('strictly preserves avoidRepeated invariant with boundary lengths and small pools', () => {
    // Length 4 with only 2 categories and avoidRepeated
    const smallPoolOpts: PasswordOptions = {
      length: 4,
      uppercase: false,
      lowercase: false,
      numbers: true,
      symbols: false,
      avoidRepeated: true,
    };

    for (let i = 0; i < 50; i++) {
      const pwd = generatePassword(smallPoolOpts);
      expect(pwd).toHaveLength(4);
      for (let j = 0; j < pwd.length - 1; j++) {
        expect(pwd[j]).not.toBe(pwd[j + 1]);
      }
    }
  });

  it('throws validation error when options fail validation', () => {
    expect(() =>
      generatePassword({
        length: 2,
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true,
      })
    ).toThrow('Password length must be at least 4.');

    expect(() =>
      generatePassword({
        length: 16,
        uppercase: false,
        lowercase: false,
        numbers: false,
        symbols: false,
      })
    ).toThrow('Select at least one character type.');
  });
});

describe('Presets and Quick Lengths', () => {
  it('defines valid presets with accurate descriptions and lengths', () => {
    expect(PRESETS.quick.options.length).toBe(12);
    expect(PRESETS.quick.options.symbols).toBe(false);

    expect(PRESETS.strong.options.length).toBe(16);
    expect(PRESETS.strong.options.symbols).toBe(true);

    expect(PRESETS['extra-strong'].options.length).toBe(24);
    expect(PRESETS.maximum.options.length).toBe(32);

    Object.values(PRESETS).forEach((preset) => {
      const pwd = generatePassword(preset.options);
      expect(pwd).toHaveLength(preset.options.length);
    });
  });

  it('includes standard quick lengths', () => {
    expect(QUICK_LENGTHS).toEqual([12, 16, 20, 32, 64]);
  });
});
