export type SymbolCompatibilityMode = 'standard' | 'compatible';

export interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  symbolMode?: SymbolCompatibilityMode;
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
  entropy: number; // in bits (theoretical search-space entropy)
  entropyModel: 'search-space' | 'passphrase';
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
  explanation: string;
}

export interface HistoryItem {
  id: string;
  password: string;
  timestamp: number;
  strength: StrengthLevel;
  length: number;
  mode: 'password' | 'passphrase';
}

export interface PassphraseOptions {
  wordCount: number;
  separator: string;
  capitalize: boolean;
  includeNumber: boolean;
  avoidDuplicates?: boolean;
}

export type GeneratorMode = 'password' | 'passphrase';
