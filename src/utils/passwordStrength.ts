import type { PasswordOptions, StrengthAnalysis, StrengthLevel } from '../types';
import { calculateEntropy, calculatePoolSize } from './entropy';

/**
 * Checks for repeated characters in the password.
 */
function hasConsecutiveRepeats(password: string): boolean {
  for (let i = 0; i < password.length - 1; i++) {
    if (password[i] === password[i + 1]) {
      return true;
    }
  }
  return false;
}

/**
 * Checks for sequential patterns (e.g., "abc", "123", "cba").
 */
function hasSequentialPatterns(password: string): boolean {
  const lower = password.toLowerCase();
  for (let i = 0; i < lower.length - 2; i++) {
    const code0 = lower.charCodeAt(i);
    const code1 = lower.charCodeAt(i + 1);
    const code2 = lower.charCodeAt(i + 2);

    // Forward sequential: a, b, c
    if (code1 === code0 + 1 && code2 === code1 + 1) return true;
    // Backward sequential: c, b, a
    if (code1 === code0 - 1 && code2 === code1 - 1) return true;
  }
  return false;
}

/**
 * Evaluates password strength based on multiple security characteristics.
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
      feedback: ['Enter or generate a password.'],
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
      (hasSymbols ? 33 : 0);

  const entropy = calculateEntropy(length, poolSize > 0 ? poolSize : 1);

  // Calculate composite numeric score (0 to 100)
  let rawScore = 0;

  // 1. Length scoring
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

  // 2. Character diversity scoring
  rawScore += characterTypes * 6; // up to +24
  if (characterTypes === 4 && length >= 12) {
    rawScore += 10; // full diversity synergy
  }

  // 3. Deductions for patterns
  if (hasRepetition) {
    rawScore -= 8;
  }
  if (hasSequential) {
    rawScore -= 6;
  }
  if (characterTypes === 1) {
    rawScore -= 18;
  }

  // Clamp raw score between 5 and 100
  const percentage = Math.max(5, Math.min(100, Math.round(rawScore)));

  // Map to 5-level scale (0 to 4)
  let score = 0;
  let label: StrengthLevel = 'Very Weak';
  let color = '#ef4444'; // Red

  if (percentage < 30 || length < 7) {
    score = 0;
    label = 'Very Weak';
    color = '#ef4444'; // Red
  } else if (percentage < 50 || length < 10) {
    score = 1;
    label = 'Weak';
    color = '#f97316'; // Orange
  } else if (percentage < 70 || length < 14) {
    score = 2;
    label = 'Fair';
    color = '#eab308'; // Amber
  } else if (percentage < 85 || length < 18) {
    score = 3;
    label = 'Strong';
    color = '#06b6d4'; // Cyan
  } else {
    score = 4;
    label = 'Very Strong';
    color = '#10b981'; // Emerald
  }

  // Helpful actionable feedback
  const feedback: string[] = [];
  if (length < 12) {
    feedback.push('Increase length to 12+ characters for significantly greater resilience.');
  }
  if (characterTypes < 3) {
    feedback.push('Include a mix of letters, numbers, and symbols.');
  }
  if (hasRepetition) {
    feedback.push('Avoid consecutive repeating characters.');
  }
  if (hasSequential) {
    feedback.push('Avoid sequential character patterns like "abc" or "123".');
  }
  if (feedback.length === 0) {
    feedback.push('Excellent balance of length, entropy, and character diversity.');
  }

  return {
    score,
    percentage,
    label,
    entropy,
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
  };
}
