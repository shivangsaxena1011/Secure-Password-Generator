import type { PasswordOptions, PassphraseOptions, StrengthAnalysis, StrengthLevel } from '../types';
import { calculatePasswordEntropy, calculatePassphraseEntropy, calculatePoolSize } from './entropy';

/**
 * Checks for consecutive duplicate characters in a string.
 */
function hasConsecutiveRepeats(str: string): boolean {
  for (let i = 0; i < str.length - 1; i++) {
    if (str[i] === str[i + 1]) {
      return true;
    }
  }
  return false;
}

/**
 * Checks for sequential patterns (e.g. "abc", "123", "cba").
 */
function hasSequentialPatterns(str: string): boolean {
  const lower = str.toLowerCase();
  for (let i = 0; i < lower.length - 2; i++) {
    const code0 = lower.charCodeAt(i);
    const code1 = lower.charCodeAt(i + 1);
    const code2 = lower.charCodeAt(i + 2);

    if (code1 === code0 + 1 && code2 === code1 + 1) return true;
    if (code1 === code0 - 1 && code2 === code1 - 1) return true;
  }
  return false;
}

/**
 * Evaluates strength estimate for a character-based password.
 */
export function calculatePasswordStrength(
  password: string,
  options?: PasswordOptions
): StrengthAnalysis {
  if (!password || password.length === 0) {
    return {
      score: 0,
      percentage: 0,
      label: 'Very Weak',
      entropy: 0,
      entropyModel: 'search-space',
      length: 0,
      characterTypes: 0,
      poolSize: 0,
      color: '#ef4444',
      hasUppercase: false,
      hasLowercase: false,
      hasNumbers: false,
      hasSymbols: false,
      hasRepetition: false,
      hasSequential: false,
      feedback: ['Generate or enter a password to inspect.'],
      explanation: 'Based on length, character diversity, and detectable patterns. This is an estimate, not a guarantee of resistance to real-world attacks.',
    };
  }

  const length = password.length;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSymbols = /[^A-Za-z0-9]/.test(password);

  const characterTypes = [hasUppercase, hasLowercase, hasNumbers, hasSymbols].filter(Boolean).length;
  const hasRepetition = hasConsecutiveRepeats(password);
  const hasSequential = hasSequentialPatterns(password);

  const poolSize = options
    ? calculatePoolSize(options)
    : (hasUppercase ? 26 : 0) +
      (hasLowercase ? 26 : 0) +
      (hasNumbers ? 10 : 0) +
      (hasSymbols ? 27 : 0);

  const entropy = calculatePasswordEntropy(length, poolSize > 0 ? poolSize : 1);

  // Heuristic score calculation (0 to 100)
  let rawScore = 0;

  // Length scoring
  if (length < 8) {
    rawScore += length * 2.5; // max 17.5
  } else if (length <= 11) {
    rawScore += 25 + (length - 8) * 5; // 25 to 40
  } else if (length <= 15) {
    rawScore += 45 + (length - 12) * 5; // 45 to 60
  } else if (length <= 20) {
    rawScore += 65 + (length - 16) * 4; // 65 to 81
  } else {
    rawScore += 85 + Math.min(15, (length - 20) * 1.5); // 85 to 100
  }

  // Diversity bonus
  rawScore += characterTypes * 6;
  if (characterTypes === 4 && length >= 12) {
    rawScore += 10;
  }

  // Penalties
  if (hasRepetition) rawScore -= 8;
  if (hasSequential) rawScore -= 6;
  if (characterTypes === 1) rawScore -= 18;

  const percentage = Math.max(5, Math.min(100, Math.round(rawScore)));

  let score = 0;
  let label: StrengthLevel = 'Very Weak';
  let color = '#ef4444';

  if (percentage < 30 || length < 7) {
    score = 0;
    label = 'Very Weak';
    color = '#ef4444';
  } else if (percentage < 50 || length < 10) {
    score = 1;
    label = 'Weak';
    color = '#f97316';
  } else if (percentage < 70 || length < 14) {
    score = 2;
    label = 'Fair';
    color = '#eab308';
  } else if (percentage < 85 || length < 18) {
    score = 3;
    label = 'Strong';
    color = '#06b6d4';
  } else {
    score = 4;
    label = 'Very Strong';
    color = '#10b981';
  }

  const feedback: string[] = [];
  if (length < 12) {
    feedback.push('Increase length to 12+ characters for greater resistance.');
  }
  if (characterTypes < 3) {
    feedback.push('Include letters, numbers, and symbols to expand the search space.');
  }
  if (hasRepetition) {
    feedback.push('Consecutive duplicate characters detected.');
  }
  if (hasSequential) {
    feedback.push('Sequential character runs (e.g. 123 or abc) detected.');
  }
  if (feedback.length === 0) {
    feedback.push('Balanced combination of length and character diversity.');
  }

  return {
    score,
    percentage,
    label,
    entropy,
    entropyModel: 'search-space',
    length,
    characterTypes,
    poolSize,
    color,
    hasUppercase,
    hasLowercase,
    hasNumbers,
    hasSymbols,
    hasRepetition,
    hasSequential,
    feedback,
    explanation: 'Based on length, character diversity, and detectable patterns. This is an estimate, not a guarantee of resistance to real-world attacks.',
  };
}

/**
 * Evaluates strength estimate specifically for a multi-word passphrase.
 */
export function calculatePassphraseStrength(
  passphrase: string,
  options: PassphraseOptions
): StrengthAnalysis {
  if (!passphrase || passphrase.length === 0) {
    return {
      score: 0,
      percentage: 0,
      label: 'Very Weak',
      entropy: 0,
      entropyModel: 'passphrase',
      length: 0,
      characterTypes: 0,
      poolSize: 0,
      color: '#ef4444',
      hasUppercase: false,
      hasLowercase: false,
      hasNumbers: false,
      hasSymbols: false,
      hasRepetition: false,
      hasSequential: false,
      feedback: ['Generate a passphrase to inspect.'],
      explanation: 'Passphrase entropy is estimated from the wordlist size and selected options, rather than arbitrary character combinations.',
    };
  }

  const entropy = calculatePassphraseEntropy(options);
  const wordCount = options.wordCount;

  let score = 0;
  let label: StrengthLevel = 'Very Weak';
  let color = '#ef4444';
  let percentage = 0;

  if (wordCount <= 3) {
    score = 1;
    label = 'Weak';
    color = '#f97316';
    percentage = 40;
  } else if (wordCount === 4) {
    score = 2;
    label = 'Fair';
    color = '#eab308';
    percentage = 65;
  } else if (wordCount === 5) {
    score = 3;
    label = 'Strong';
    color = '#06b6d4';
    percentage = 80;
  } else {
    score = 4;
    label = 'Very Strong';
    color = '#10b981';
    percentage = 95;
  }

  const feedback: string[] = [];
  if (wordCount < 4) {
    feedback.push('Use 4 or more words for significantly greater search-space protection.');
  }
  if (!options.includeNumber) {
    feedback.push('Adding a numeric suffix increases search-space entropy.');
  }
  if (feedback.length === 0) {
    feedback.push('Strong multi-word combination with high memorability.');
  }

  return {
    score,
    percentage,
    label,
    entropy,
    entropyModel: 'passphrase',
    length: passphrase.length,
    characterTypes: [
      /[A-Z]/.test(passphrase),
      /[a-z]/.test(passphrase),
      /[0-9]/.test(passphrase),
      /[^A-Za-z0-9]/.test(passphrase),
    ].filter(Boolean).length,
    poolSize: 0,
    color,
    hasUppercase: /[A-Z]/.test(passphrase),
    hasLowercase: /[a-z]/.test(passphrase),
    hasNumbers: /[0-9]/.test(passphrase),
    hasSymbols: /[^A-Za-z0-9]/.test(passphrase),
    hasRepetition: false,
    hasSequential: false,
    feedback,
    explanation: 'Passphrase entropy is estimated from the wordlist size and selected options, rather than arbitrary character combinations.',
  };
}
