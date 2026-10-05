export interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeSimilar?: boolean;
  avoidRepeated?: boolean;
}

export type PresetKey = 'quick' | 'strong' | 'extra-strong' | 'maximum';

export interface PresetConfig {
  id: PresetKey;
  label: string;
  description: string;
  options: PasswordOptions;
}

export type StrengthLevel = 'Very Weak' | 'Weak' | 'Fair' | 'Strong' | 'Very Strong';

export interface StrengthAnalysis {
  score: number; // 0 to 4
  percentage: number; // 0 to 100
  label: StrengthLevel;
  entropy: number; // in bits
  length: number;
  characterTypes: number;
  poolSize: number;
  color: string;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumbers: boolean;
  hasSymbols: boolean;
  hasRepetition: boolean;
  hasSequential: boolean;
  feedback: string[];
}

export interface HistoryItem {
  id: string;
  password: string;
  timestamp: number;
  strength: StrengthLevel;
  length: number;
}

export interface PassphraseOptions {
  wordCount: number;
  separator: string;
  capitalize: boolean;
  includeNumber: boolean;
}
