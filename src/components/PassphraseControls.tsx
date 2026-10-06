import React from 'react';
import type { PassphraseOptions } from '../types';
import { ALLOWED_SEPARATORS } from '../utils/passphraseGenerator';
import { Check, Minus, Plus } from 'lucide-react';

interface PassphraseControlsProps {
  options: PassphraseOptions;
  updateOptions: (updater: (prev: PassphraseOptions) => PassphraseOptions) => void;
}

export const PassphraseControls: React.FC<PassphraseControlsProps> = ({
  options,
  updateOptions,
}) => {
  const updateWordCount = (count: number) => {
    const sanitized = Math.max(3, Math.min(8, count));
    updateOptions((prev) => ({ ...prev, wordCount: sanitized }));
  };

  const updateSeparator = (separator: string) => {
    updateOptions((prev) => ({ ...prev, separator }));
  };

  const toggleOption = (key: keyof PassphraseOptions) => {
    updateOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="w-full space-y-4">
      {/* Word Count Control */}
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-semibold text-slate-200 dark:text-slate-200 light:text-slate-800">
            Number of Words
          </label>
          <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500">
            Between 3 and 8 words from curated local dictionary
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900 dark:bg-slate-900 light:bg-slate-100 p-1 rounded-xl border border-slate-700/60 dark:border-slate-700/60 light:border-slate-300">
          <button
            type="button"
            onClick={() => updateWordCount(options.wordCount - 1)}
            disabled={options.wordCount <= 3}
            className="p-1 rounded-lg text-slate-400 hover:text-white dark:hover:text-white light:hover:text-slate-900 disabled:opacity-40"
            aria-label="Decrease word count"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-10 text-center font-mono font-bold text-sm text-teal-400 dark:text-teal-400 light:text-teal-700">
            {options.wordCount}
          </span>
          <button
            type="button"
            onClick={() => updateWordCount(options.wordCount + 1)}
            disabled={options.wordCount >= 8}
            className="p-1 rounded-lg text-slate-400 hover:text-white dark:hover:text-white light:hover:text-slate-900 disabled:opacity-40"
            aria-label="Increase word count"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Separator Selection */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700">
          Word Separator
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 sm:gap-2">
          {ALLOWED_SEPARATORS.map((sep) => (
            <button
              key={sep.value}
              type="button"
              onClick={() => updateSeparator(sep.value)}
              className={`py-1.5 px-2 rounded-lg border text-xs font-mono transition-all text-center ${
                options.separator === sep.value
                  ? 'border-teal-500 bg-teal-500/15 text-teal-300 ring-1 ring-teal-500/30'
                  : 'border-slate-800 dark:border-slate-800 light:border-slate-300 bg-slate-900/40 dark:bg-slate-900/40 light:bg-white text-slate-400 hover:text-slate-200'
              }`}
            >
              {sep.label}
            </button>
          ))}
        </div>
      </div>

      {/* Options: Capitalize, Number suffix, Avoid duplicate words */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
        <button
          type="button"
          onClick={() => toggleOption('capitalize')}
          role="checkbox"
          aria-checked={options.capitalize}
          className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs transition-all ${
            options.capitalize
              ? 'border-teal-500/40 bg-teal-500/10 text-teal-300'
              : 'border-slate-800 dark:border-slate-800 light:border-slate-300 bg-slate-900/40 dark:bg-slate-900/40 light:bg-white text-slate-400'
          }`}
        >
          <div
            className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
              options.capitalize
                ? 'bg-teal-500 border-teal-400 text-slate-950 font-bold'
                : 'border-slate-700 bg-slate-800/60'
            }`}
          >
            {options.capitalize && <Check className="w-3 h-3 stroke-[3]" />}
          </div>
          <span>Capitalize Words</span>
        </button>

        <button
          type="button"
          onClick={() => toggleOption('includeNumber')}
          role="checkbox"
          aria-checked={options.includeNumber}
          className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs transition-all ${
            options.includeNumber
              ? 'border-teal-500/40 bg-teal-500/10 text-teal-300'
              : 'border-slate-800 dark:border-slate-800 light:border-slate-300 bg-slate-900/40 dark:bg-slate-900/40 light:bg-white text-slate-400'
          }`}
        >
          <div
            className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
              options.includeNumber
                ? 'bg-teal-500 border-teal-400 text-slate-950 font-bold'
                : 'border-slate-700 bg-slate-800/60'
            }`}
          >
            {options.includeNumber && <Check className="w-3 h-3 stroke-[3]" />}
          </div>
          <span>Number Suffix</span>
        </button>

        <button
          type="button"
          onClick={() => toggleOption('avoidDuplicates')}
          role="checkbox"
          aria-checked={options.avoidDuplicates}
          className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs transition-all ${
            options.avoidDuplicates
              ? 'border-teal-500/40 bg-teal-500/10 text-teal-300'
              : 'border-slate-800 dark:border-slate-800 light:border-slate-300 bg-slate-900/40 dark:bg-slate-900/40 light:bg-white text-slate-400'
          }`}
        >
          <div
            className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
              options.avoidDuplicates
                ? 'bg-teal-500 border-teal-400 text-slate-950 font-bold'
                : 'border-slate-700 bg-slate-800/60'
            }`}
          >
            {options.avoidDuplicates && <Check className="w-3 h-3 stroke-[3]" />}
          </div>
          <span>Avoid Duplicates</span>
        </button>
      </div>
    </div>
  );
};
