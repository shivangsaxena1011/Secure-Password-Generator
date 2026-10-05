import React from 'react';
import { Copy, Check, RefreshCw, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useClipboard } from '../hooks/useClipboard';

interface PasswordDisplayProps {
  password: string;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  onRegenerate: () => void;
  isRegenerating: boolean;
}

export const PasswordDisplay: React.FC<PasswordDisplayProps> = ({
  password,
  showPassword,
  setShowPassword,
  onRegenerate,
  isRegenerating,
}) => {
  const { copied, errorMessage, copy } = useClipboard(2000);

  // Masked string representation
  const maskedPassword = '•'.repeat(Math.min(password.length, 36));

  const handleCopy = () => {
    copy(password);
  };

  return (
    <div className="w-full">
      {/* Container box with glowing border and subtle glass effect */}
      <div className="relative rounded-2xl p-4 sm:p-5 bg-slate-900/90 dark:bg-slate-900/90 light:bg-slate-100/90 border border-slate-700/60 dark:border-slate-700/60 light:border-slate-300 shadow-xl transition-all duration-200">
        
        {/* Top row: Label & Length badge */}
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400 light:text-slate-500">
            Generated Password
          </label>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 dark:bg-slate-800 light:bg-slate-200 text-teal-400 dark:text-teal-400 light:text-teal-700 border border-teal-500/20">
              {password.length} chars
            </span>
          </div>
        </div>

        {/* Middle row: Password string with scroll & action controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Output text area */}
          <div
            className={`flex-1 overflow-x-auto custom-scroll py-2 px-3 rounded-xl bg-slate-950/70 dark:bg-slate-950/70 light:bg-white border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 min-h-[52px] flex items-center transition-all ${
              isRegenerating ? 'opacity-50 scale-[0.99]' : 'opacity-100 scale-100'
            }`}
            title="Generated Password (select and scroll if long)"
          >
            <span
              className="font-mono text-base sm:text-xl tracking-wider select-all whitespace-pre text-teal-300 dark:text-teal-300 light:text-teal-800 font-semibold break-keep"
              data-testid="generated-password-text"
            >
              {showPassword ? password : maskedPassword}
            </span>
          </div>

          {/* Quick inline buttons - full width on mobile for easy thumb tapping */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Show / Hide toggle */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-2.5 rounded-xl border border-slate-700/70 dark:border-slate-700/70 light:border-slate-300 bg-slate-800/70 dark:bg-slate-800/70 light:bg-white text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-white dark:hover:text-white light:hover:text-slate-900 hover:bg-slate-700/60 dark:hover:bg-slate-700/60 light:hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all shrink-0"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>

            {/* Regenerate quick icon button */}
            <button
              type="button"
              onClick={onRegenerate}
              className="p-2.5 rounded-xl border border-slate-700/70 dark:border-slate-700/70 light:border-slate-300 bg-slate-800/70 dark:bg-slate-800/70 light:bg-white text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-teal-400 dark:hover:text-teal-400 light:hover:text-teal-600 hover:bg-slate-700/60 dark:hover:bg-slate-700/60 light:hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all shrink-0"
              aria-label="Regenerate password"
              title="Regenerate password"
            >
              <RefreshCw
                className={`w-5 h-5 transition-transform duration-300 ${
                  isRegenerating ? 'rotate-180 text-teal-400' : ''
                }`}
              />
            </button>

            {/* Prominent Copy Button */}
            <button
              type="button"
              onClick={handleCopy}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 shadow-md ${
                copied
                  ? 'bg-emerald-500 text-slate-950 font-semibold ring-2 ring-emerald-400'
                  : 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-semibold hover:shadow-teal-500/25 active:scale-95'
              }`}
              aria-label="Copy Password to Clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Copied ✓</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 stroke-[2.5]" />
                  <span>Copy Password</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Clipboard error message if any */}
        {errorMessage && (
          <div className="mt-2.5 p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-1.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};
