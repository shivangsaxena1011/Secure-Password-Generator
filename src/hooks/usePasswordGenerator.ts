import { useState, useCallback, useEffect, useRef } from 'react';
import type {
  PasswordOptions,
  PresetKey,
  HistoryItem,
  StrengthAnalysis,
  PassphraseOptions,
} from '../types';
import {
  generatePassword,
  validatePasswordOptions,
  PRESETS,
  DEFAULT_LENGTH,
  MIN_LENGTH,
  MAX_LENGTH,
} from '../utils/passwordGenerator';
import { calculatePasswordStrength } from '../utils/passwordStrength';
import { generatePassphrase, DEFAULT_PASSPHRASE_OPTIONS } from '../utils/passphraseGenerator';
import { secureId } from '../utils/random';

const MAX_HISTORY_ITEMS = 5;

export type GeneratorMode = 'password' | 'passphrase';

export function usePasswordGenerator() {
  const [mode, setMode] = useState<GeneratorMode>('password');

  // Password options state
  const [options, setOptions] = useState<PasswordOptions>({
    length: DEFAULT_LENGTH,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeSimilar: false,
    avoidRepeated: false,
  });

  // Passphrase options state
  const [passphraseOptions, setPassphraseOptions] = useState<PassphraseOptions>(
    DEFAULT_PASSPHRASE_OPTIONS
  );

  const [activePreset, setActivePreset] = useState<PresetKey | null>('strong');
  const [password, setPassword] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(true);
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);

  // History state: stored purely in React state (browser memory) by default
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  const warningTimeoutRef = useRef<number | null>(null);

  const showTemporaryWarning = (message: string) => {
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }
    setWarningMessage(message);
    warningTimeoutRef.current = window.setTimeout(() => {
      setWarningMessage(null);
    }, 3000);
  };

  // Generate password function
  const handleGenerate = useCallback(
    (opts: PasswordOptions = options) => {
      if (mode === 'passphrase') {
        const newPassphrase = generatePassphrase(passphraseOptions);
        setPassword(newPassphrase);
        setValidationError(null);

        // Record in history
        const analysis = calculatePasswordStrength(newPassphrase);
        const newItem: HistoryItem = {
          id: secureId(),
          password: newPassphrase,
          timestamp: Date.now(),
          strength: analysis.label,
          length: newPassphrase.length,
        };
        setHistory((prev) => [newItem, ...prev.slice(0, MAX_HISTORY_ITEMS - 1)]);

        // Trigger micro-animation
        setIsRegenerating(true);
        setTimeout(() => setIsRegenerating(false), 200);
        return newPassphrase;
      }

      const err = validatePasswordOptions(opts);
      if (err) {
        setValidationError(err);
        return null;
      }

      setValidationError(null);
      const newPassword = generatePassword(opts);
      setPassword(newPassword);

      // Record in history
      const analysis = calculatePasswordStrength(newPassword, opts);
      const newItem: HistoryItem = {
        id: secureId(),
        password: newPassword,
        timestamp: Date.now(),
        strength: analysis.label,
        length: newPassword.length,
      };
      setHistory((prev) => [newItem, ...prev.slice(0, MAX_HISTORY_ITEMS - 1)]);

      // Trigger micro-animation
      setIsRegenerating(true);
      setTimeout(() => setIsRegenerating(false), 200);

      return newPassword;
    },
    [options, mode, passphraseOptions]
  );

  // Initialize with a default password on first load
  useEffect(() => {
    handleGenerate(options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update length
  const setLength = (newLength: number) => {
    let sanitized = newLength;
    if (isNaN(sanitized)) sanitized = MIN_LENGTH;
    if (sanitized < MIN_LENGTH) {
      showTemporaryWarning(`Password length must be at least ${MIN_LENGTH}.`);
      sanitized = MIN_LENGTH;
    } else if (sanitized > MAX_LENGTH) {
      showTemporaryWarning(`Password length cannot exceed ${MAX_LENGTH}.`);
      sanitized = MAX_LENGTH;
    }

    const updatedOptions = { ...options, length: sanitized };
    setOptions(updatedOptions);
    setActivePreset(null);
    handleGenerate(updatedOptions);
  };

  // Toggle character category with protection against disabling all
  const toggleOption = (key: keyof PasswordOptions) => {
    const isCategory = ['uppercase', 'lowercase', 'numbers', 'symbols'].includes(key);

    if (isCategory) {
      const activeCount = [
        options.uppercase,
        options.lowercase,
        options.numbers,
        options.symbols,
      ].filter(Boolean).length;

      // Prevent disabling the final active category
      if (options[key] && activeCount <= 1) {
        showTemporaryWarning('At least one character type must remain enabled.');
        return;
      }
    }

    const updatedOptions = {
      ...options,
      [key]: !options[key],
    };

    setOptions(updatedOptions);
    setActivePreset(null);
    handleGenerate(updatedOptions);
  };

  // Apply a preset
  const applyPreset = (presetKey: PresetKey) => {
    const preset = PRESETS[presetKey];
    if (!preset) return;

    setActivePreset(presetKey);
    setOptions((prev) => ({
      ...prev,
      ...preset.options,
    }));
    handleGenerate({
      ...options,
      ...preset.options,
    });
  };

  // Clear history
  const clearHistory = () => {
    setHistory([]);
  };

  // Switch between password and passphrase modes with immediate generation
  const switchMode = (newMode: GeneratorMode) => {
    if (newMode === mode) return;
    setMode(newMode);

    if (newMode === 'passphrase') {
      const newPassphrase = generatePassphrase(passphraseOptions);
      setPassword(newPassphrase);
      setValidationError(null);
      const analysis = calculatePasswordStrength(newPassphrase);
      const newItem: HistoryItem = {
        id: secureId(),
        password: newPassphrase,
        timestamp: Date.now(),
        strength: analysis.label,
        length: newPassphrase.length,
      };
      setHistory((prev) => [newItem, ...prev.slice(0, MAX_HISTORY_ITEMS - 1)]);
    } else {
      const err = validatePasswordOptions(options);
      if (err) {
        setValidationError(err);
      } else {
        setValidationError(null);
        const newPassword = generatePassword(options);
        setPassword(newPassword);
        const analysis = calculatePasswordStrength(newPassword, options);
        const newItem: HistoryItem = {
          id: secureId(),
          password: newPassword,
          timestamp: Date.now(),
          strength: analysis.label,
          length: newPassword.length,
        };
        setHistory((prev) => [newItem, ...prev.slice(0, MAX_HISTORY_ITEMS - 1)]);
      }
    }
  };

  // Calculate current strength
  const strength: StrengthAnalysis = calculatePasswordStrength(
    password,
    mode === 'password' ? options : undefined
  );

  return {
    mode,
    setMode: switchMode,
    password,
    options,
    passphraseOptions,
    setPassphraseOptions,
    activePreset,
    strength,
    validationError,
    warningMessage,
    showPassword,
    setShowPassword,
    isRegenerating,
    history,
    isHistoryOpen,
    setIsHistoryOpen,
    setLength,
    toggleOption,
    applyPreset,
    generateNewPassword: () => handleGenerate(options),
    clearHistory,
  };
}
