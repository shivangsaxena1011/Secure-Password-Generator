import React from 'react';
import type { PasswordOptions } from '../types';
import { Check, AlertCircle } from 'lucide-react';

interface CharacterOptionsProps {
  options: PasswordOptions;
  toggleOption: (key: keyof PasswordOptions) => void;
  warningMessage: string | null;
}

export const CharacterOptions: React.FC<CharacterOptionsProps> = ({
  options,
  toggleOption,
  warningMessage,
}) => {
  const categories = [
    {
      key: 'uppercase' as const,
      label: 'Uppercase Letters',
      chars: 'A-Z',
      example: 'ABC...',
    },
    {
      key: 'lowercase' as const,
      label: 'Lowercase Letters',
      chars: 'a-z',
      example: 'abc...',
    },
    {
      key: 'numbers' as const,
      label: 'Numbers',
      chars: '0-9',
      example: '123...',
    },
    {
      key: 'symbols' as const,
      label: 'Symbols',
      chars: '!@#$...',
      example: '!@#$%^&*()-_=+',
    },
  ];

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-200 dark:text-slate-200 light:text-slate-800">
          Character Types
        </label>
        <span className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500">
          At least one required
        </span>
      </div>

      {/* Warning message if user tries to disable the last category */}
      {warningMessage && (
        <div
          role="alert"
          className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs flex items-center gap-2 animate-fadeIn"
        >
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>{warningMessage}</span>
        </div>
      )}

      {/* Grid of 4 core character category toggles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {categories.map(({ key, label, chars, example }) => {
          const checked = options[key] ?? false;

          return (
            <button
              key={key}
              type="button"
              onClick={() => toggleOption(key)}
              role="checkbox"
              aria-checked={checked}
              aria-label={`Include ${label}`}
              className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                checked
                  ? 'border-teal-500/40 bg-teal-500/10 dark:bg-teal-500/10 light:bg-teal-50/80 shadow-sm'
                  : 'border-slate-800 dark:border-slate-800 light:border-slate-200 bg-slate-900/40 dark:bg-slate-900/40 light:bg-white text-slate-400 hover:border-slate-700 dark:hover:border-slate-700 light:hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {/* Styled checkbox box */}
                <div
                  className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                    checked
                      ? 'bg-teal-500 border-teal-400 text-slate-950 font-bold'
                      : 'border-slate-600 dark:border-slate-600 light:border-slate-300 bg-slate-800 dark:bg-slate-800 light:bg-slate-100'
                  }`}
                >
                  {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>

                <div>
                  <span
                    className={`text-xs font-semibold block ${
                      checked
                        ? 'text-white dark:text-white light:text-slate-900'
                        : 'text-slate-400 dark:text-slate-400 light:text-slate-600'
                    }`}
                  >
                    {label}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-500 light:text-slate-400">
                    {chars}
                  </span>
                </div>
              </div>

              {/* Sample character pill */}
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800/80 dark:bg-slate-800/80 light:bg-slate-100 text-slate-400 dark:text-slate-400 light:text-slate-600 hidden xs:inline">
                {example.length > 5 ? example.slice(0, 5) + '…' : example}
              </span>
            </button>
          );
        })}
      </div>

      {/* Advanced optional enhancements (Requirement 35A) */}
      <div className="pt-2 border-t border-slate-800/60 dark:border-slate-800/60 light:border-slate-200">
        <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-500 light:text-slate-400 block mb-2">
          Security & Usability Enhancements
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Exclude ambiguous characters */}
          <button
            type="button"
            onClick={() => toggleOption('excludeSimilar')}
            role="checkbox"
            aria-checked={options.excludeSimilar}
            className={`flex items-center gap-2 p-2 rounded-lg border text-left text-xs transition-all ${
              options.excludeSimilar
                ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300'
                : 'border-slate-800/60 dark:border-slate-800/60 light:border-slate-200 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div
              className={`w-4 h-4 rounded flex items-center justify-center border text-[10px] ${
                options.excludeSimilar
                  ? 'bg-cyan-500 border-cyan-400 text-slate-950 font-bold'
                  : 'border-slate-700 bg-slate-800/60'
              }`}
            >
              {options.excludeSimilar && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
            <span>Avoid ambiguous chars (O, 0, l, 1, I)</span>
          </button>

          {/* Avoid consecutive repeats */}
          <button
            type="button"
            onClick={() => toggleOption('avoidRepeated')}
            role="checkbox"
            aria-checked={options.avoidRepeated}
            className={`flex items-center gap-2 p-2 rounded-lg border text-left text-xs transition-all ${
              options.avoidRepeated
                ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300'
                : 'border-slate-800/60 dark:border-slate-800/60 light:border-slate-200 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div
              className={`w-4 h-4 rounded flex items-center justify-center border text-[10px] ${
                options.avoidRepeated
                  ? 'bg-cyan-500 border-cyan-400 text-slate-950 font-bold'
                  : 'border-slate-700 bg-slate-800/60'
              }`}
            >
              {options.avoidRepeated && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
            <span>Avoid consecutive duplicates</span>
          </button>
        </div>
      </div>
    </div>
  );
};
