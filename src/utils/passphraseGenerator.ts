import type { PassphraseOptions } from '../types';
import { secureRandomInt } from './random';

// Curated list of friendly, distinct, memorable English words
const WORDS = [
  'alpha', 'anchor', 'beacon', 'breeze', 'bridge', 'cabin', 'canyon', 'castle',
  'cedar', 'cliff', 'cloud', 'comet', 'coral', 'crater', 'crystal', 'delta',
  'drift', 'eagle', 'echo', 'ember', 'falcon', 'feather', 'forest', 'fossil',
  'galaxy', 'glacier', 'granite', 'harbor', 'haven', 'horizon', 'island', 'jasper',
  'jungle', 'lagoon', 'lantern', 'meadow', 'meteor', 'mountain', 'nebula', 'oasis',
  'ocean', 'orbit', 'pebble', 'phoenix', 'pinnacle', 'planet', 'portal', 'prairie',
  'pulsar', 'quartz', 'quiver', 'radar', 'radiant', 'raptor', 'raven', 'reef',
  'ridge', 'river', 'rocket', 'rover', 'saddle', 'safari', 'sailor', 'salmon',
  'sanctum', 'sapphire', 'satellite', 'shadow', 'shelter', 'shield', 'sierra', 'silver',
  'solace', 'solar', 'spark', 'sphere', 'spiral', 'spring', 'star', 'stellar',
  'summit', 'sunrise', 'sunset', 'timber', 'topaz', 'torrent', 'tundra', 'valley',
  'vapor', 'vector', 'velocity', 'vertex', 'vessel', 'vortex', 'voyage', 'wave',
  'whisper', 'willow', 'zenith', 'zephyr'
];

export const DEFAULT_PASSPHRASE_OPTIONS: PassphraseOptions = {
  wordCount: 4,
  separator: '-',
  capitalize: true,
  includeNumber: true,
};

/**
 * Generates a memorable passphrase using cryptographically secure random selection.
 */
export function generatePassphrase(options: PassphraseOptions = DEFAULT_PASSPHRASE_OPTIONS): string {
  const words: string[] = [];

  for (let i = 0; i < options.wordCount; i++) {
    const idx = secureRandomInt(WORDS.length);
    let word = WORDS[idx];
    if (options.capitalize) {
      word = word.charAt(0).toUpperCase() + word.slice(1);
    }
    words.push(word);
  }

  let result = words.join(options.separator);

  if (options.includeNumber) {
    const randomNum = secureRandomInt(90) + 10; // 2-digit number (10 to 99)
    result += options.separator + randomNum.toString();
  }

  return result;
}
