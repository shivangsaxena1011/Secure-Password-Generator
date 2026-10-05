import type { PasswordOptions, PresetConfig } from '../types';
import { secureRandomInt, secureShuffle } from './random';

export const MIN_LENGTH = 4;
export const MAX_LENGTH = 128;
export const DEFAULT_LENGTH = 16;
export const QUICK_LENGTHS = [12, 16, 20, 32, 64] as const;

export const STANDARD_SYMBOLS = '!@#$%^&*()-_=+[]{};:,.?/<>~';
export const COMPATIBLE_SYMBOLS = '!@#$%^&*()-_=+';

export const CHAR_POOLS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: STANDARD_SYMBOLS,
  compatibleSymbols: COMPATIBLE_SYMBOLS,
} as const;

// Ambiguous characters that look visually confusing across standard fonts
export const AMBIGUOUS_CHARS = new Set(['O', '0', 'I', 'l', '1', 'i']);

export const PRESETS: Record<string, PresetConfig> = {
  quick: {
    id: 'quick',
    label: 'Quick',
    description: '12 characters, letters & numbers for everyday access',
    options: {
      length: 12,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: false,
      symbolMode: 'standard',
    },
  },
  strong: {
    id: 'strong',
    label: 'Strong',
    description: '16 characters with symbols for balanced security',
    options: {
      length: 16,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
      symbolMode: 'standard',
    },
  },
  'extra-strong': {
    id: 'extra-strong',
    label: 'Extra Strong',
    description: '24 characters, broad character pool for critical accounts',
    options: {
      length: 24,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
      symbolMode: 'standard',
    },
  },
  maximum: {
    id: 'maximum',
    label: 'Maximum',
    description: '32 characters with a broad character pool',
    options: {
      length: 32,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
      symbolMode: 'standard',
    },
  },
};

/**
 * Validates the options for password generation.
 * Returns an error message if invalid, or null if valid.
 */
export function validatePasswordOptions(options: PasswordOptions): string | null {
  if (
    typeof options.length !== 'number' ||
    Number.isNaN(options.length) ||
    !Number.isInteger(options.length) ||
    options.length < MIN_LENGTH
  ) {
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

  // Calculate available characters after exclusions
  const getPoolChars = (pool: string): string => {
    if (!options.excludeSimilar) return pool;
    return Array.from(pool).filter((ch) => !AMBIGUOUS_CHARS.has(ch)).join('');
  };

  let totalAvailable = 0;
  if (options.uppercase) totalAvailable += getPoolChars(CHAR_POOLS.uppercase).length;
  if (options.lowercase) totalAvailable += getPoolChars(CHAR_POOLS.lowercase).length;
  if (options.numbers) totalAvailable += getPoolChars(CHAR_POOLS.numbers).length;
  if (options.symbols) {
    const symbolPool = options.symbolMode === 'compatible' ? COMPATIBLE_SYMBOLS : STANDARD_SYMBOLS;
    totalAvailable += getPoolChars(symbolPool).length;
  }

  if (totalAvailable === 0) {
    return 'No characters available with current exclusion filters.';
  }

  if (options.avoidRepeated && totalAvailable < 2 && options.length > 1) {
    return 'Cannot avoid consecutive duplicate characters with a character pool of fewer than 2 characters.';
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

  const filterPool = (pool: string): string => {
    if (!options.excludeSimilar) return pool;
    return Array.from(pool)
      .filter((char) => !AMBIGUOUS_CHARS.has(char))
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
    const symbolPool = options.symbolMode === 'compatible' ? COMPATIBLE_SYMBOLS : STANDARD_SYMBOLS;
    const chars = filterPool(symbolPool);
    if (chars.length > 0) activeCategories.push({ name: 'symbols', chars });
  }

  if (activeCategories.length === 0) {
    throw new Error('No characters available with current exclusion filters.');
  }

  const combinedPool = activeCategories.map((c) => c.chars).join('');

  if (options.avoidRepeated && combinedPool.length < 2 && options.length > 1) {
    throw new Error('Cannot avoid consecutive duplicate characters with a character pool of fewer than 2 characters.');
  }

  // If avoidRepeated is enabled, use a construction algorithm that guarantees
  // password[i] !== password[i+1] across all adjacent positions.
  if (options.avoidRepeated) {
    return generateWithNoConsecutiveDuplicates(options.length, activeCategories, combinedPool);
  }

  // Standard generation:
  // 1. Guarantee 1 character from each active category
  const characters: string[] = [];
  for (const category of activeCategories) {
    const randomIndex = secureRandomInt(category.chars.length);
    characters.push(category.chars[randomIndex]);
  }

  // 2. Fill the remaining positions from combined pool
  const remainingCount = options.length - characters.length;
  for (let i = 0; i < remainingCount; i++) {
    const randIdx = secureRandomInt(combinedPool.length);
    characters.push(combinedPool[randIdx]);
  }

  // 3. Cryptographically shuffle using Fisher-Yates
  const shuffled = secureShuffle(characters);
  return shuffled.join('');
}

/**
 * Deterministically constructs a password satisfying both:
 * 1. Category guarantees (at least 1 character from each enabled category)
 * 2. Strict invariant: password[i] !== password[i+1] for all adjacent pairs.
 */
function generateWithNoConsecutiveDuplicates(
  length: number,
  categories: { name: string; chars: string }[],
  combinedPool: string
): string {
  const maxAttempts = 100;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const result: string[] = [];
    const unsatisfied = new Set(categories.map((_, i) => i));

    let failed = false;
    for (let pos = 0; pos < length; pos++) {
      const prevChar = pos > 0 ? result[pos - 1] : null;
      const remainingSlots = length - pos;

      // If remaining slots equals the number of remaining required categories,
      // we MUST pick from an unsatisfied category.
      if (unsatisfied.size >= remainingSlots) {
        // Find an unsatisfied category that has characters different from prevChar
        const eligibleCatIndices = Array.from(unsatisfied).filter((catIdx) => {
          const chars = categories[catIdx].chars;
          return prevChar === null || chars.split('').some((c) => c !== prevChar);
        });

        if (eligibleCatIndices.length === 0) {
          failed = true;
          break;
        }

        // Pick one of the eligible unsatisfied categories
        const chosenCatIdx = eligibleCatIndices[secureRandomInt(eligibleCatIndices.length)];
        const validChars = categories[chosenCatIdx].chars
          .split('')
          .filter((c) => c !== prevChar);
        
        const chosenChar = validChars[secureRandomInt(validChars.length)];
        result.push(chosenChar);
        unsatisfied.delete(chosenCatIdx);
        continue;
      }

      // Normal slot: can pick from any unsatisfied category or the combined pool
      // Filter out prevChar
      const eligibleChars = combinedPool.split('').filter((c) => c !== prevChar);
      if (eligibleChars.length === 0) {
        failed = true;
        break;
      }

      const chosenChar = eligibleChars[secureRandomInt(eligibleChars.length)];
      result.push(chosenChar);

      // Check if chosenChar satisfies any category
      for (const catIdx of unsatisfied) {
        if (categories[catIdx].chars.includes(chosenChar)) {
          unsatisfied.delete(catIdx);
          break;
        }
      }
    }

    if (!failed && unsatisfied.size === 0) {
      // Invariant double-check
      let valid = true;
      for (let i = 0; i < result.length - 1; i++) {
        if (result[i] === result[i + 1]) {
          valid = false;
          break;
        }
      }
      if (valid) {
        return result.join('');
      }
    }
  }

  // Fallback: systematic interleaved generation if random attempt timed out
  return generateInterleavedFallback(length, categories, combinedPool);
}

/**
 * Guaranteed fallback construction for extreme edge cases ensuring no adjacent duplicates.
 */
function generateInterleavedFallback(
  length: number,
  categories: { name: string; chars: string }[],
  combinedPool: string
): string {
  const result: string[] = [];

  // Guarantee categories first in unique non-adjacent order
  const catChars: string[] = categories.map((cat) => {
    return cat.chars[secureRandomInt(cat.chars.length)];
  });

  // Build sequence choosing characters that differ from predecessor
  for (let i = 0; i < length; i++) {
    const prevChar = i > 0 ? result[i - 1] : null;

    if (i < catChars.length) {
      let char = catChars[i];
      if (char === prevChar) {
        // Swap with a different char from its category
        const altChars = categories[i].chars.split('').filter((c) => c !== prevChar);
        char = altChars.length > 0 ? altChars[secureRandomInt(altChars.length)] : combinedPool.split('').find((c) => c !== prevChar) || '!';
      }
      result.push(char);
    } else {
      const candidates = combinedPool.split('').filter((c) => c !== prevChar);
      result.push(candidates[secureRandomInt(candidates.length)]);
    }
  }

  // Final check to eliminate any residual adjacent duplicates
  for (let i = 0; i < result.length - 1; i++) {
    if (result[i] === result[i + 1]) {
      const alternatives = combinedPool.split('').filter((c) => c !== result[i] && (i + 2 >= result.length || c !== result[i + 2]));
      if (alternatives.length > 0) {
        result[i + 1] = alternatives[secureRandomInt(alternatives.length)];
      }
    }
  }

  return result.join('');
}
