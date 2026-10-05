/**
 * Cryptographically secure random utilities using Web Crypto API.
 * Ensures zero modulo bias via rejection sampling.
 */

function getCrypto(): Crypto {
  if (typeof window !== 'undefined' && window.crypto) {
    return window.crypto;
  }
  if (typeof globalThis !== 'undefined' && globalThis.crypto) {
    return globalThis.crypto;
  }
  throw new Error('Cryptographically secure random number generator is not available.');
}

/**
 * Returns a cryptographically secure random integer in the range [0, max).
 * Uses rejection sampling to eliminate modulo bias.
 */
export function secureRandomInt(max: number): number {
  if (max <= 1) {
    return 0;
  }

  const cryptoInstance = getCrypto();
  const uint32Buffer = new Uint32Array(1);

  // 2^32 = 4294967296
  // Calculate the largest multiple of `max` <= 2^32 to reject numbers that would cause bias.
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
