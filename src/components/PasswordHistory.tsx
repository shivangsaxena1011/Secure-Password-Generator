import React, { useState } from 'react';
import type { HistoryItem } from '../types';
import { History, Trash2, Copy, Check, ChevronDown, ChevronUp, Eye, EyeOff, Shield } from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';

interface PasswordHistoryProps {
  history: HistoryItem[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onClear: () => void;
}

export const PasswordHistory: React.FC<PasswordHistoryProps> = ({
  history,
  isOpen,
  setIsOpen,
  onClear,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

  const handleCopy = async (id: string, password: string) => {
    const success = await copyToClipboard(password);
    if (success) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="w-full rounded-2xl border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 bg-slate-900/40 dark:bg-slate-900/40 light:bg-slate-50 transition-all">
      {/* Header Accordion Bar */}
      <div className="p-4 sm:p-5 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 text-left hover:text-white transition-colors focus:outline-none flex-1"
          aria-expanded={isOpen}
        >
          <History className="w-4 h-4 text-teal-400" />
          <span className="text-sm font-semibold text-slate-200 dark:text-slate-200 light:text-slate-800">
            Session Password History
          </span>
          <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-400 light:text-slate-600 bg-slate-800 dark:bg-slate-800 light:bg-slate-200 px-2 py-0.5 rounded-full">
            {history.length} / 5
          </span>
        </button>

        <div className="flex items-center gap-2">
          {history.length > 0 && isOpen && (
            <button
              type="button"
              onClick={onClear}
              className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 px-2.5 py-1 rounded-lg border border-rose-500/20 hover:bg-rose-500/10 transition-colors"
              title="Clear all generated passwords in this session"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 text-slate-400 hover:text-white"
            aria-label={isOpen ? 'Collapse history' : 'Expand history'}
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Accordion Content */}
      {isOpen && (
        <div className="px-4 pb-5 sm:px-5 border-t border-slate-800/60 dark:border-slate-800/60 light:border-slate-200 pt-3 animate-fadeIn">
          {/* Security badge note */}
          <div className="mb-3 text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-600 bg-slate-950/40 dark:bg-slate-950/40 light:bg-slate-100 p-2 rounded-lg border border-slate-800/40 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span>
              Volatile memory only: history is wiped when this tab is closed. No passwords are persisted to disk or servers.
            </span>
          </div>

          {history.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-4 italic">
              No previous passwords generated yet.
            </p>
          ) : (
            <div className="space-y-2">
              {history.map((item, index) => {
                const isRevealed = revealedIds.has(item.id);
                const isCopied = copiedId === item.id;
                const timeString = new Date(item.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                });

                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-950/60 dark:bg-slate-950/60 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] text-slate-400">#{index + 1}</span>
                        <span className="text-[10px] font-mono text-slate-400">{timeString}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-teal-300 font-mono">
                          {item.length} ch
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                          {item.strength}
                        </span>
                      </div>

                      {/* Password line */}
                      <p className="font-mono text-xs text-slate-200 dark:text-slate-200 light:text-slate-800 truncate select-all">
                        {isRevealed ? item.password : '•'.repeat(Math.min(item.password.length, 24))}
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => toggleReveal(item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white dark:hover:text-white light:hover:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-800 light:hover:bg-slate-100 transition-colors"
                        aria-label={isRevealed ? 'Mask password' : 'Show password'}
                        title={isRevealed ? 'Mask' : 'Reveal'}
                      >
                        {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopy(item.id, item.password)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                          isCopied
                            ? 'bg-emerald-500 text-slate-950 font-bold'
                            : 'border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200'
                        }`}
                        aria-label="Copy this password"
                        title="Copy password"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span className="text-[11px]">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span className="text-[11px]">Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
