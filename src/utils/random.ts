/**
 * Cryptographically secure random utilities using the Web Cryptography API.
 * Ensures zero modulo bias via rejection sampling.
 * Never falls back to pseudo-random generators (Math.random).
 */

/**
 * Checks whether the Web Cryptography API is available in the current environment.
 */
export function isCryptoAvailable(): boolean {
  if (typeof window !== 'undefined' && window.crypto && typeof window.crypto.getRandomValues === 'function') {
    return true;
  }
  if (typeof globalThis !== 'undefined' && globalThis.crypto && typeof globalThis.crypto.getRandomValues === 'function') {
    return true;
  }
  return false;
}

function getCrypto(): Crypto {
  if (typeof window !== 'undefined' && window.crypto && typeof window.crypto.getRandomValues === 'function') {
    return window.crypto;
  }
  if (typeof globalThis !== 'undefined' && globalThis.crypto && typeof globalThis.crypto.getRandomValues === 'function') {
    return globalThis.crypto;
  }
  throw new Error('Web Cryptography API is unavailable. Cryptographically secure random generation cannot proceed.');
}

/**
 * Returns a cryptographically secure random integer in the range [0, max).
 * Uses rejection sampling on 32-bit unsigned integers to eliminate modulo bias.
 *
 * Requirements:
 * - max must be a positive integer.
 * - max === 1 returns 0.
 * - invalid values (NaN, negative, zero, decimals, unsafe integers) throw RangeError.
 */
export function secureRandomInt(max: number): number {
  if (
    typeof max !== 'number' ||
    Number.isNaN(max) ||
    !Number.isFinite(max) ||
    !Number.isInteger(max) ||
    !Number.isSafeInteger(max) ||
    max <= 0
  ) {
    throw new RangeError(`secureRandomInt requires a positive safe integer max. Received: ${max}`);
  }

  if (max === 1) {
    return 0;
  }

  const cryptoInstance = getCrypto();
  const uint32Buffer = new Uint32Array(1);

  // 2^32 = 4294967296
  // Rejection sampling threshold: largest multiple of `max` <= 2^32
  const limit = Math.floor(4294967296 / max) * max;

  let rand: number;
  do {
    cryptoInstance.getRandomValues(uint32Buffer);
    rand = uint32Buffer[0];
  } while (rand >= limit);

  return rand % max;
}

/**
 * Shuffles an array in place using the Fisher-Yates algorithm
 * powered by cryptographically secure random values.
 */
export function secureShuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

/**
 * Generates a random unique ID without using Math.random.
 */
export function secureId(): string {
  const cryptoInstance = getCrypto();
  const buffer = new Uint8Array(8);
  cryptoInstance.getRandomValues(buffer);
  return Array.from(buffer)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
