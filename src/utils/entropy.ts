import type { PasswordOptions } from '../types';
import { CHAR_POOLS, SIMILAR_CHARS } from './passwordGenerator';

/**
 * Calculates character pool size based on active options.
 */
export function calculatePoolSize(options: PasswordOptions): number {
  let poolSize = 0;

  const countPool = (pool: string): number => {
    if (!options.excludeSimilar) return pool.length;
    return Array.from(pool).filter((char) => !SIMILAR_CHARS.has(char)).length;
  };

  if (options.uppercase) poolSize += countPool(CHAR_POOLS.uppercase);
  if (options.lowercase) poolSize += countPool(CHAR_POOLS.lowercase);
  if (options.numbers) poolSize += countPool(CHAR_POOLS.numbers);
  if (options.symbols) poolSize += countPool(CHAR_POOLS.symbols);

  return poolSize;
}

/**
 * Calculates Shannon entropy approximation in bits:
 * entropy ≈ length × log2(character_pool_size)
 */
export function calculateEntropy(length: number, poolSize: number): number {
  if (length <= 0 || poolSize <= 1) {
    return 0;
  }
  const bits = length * Math.log2(poolSize);
  return Math.round(bits);
}

/**
 * Provides human-friendly interpretation of entropy bits.
 */
export function getEntropyRating(bits: number): {
  label: string;
  description: string;
  crackTimeEstimate: string;
} {
  if (bits < 28) {
    return {
      label: 'Extremely Low',
      description: 'Vulnerable to immediate automated dictionary or brute-force search.',
      crackTimeEstimate: 'Instant (< 1 second)',
    };
  }
  if (bits < 45) {
    return {
      label: 'Low',
      description: 'Vulnerable to fast GPU offline attacks and precomputed rainbow tables.',
      crackTimeEstimate: 'A few minutes to hours',
    };
  }
  if (bits < 65) {
    return {
      label: 'Moderate',
      description: 'Reasonable against casual attacks; may be crackable by dedicated rigs.',
      crackTimeEstimate: 'Several weeks to months',
    };
  }
  if (bits < 85) {
    return {
      label: 'Strong',
      description: 'Highly resistant to modern supercomputer cluster attacks.',
      crackTimeEstimate: 'Hundreds to thousands of years',
    };
  }
  return {
    label: 'Extremely Strong',
    description: 'Cryptographically formidable; brute-force attacks are mathematically infeasible.',
    crackTimeEstimate: 'Billions of years',
  };
}
