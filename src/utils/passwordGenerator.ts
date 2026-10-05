import type { PasswordOptions, PresetConfig } from '../types';
import { secureRandomInt, secureShuffle } from './random';

export const MIN_LENGTH = 4;
export const MAX_LENGTH = 128;
export const DEFAULT_LENGTH = 16;

export const CHAR_POOLS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.?/<>~',
} as const;

// Ambiguous characters that are often confused with each other
export const SIMILAR_CHARS = new Set(['i', 'l', '1', 'I', 'o', '0', 'O', '|']);

export const PRESETS: Record<string, PresetConfig> = {
  quick: {
    id: 'quick',
    label: 'Quick',
    description: '12 chars, letters & numbers for fast sign-ups',
    options: {
      length: 12,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: false,
    },
  },
  strong: {
    id: 'strong',
    label: 'Strong',
    description: '16 chars with symbols for everyday security',
    options: {
      length: 16,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
    },
  },
  'extra-strong': {
    id: 'extra-strong',
    label: 'Extra Strong',
    description: '24 chars, comprehensive entropy for sensitive accounts',
    options: {
      length: 24,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
    },
  },
  maximum: {
    id: 'maximum',
    label: 'Maximum',
    description: '32 chars, maximum defense against brute-force attacks',
    options: {
      length: 32,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
    },
  },
};

/**
 * Validates the options for password generation.
 * Returns an error message if invalid, or null if valid.
 */
export function validatePasswordOptions(options: PasswordOptions): string | null {
  if (options.length < MIN_LENGTH) {
    return `Password length must be at least ${MIN_LENGTH}.`;
  }
  if (options.length > MAX_LENGTH) {
    return `Password length cannot exceed ${MAX_LENGTH}.`;
  }

  const enabledCount = [
    options.uppercase,
    options.lowercase,
    options.numbers,
    options.symbols,
  ].filter(Boolean).length;

  if (enabledCount === 0) {
    return 'Select at least one character type.';
  }

  if (options.length < enabledCount) {
    return `Password length must be at least ${enabledCount} when ${enabledCount} character types are selected.`;
  }

  return null;
}

/**
 * Generates a cryptographically secure random password meeting all requirements.
 */
export function generatePassword(options: PasswordOptions): string {
  const validationError = validatePasswordOptions(options);
  if (validationError) {
    throw new Error(validationError);
  }

  // Filter pools based on options and exclusions
  const filterPool = (pool: string): string => {
    if (!options.excludeSimilar) return pool;
    return Array.from(pool)
      .filter((char) => !SIMILAR_CHARS.has(char))
      .join('');
  };

  const activeCategories: { name: string; chars: string }[] = [];

  if (options.uppercase) {
    const chars = filterPool(CHAR_POOLS.uppercase);
    if (chars.length > 0) activeCategories.push({ name: 'uppercase', chars });
  }
  if (options.lowercase) {
    const chars = filterPool(CHAR_POOLS.lowercase);
    if (chars.length > 0) activeCategories.push({ name: 'lowercase', chars });
  }
  if (options.numbers) {
    const chars = filterPool(CHAR_POOLS.numbers);
    if (chars.length > 0) activeCategories.push({ name: 'numbers', chars });
  }
  if (options.symbols) {
    const chars = filterPool(CHAR_POOLS.symbols);
    if (chars.length > 0) activeCategories.push({ name: 'symbols', chars });
  }

  // Fallback in the improbable event that exclusions emptied all categories
  if (activeCategories.length === 0) {
    throw new Error('No characters available with current exclusion filters.');
  }

  const characters: string[] = [];

  // 1. Guarantee character requirements: pick 1 character from each active category
  for (const category of activeCategories) {
    const randomIndex = secureRandomInt(category.chars.length);
    characters.push(category.chars[randomIndex]);
  }

  // 2. Build the combined pool from all enabled categories
  const combinedPool = activeCategories.map((c) => c.chars).join('');

  // 3. Fill the remaining positions
  const remainingCount = options.length - characters.length;
  for (let i = 0; i < remainingCount; i++) {
    if (options.avoidRepeated && characters.length > 0) {
      // Pick a character that doesn't match the immediate previous character
      const lastChar = characters[characters.length - 1];
      let candidate = '';
      let attempts = 0;
      do {
        const randIdx = secureRandomInt(combinedPool.length);
        candidate = combinedPool[randIdx];
        attempts++;
      } while (candidate === lastChar && combinedPool.length > 1 && attempts < 15);
      characters.push(candidate);
    } else {
      const randIdx = secureRandomInt(combinedPool.length);
      characters.push(combinedPool[randIdx]);
    }
  }

  // 4. Securely shuffle the result using cryptographically secure Fisher-Yates
  let shuffledCharacters = secureShuffle(characters);

  // 5. If avoidRepeated is requested, resolve any adjacent duplicates that resulted from shuffle
  if (options.avoidRepeated && shuffledCharacters.length > 1) {
    shuffledCharacters = eliminateConsecutiveDuplicates(shuffledCharacters);
  }

  return shuffledCharacters.join('');
}

/**
 * Resolves adjacent duplicate characters in an array by swapping with compatible positions.
 */
function eliminateConsecutiveDuplicates(chars: string[]): string[] {
  const result = [...chars];
  const n = result.length;
  if (n <= 1) return result;

  for (let i = 0; i < n - 1; i++) {
    if (result[i] === result[i + 1]) {
      // Find a swap index k that does not create new duplicate pairs
      let swapped = false;
      for (let k = 0; k < n; k++) {
        if (
          k !== i &&
          k !== i + 1 &&
          result[k] !== result[i] &&
          (k === 0 || result[k - 1] !== result[i + 1]) &&
          (k === n - 1 || result[k + 1] !== result[i + 1])
        ) {
          const temp = result[i + 1];
          result[i + 1] = result[k];
          result[k] = temp;
          swapped = true;
          break;
        }
      }

      if (!swapped) {
        // Fallback swap candidate
        for (let k = 0; k < n; k++) {
          if (k !== i && k !== i + 1 && result[k] !== result[i]) {
            const temp = result[i + 1];
            result[i + 1] = result[k];
            result[k] = temp;
            break;
          }
        }
      }
    }
  }
  return result;
}
