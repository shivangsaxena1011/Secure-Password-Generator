import type { PasswordOptions, PassphraseOptions } from '../types';
import { CHAR_POOLS, STANDARD_SYMBOLS, COMPATIBLE_SYMBOLS, AMBIGUOUS_CHARS } from './passwordGenerator';
import { PASSPHRASE_WORDS } from './passphraseGenerator';

/**
 * Calculates character pool size based on active options.
 */
export function calculatePoolSize(options: PasswordOptions): number {
  let poolSize = 0;

  const countPool = (pool: string): number => {
    if (!options.excludeSimilar) return pool.length;
    return Array.from(pool).filter((char) => !AMBIGUOUS_CHARS.has(char)).length;
  };

  if (options.uppercase) poolSize += countPool(CHAR_POOLS.uppercase);
  if (options.lowercase) poolSize += countPool(CHAR_POOLS.lowercase);
  if (options.numbers) poolSize += countPool(CHAR_POOLS.numbers);
  if (options.symbols) {
    const symbolPool = options.symbolMode === 'compatible' ? COMPATIBLE_SYMBOLS : STANDARD_SYMBOLS;
    poolSize += countPool(symbolPool);
  }

  return poolSize;
}

/**
 * Calculates theoretical search-space entropy in bits for character passwords:
 * Entropy ≈ length × log2(character_pool_size)
 */
export function calculatePasswordEntropy(length: number, poolSize: number): number {
  if (length <= 0 || poolSize <= 1) {
    return 0;
  }
  const bits = length * Math.log2(poolSize);
  return Math.round(bits);
}

/**
 * Calculates theoretical search-space entropy in bits for passphrases:
 * Entropy ≈ wordCount × log2(wordListSize) + (optional number entropy)
 */
export function calculatePassphraseEntropy(
  options: PassphraseOptions,
  wordListSize: number = PASSPHRASE_WORDS.length
): number {
  if (options.wordCount <= 0 || wordListSize <= 1) {
    return 0;
  }

  let bits = options.wordCount * Math.log2(wordListSize);

  // If number suffix is included (10 to 99, 90 possible outcomes)
  if (options.includeNumber) {
    bits += Math.log2(90);
  }

  return Math.round(bits);
}

/**
 * Provides search-space complexity interpretation without misleading crack-time claims.
 */
export function getEntropyRating(bits: number): {
  label: string;
  description: string;
  complexityTier: string;
} {
  if (bits < 28) {
    return {
      label: 'Very Low',
      description: 'Very small search space; vulnerable to basic automated guessing and small wordlists.',
      complexityTier: 'Minimal (~2^' + bits + ' combinations)',
    };
  }
  if (bits < 45) {
    return {
      label: 'Low',
      description: 'Limited search space; susceptible to offline dictionary rules and GPU-accelerated hashing.',
      complexityTier: 'Low (~2^' + bits + ' combinations)',
    };
  }
  if (bits < 65) {
    return {
      label: 'Moderate',
      description: 'Moderate search space; suitable for general accounts with rate-limiting in place.',
      complexityTier: 'Moderate (~2^' + bits + ' combinations)',
    };
  }
  if (bits < 85) {
    return {
      label: 'High',
      description: 'Large search space; resilient against modern offline targeted brute-force attacks.',
      complexityTier: 'Substantial (~2^' + bits + ' combinations)',
    };
  }
  return {
    label: 'Very High',
    description: 'Extensive search space; exhaustive search is mathematically intractable.',
    complexityTier: 'Cryptographic (~2^' + bits + ' combinations)',
  };
}
