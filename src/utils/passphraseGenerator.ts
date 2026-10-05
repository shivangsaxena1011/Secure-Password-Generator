import type { PassphraseOptions } from '../types';
import { secureRandomInt } from './random';

// Large curated list of friendly, distinct, common English words (400+ words)
// Completely bundled locally - zero network fetches.
export const PASSPHRASE_WORDS: readonly string[] = [
  'acorn', 'action', 'actor', 'admit', 'adopt', 'advice', 'agenda', 'alarm',
  'album', 'alert', 'alien', 'align', 'alloy', 'almond', 'alpha', 'amber',
  'anchor', 'angel', 'angle', 'animal', 'anthem', 'anvil', 'apple', 'apron',
  'arcade', 'arctic', 'arena', 'armor', 'arrow', 'artist', 'aspect', 'atlas',
  'atom', 'attic', 'audio', 'author', 'autumn', 'avalanche', 'avatar', 'avenue',
  'badger', 'bakery', 'bamboo', 'banana', 'banner', 'baron', 'barrel', 'basil',
  'basket', 'battery', 'beacon', 'beaver', 'beetle', 'biscuit', 'blade', 'blanket',
  'blazer', 'blossom', 'blush', 'bolt', 'bonfire', 'bonsai', 'bonus', 'border',
  'bounce', 'breeze', 'bridge', 'bronze', 'bubble', 'bucket', 'buffalo', 'bullet',
  'bundle', 'bunker', 'butter', 'cabin', 'cable', 'cactus', 'camel', 'camera',
  'candle', 'canvas', 'canyon', 'carpet', 'carrot', 'castle', 'cathedral', 'cedar',
  'celery', 'center', 'cereal', 'chalk', 'champion', 'chapter', 'cheese', 'cherry',
  'chess', 'chimney', 'chronic', 'cider', 'cinnamon', 'circle', 'circus', 'citrus',
  'classic', 'clay', 'cliff', 'climate', 'clover', 'cluster', 'coast', 'cobalt',
  'coffee', 'coin', 'collar', 'comet', 'comic', 'compass', 'copper', 'coral',
  'corner', 'cosmic', 'cotton', 'cradle', 'crater', 'crayon', 'creek', 'cricket',
  'crown', 'crystal', 'cube', 'curtain', 'cushion', 'cyber', 'cylinder', 'daisy',
  'dancer', 'danger', 'darling', 'dawn', 'daylight', 'decade', 'degree', 'delta',
  'desert', 'diamond', 'diary', 'diesel', 'dinner', 'dinosaur', 'diploma', 'disco',
  'diver', 'dolphin', 'domino', 'donkey', 'dragon', 'drawer', 'drift', 'driver',
  'drum', 'dune', 'dynamo', 'eagle', 'echo', 'eclipse', 'ecology', 'editor',
  'elbow', 'elder', 'electric', 'element', 'elephant', 'elm', 'ember', 'emerald',
  'empire', 'engine', 'envelope', 'epoch', 'equal', 'escape', 'estate', 'fabric',
  'falcon', 'family', 'fantasy', 'farmer', 'feather', 'fender', 'fern', 'festival',
  'fiction', 'filter', 'finish', 'firefly', 'flame', 'flask', 'flight', 'flock',
  'flower', 'flute', 'focus', 'forest', 'fossil', 'fountain', 'fox', 'freedom',
  'frost', 'galaxy', 'gallery', 'garage', 'garden', 'garlic', 'garnet', 'gateway',
  'gazelle', 'gemini', 'general', 'genius', 'geology', 'glacier', 'glider', 'glow',
  'golden', 'gorilla', 'grain', 'granite', 'grape', 'gravity', 'guitar', 'harbor',
  'harvest', 'haven', 'hawk', 'hazel', 'helmet', 'herald', 'hero', 'history',
  'honey', 'horizon', 'horse', 'hotel', 'hover', 'hunter', 'hybrid', 'hydra',
  'iceberg', 'icon', 'igloo', 'image', 'impact', 'index', 'indigo', 'infant',
  'insect', 'insight', 'island', 'ivory', 'jacket', 'jaguar', 'jasper', 'jazz',
  'jelly', 'jigsaw', 'journal', 'journey', 'jungle', 'jupiter', 'karate', 'kernel',
  'kettle', 'keyboard', 'kinetic', 'kingdom', 'kitten', 'kiwi', 'koala', 'lagoon',
  'lake', 'lantern', 'laser', 'lattice', 'laurel', 'lava', 'leader', 'lemon',
  'leopard', 'library', 'light', 'lilac', 'lily', 'lime', 'linear', 'lion',
  'lizard', 'llama', 'lobster', 'logic', 'lotus', 'lunar', 'lynx', 'magnet',
  'mango', 'mantle', 'maple', 'marble', 'matrix', 'meadow', 'melody', 'meteor',
  'micro', 'mineral', 'mirror', 'molecule', 'monkey', 'monolith', 'moon', 'mosaic',
  'mountain', 'museum', 'music', 'nebula', 'nectar', 'needle', 'neon', 'nest',
  'network', 'ninja', 'noble', 'nomad', 'noodle', 'north', 'notebook', 'nova',
  'oasis', 'ocean', 'olive', 'omega', 'onion', 'opal', 'opera', 'orbit',
  'orchard', 'orchid', 'origin', 'otter', 'oxygen', 'oyster', 'ozone', 'palace',
  'panda', 'panther', 'paradise', 'parcel', 'parrot', 'pasta', 'patrol', 'pebble',
  'pelican', 'penguin', 'pepper', 'peppermint', 'phantom', 'phoenix', 'piano', 'picnic',
  'pilot', 'pinnacle', 'pioneer', 'pipeline', 'pirate', 'planet', 'plasma', 'platypus',
  'polar', 'portal', 'prairie', 'prism', 'pulsar', 'pulse', 'pyramid', 'quantum',
  'quartz', 'quasar', 'quest', 'quiver', 'rabbit', 'radar', 'radiant', 'radius',
  'raptor', 'raven', 'razor', 'reef', 'relay', 'relic', 'remote', 'resin',
  'rhino', 'ribbon', 'ridge', 'ring', 'ripple', 'river', 'robin', 'robot',
  'rocket', 'roller', 'rover', 'ruby', 'runner', 'saddle', 'safari', 'sailor',
  'salmon', 'samurai', 'sanctum', 'sapphire', 'satellite', 'saturn', 'scooter', 'scout',
  'scroll', 'shadow', 'shelter', 'shield', 'sierra', 'signal', 'silver', 'sketch',
  'slate', 'smile', 'snowflake', 'socket', 'solace', 'solar', 'sonic', 'source',
  'spark', 'spectrum', 'sphere', 'spiral', 'spring', 'squirrel', 'starlight', 'statue',
  'stellar', 'stereo', 'storm', 'stream', 'studio', 'summit', 'sunflower', 'sunrise',
  'sunset', 'syntax', 'tactic', 'target', 'temple', 'tenant', 'terminal', 'terrace',
  'thunder', 'timber', 'titan', 'toggle', 'topaz', 'tornado', 'torrent', 'tower',
  'tractor', 'transit', 'treasure', 'trench', 'triangle', 'tulip', 'tundra', 'tunnel',
  'turbine', 'turtle', 'universe', 'vacuum', 'valley', 'vanilla', 'vapor', 'vector',
  'velocity', 'venture', 'vertex', 'vessel', 'vintage', 'violin', 'vision', 'volcano',
  'vortex', 'voyage', 'walrus', 'water', 'wave', 'whisper', 'willow', 'window',
  'winter', 'wizard', 'wolf', 'wombat', 'wonder', 'woodland', 'wrist', 'zenith',
  'zephyr', 'zero', 'zigzag', 'zodiac'
] as const;

export const DEFAULT_PASSPHRASE_OPTIONS: PassphraseOptions = {
  wordCount: 4,
  separator: '-',
  capitalize: true,
  includeNumber: true,
  avoidDuplicates: true,
};

export const ALLOWED_SEPARATORS = [
  { label: 'Hyphen (-)', value: '-' },
  { label: 'Underscore (_)', value: '_' },
  { label: 'Period (.)', value: '.' },
  { label: 'Plus (+)', value: '+' },
  { label: 'Space ( )', value: ' ' },
] as const;

/**
 * Validates passphrase options.
 */
export function validatePassphraseOptions(options: PassphraseOptions): string | null {
  if (options.wordCount < 3 || options.wordCount > 8) {
    return 'Word count must be between 3 and 8 words.';
  }

  const validSeparators = ALLOWED_SEPARATORS.map((s) => s.value);
  if (!validSeparators.includes(options.separator as any)) {
    return 'Invalid passphrase separator.';
  }

  if (options.avoidDuplicates && options.wordCount > PASSPHRASE_WORDS.length) {
    return `Cannot select ${options.wordCount} unique words from a wordlist of ${PASSPHRASE_WORDS.length} words.`;
  }

  return null;
}

/**
 * Generates a memorable passphrase using cryptographically secure random selection.
 */
export function generatePassphrase(options: PassphraseOptions = DEFAULT_PASSPHRASE_OPTIONS): string {
  const validationError = validatePassphraseOptions(options);
  if (validationError) {
    throw new Error(validationError);
  }

  const chosenWords: string[] = [];
  const usedIndices = new Set<number>();

  for (let i = 0; i < options.wordCount; i++) {
    let wordIdx: number;

    if (options.avoidDuplicates) {
      let attempts = 0;
      do {
        wordIdx = secureRandomInt(PASSPHRASE_WORDS.length);
        attempts++;
      } while (usedIndices.has(wordIdx) && attempts < 100);

      // Deterministic fallback if random collision occurred
      if (usedIndices.has(wordIdx)) {
        for (let candidate = 0; candidate < PASSPHRASE_WORDS.length; candidate++) {
          if (!usedIndices.has(candidate)) {
            wordIdx = candidate;
            break;
          }
        }
      }

      usedIndices.add(wordIdx);
    } else {
      wordIdx = secureRandomInt(PASSPHRASE_WORDS.length);
    }

    let word = PASSPHRASE_WORDS[wordIdx];
    if (options.capitalize) {
      word = word.charAt(0).toUpperCase() + word.slice(1);
    }
    chosenWords.push(word);
  }

  let result = chosenWords.join(options.separator);

  if (options.includeNumber) {
    // 2-digit number (10 to 99, 90 possible values)
    const randomNum = secureRandomInt(90) + 10;
    result += options.separator + randomNum.toString();
  }

  return result;
}
