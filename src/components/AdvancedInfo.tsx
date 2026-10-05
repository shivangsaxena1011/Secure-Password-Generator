import React, { useState } from 'react';
import type { StrengthAnalysis } from '../types';
import { getEntropyRating } from '../utils/entropy';
import { ChevronDown, ChevronUp, Cpu, Info, KeyRound, Layers } from 'lucide-react';
import { PASSPHRASE_WORDS } from '../utils/passphraseGenerator';

interface AdvancedInfoProps {
  strength: StrengthAnalysis;
}

export const AdvancedInfo: React.FC<AdvancedInfoProps> = ({ strength }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { entropy, length, characterTypes, poolSize, hasRepetition, hasSequential, entropyModel } = strength;
  const rating = getEntropyRating(entropy);

  return (
    <div className="w-full rounded-2xl border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 bg-slate-900/40 dark:bg-slate-900/40 light:bg-slate-50 transition-all">
      {/* Toggle header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-800/30 dark:hover:bg-slate-800/30 light:hover:bg-slate-100/60 rounded-2xl transition-colors focus:outline-none"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-semibold text-slate-200 dark:text-slate-200 light:text-slate-800">
            {entropyModel === 'passphrase' ? 'Estimated Passphrase Entropy' : 'Estimated Search-Space Entropy'}
          </span>
          <span className="text-xs font-mono font-bold text-teal-400 dark:text-teal-400 light:text-teal-700 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">
            ~{entropy} bits
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="hidden sm:inline">{isOpen ? 'Hide metrics' : 'Show metrics'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded Metrics Details */}
      {isOpen && (
        <div className="px-4 pb-5 sm:px-5 space-y-4 pt-1 border-t border-slate-800/60 dark:border-slate-800/60 light:border-slate-200 animate-fadeIn">
          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Entropy */}
            <div className="p-3 rounded-xl bg-slate-950/60 dark:bg-slate-950/60 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                {entropyModel === 'passphrase' ? 'Passphrase Entropy' : 'Search-Space Entropy'}
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold font-mono text-teal-300 dark:text-teal-300 light:text-teal-700">
                  {entropy}
                </span>
                <span className="text-xs text-slate-400">bits</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Rating: <strong className="text-slate-200 dark:text-slate-200 light:text-slate-700">{rating.label}</strong>
              </span>
            </div>

            {/* Complexity Tier */}
            <div className="p-3 rounded-xl bg-slate-950/60 dark:bg-slate-950/60 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Search Space Size
              </span>
              <div className="flex items-baseline gap-1.5">
                <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-sm font-bold font-mono text-slate-200 dark:text-slate-200 light:text-slate-800 truncate">
                  {rating.complexityTier}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block truncate">
                {rating.description}
              </span>
            </div>

            {/* Pool Size or Wordlist Size */}
            <div className="p-3 rounded-xl bg-slate-950/60 dark:bg-slate-950/60 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                {entropyModel === 'passphrase' ? 'Dictionary Size' : 'Character Pool Size'}
              </span>
              <div className="flex items-baseline gap-1.5">
                <KeyRound className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xl font-bold font-mono text-emerald-400 dark:text-emerald-400 light:text-emerald-700">
                  {entropyModel === 'passphrase' ? PASSPHRASE_WORDS.length : poolSize}
                </span>
                <span className="text-xs text-slate-400">
                  {entropyModel === 'passphrase' ? 'unique words' : 'characters'}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                {entropyModel === 'passphrase'
                  ? `~${Math.log2(PASSPHRASE_WORDS.length).toFixed(1)} bits per word`
                  : `${characterTypes} active types across ${length} positions`}
              </span>
            </div>
          </div>

          {/* Pattern Advisory if applicable */}
          {(hasRepetition || hasSequential) && (
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
              <div>
                <p className="font-semibold">Pattern Advisory:</p>
                <p className="text-amber-200/80 text-[11px]">
                  {hasRepetition && 'Consecutive duplicate characters detected. '}
                  {hasSequential && 'Sequential runs detected. '}
                  Detectable patterns can reduce practical brute-force resistance.
                </p>
              </div>
            </div>
          )}

          {/* Formula explanation */}
          <div className="text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-600 bg-slate-950/40 dark:bg-slate-950/40 light:bg-slate-100 p-2.5 rounded-lg border border-slate-800/40 leading-relaxed space-y-1">
            <p>
              <span className="font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700">
                Formula:
              </span>{' '}
              {entropyModel === 'passphrase' ? (
                <code className="font-mono bg-slate-800 px-1 py-0.5 rounded text-teal-300">
                  wordCount × log2(wordListSize) + [numericSuffixBits]
                </code>
              ) : (
                <code className="font-mono bg-slate-800 px-1 py-0.5 rounded text-teal-300">
                  length × log2(character_pool_size)
                </code>
              )}
            </p>
            <p>
              This is a theoretical search-space estimate based on uniform random selection from the configured options. Real-world resilience also depends on password hashing cost, storage security, and authentication rate limits.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
