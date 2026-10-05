import { useState, useCallback, useEffect, useRef } from 'react';
import type {
  PasswordOptions,
  PresetKey,
  HistoryItem,
  StrengthAnalysis,
  PassphraseOptions,
  GeneratorMode,
} from '../types';
import {
  generatePassword,
  validatePasswordOptions,
  PRESETS,
  DEFAULT_LENGTH,
  MIN_LENGTH,
  MAX_LENGTH,
} from '../utils/passwordGenerator';
import {
  calculatePasswordStrength,
  calculatePassphraseStrength,
} from '../utils/passwordStrength';
import {
  generatePassphrase,
  DEFAULT_PASSPHRASE_OPTIONS,
  validatePassphraseOptions,
} from '../utils/passphraseGenerator';
import { secureId, isCryptoAvailable } from '../utils/random';

const MAX_HISTORY_ITEMS = 5;

export function usePasswordGenerator() {
  const isCryptoSupported = isCryptoAvailable();

  const [mode, setMode] = useState<GeneratorMode>('password');

  // Password options state
  const [options, setOptions] = useState<PasswordOptions>({
    length: DEFAULT_LENGTH,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    symbolMode: 'standard',
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

  // Session history state (purely in-memory React state, opt-in)
  const [enableSessionHistory, setEnableSessionHistory] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  // Timers ref for unmount cleanup
  const warningTimeoutRef = useRef<number | null>(null);
  const regeneratingTimeoutRef = useRef<number | null>(null);
  const hasInitializedRef = useRef<boolean>(false);

  useEffect(() => {
    return () => {
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
      if (regeneratingTimeoutRef.current) clearTimeout(regeneratingTimeoutRef.current);
    };
  }, []);

  const showTemporaryWarning = useCallback((message: string) => {
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }
    setWarningMessage(message);
    warningTimeoutRef.current = window.setTimeout(() => {
      setWarningMessage(null);
    }, 3000);
  }, []);

  // Generate action
  const handleGenerate = useCallback(
    (opts: PasswordOptions = options, isUserAction = true) => {
      if (!isCryptoSupported) {
        setValidationError('Web Cryptography API is unavailable. Cryptographically secure random generation cannot proceed.');
        return null;
      }

      if (mode === 'passphrase') {
        const err = validatePassphraseOptions(passphraseOptions);
        if (err) {
          setValidationError(err);
          return null;
        }

        setValidationError(null);
        let newPassphrase = '';
        try {
          newPassphrase = generatePassphrase(passphraseOptions);
        } catch (e: any) {
          setValidationError(e?.message || 'Error generating passphrase.');
          return null;
        }

        setPassword(newPassphrase);

        // Record in history ONLY if user-triggered and session history is enabled
        if (isUserAction && enableSessionHistory) {
          const analysis = calculatePassphraseStrength(newPassphrase, passphraseOptions);
          const newItem: HistoryItem = {
            id: secureId(),
            password: newPassphrase,
            timestamp: Date.now(),
            strength: analysis.label,
            length: newPassphrase.length,
            mode: 'passphrase',
          };
          setHistory((prev) => [newItem, ...prev.slice(0, MAX_HISTORY_ITEMS - 1)]);
        }

        setIsRegenerating(true);
        if (regeneratingTimeoutRef.current) clearTimeout(regeneratingTimeoutRef.current);
        regeneratingTimeoutRef.current = window.setTimeout(() => setIsRegenerating(false), 200);

        return newPassphrase;
      }

      // Password Mode
      const err = validatePasswordOptions(opts);
      if (err) {
        setValidationError(err);
        return null;
      }

      setValidationError(null);
      let newPassword = '';
      try {
        newPassword = generatePassword(opts);
      } catch (e: any) {
        setValidationError(e?.message || 'Error generating password.');
        return null;
      }

      setPassword(newPassword);

      // Record in history ONLY if user-triggered and session history is enabled
      if (isUserAction && enableSessionHistory) {
        const analysis = calculatePasswordStrength(newPassword, opts);
        const newItem: HistoryItem = {
          id: secureId(),
          password: newPassword,
          timestamp: Date.now(),
          strength: analysis.label,
          length: newPassword.length,
          mode: 'password',
        };
        setHistory((prev) => [newItem, ...prev.slice(0, MAX_HISTORY_ITEMS - 1)]);
      }

      setIsRegenerating(true);
      if (regeneratingTimeoutRef.current) clearTimeout(regeneratingTimeoutRef.current);
      regeneratingTimeoutRef.current = window.setTimeout(() => setIsRegenerating(false), 200);

      return newPassword;
    },
    [options, mode, passphraseOptions, enableSessionHistory, isCryptoSupported]
  );

  // Initialize with a default password on first load WITHOUT adding to history
  useEffect(() => {
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      handleGenerate(options, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update length
  const setLength = useCallback(
    (newLength: number) => {
      let sanitized = newLength;
      if (Number.isNaN(sanitized)) sanitized = MIN_LENGTH;
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
      handleGenerate(updatedOptions, true);
    },
    [options, handleGenerate, showTemporaryWarning]
  );

  // Toggle character category or modifier
  const toggleOption = useCallback(
    (key: keyof PasswordOptions) => {
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
      handleGenerate(updatedOptions, true);
    },
    [options, handleGenerate, showTemporaryWarning]
  );

  // Set symbol compatibility mode
  const setSymbolMode = useCallback(
    (symbolMode: 'standard' | 'compatible') => {
      const updatedOptions = {
        ...options,
        symbolMode,
      };
      setOptions(updatedOptions);
      setActivePreset(null);
      handleGenerate(updatedOptions, true);
    },
    [options, handleGenerate]
  );

  // Apply a preset
  const applyPreset = useCallback(
    (presetKey: PresetKey) => {
      const preset = PRESETS[presetKey];
      if (!preset) return;

      setActivePreset(presetKey);
      setOptions((prev) => ({
        ...prev,
        ...preset.options,
      }));
      handleGenerate(
        {
          ...options,
          ...preset.options,
        },
        true
      );
    },
    [options, handleGenerate]
  );

  // Switch mode
  const switchMode = useCallback(
    (newMode: GeneratorMode) => {
      if (newMode === mode) return;
      setMode(newMode);
      setValidationError(null);

      if (newMode === 'passphrase') {
        const err = validatePassphraseOptions(passphraseOptions);
        if (err) {
          setValidationError(err);
          return;
        }
        const newPassphrase = generatePassphrase(passphraseOptions);
        setPassword(newPassphrase);
        if (enableSessionHistory) {
          const analysis = calculatePassphraseStrength(newPassphrase, passphraseOptions);
          const newItem: HistoryItem = {
            id: secureId(),
            password: newPassphrase,
            timestamp: Date.now(),
            strength: analysis.label,
            length: newPassphrase.length,
            mode: 'passphrase',
          };
          setHistory((prev) => [newItem, ...prev.slice(0, MAX_HISTORY_ITEMS - 1)]);
        }
      } else {
        const err = validatePasswordOptions(options);
        if (err) {
          setValidationError(err);
          return;
        }
        const newPassword = generatePassword(options);
        setPassword(newPassword);
        if (enableSessionHistory) {
          const analysis = calculatePasswordStrength(newPassword, options);
          const newItem: HistoryItem = {
            id: secureId(),
            password: newPassword,
            timestamp: Date.now(),
            strength: analysis.label,
            length: newPassword.length,
            mode: 'password',
          };
          setHistory((prev) => [newItem, ...prev.slice(0, MAX_HISTORY_ITEMS - 1)]);
        }
      }
    },
    [mode, passphraseOptions, options, enableSessionHistory]
  );

  // Clear history
  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  // Calculate strength based on current active mode
  const strength: StrengthAnalysis =
    mode === 'passphrase'
      ? calculatePassphraseStrength(password, passphraseOptions)
      : calculatePasswordStrength(password, options);

  return {
    isCryptoSupported,
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
    enableSessionHistory,
    setEnableSessionHistory,
    setLength,
    toggleOption,
    setSymbolMode,
    applyPreset,
    generateNewPassword: () => handleGenerate(options, true),
    clearHistory,
  };
}
