import React from 'react';
import type { StrengthAnalysis } from '../types';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

interface StrengthMeterProps {
  strength: StrengthAnalysis;
}

export const StrengthMeter: React.FC<StrengthMeterProps> = ({ strength }) => {
  const { score, label, length, characterTypes, feedback, explanation, entropyModel } = strength;

  const getSegmentColor = (segmentIndex: number) => {
    if (segmentIndex > score) {
      return 'bg-slate-800/80 dark:bg-slate-800/80 light:bg-slate-200';
    }
    switch (score) {
      case 0:
        return 'bg-red-500 shadow-sm shadow-red-500/50';
      case 1:
        return 'bg-orange-500 shadow-sm shadow-orange-500/50';
      case 2:
        return 'bg-amber-400 shadow-sm shadow-amber-400/50';
      case 3:
        return 'bg-cyan-400 shadow-sm shadow-cyan-400/50';
      case 4:
        return 'bg-emerald-400 shadow-sm shadow-emerald-400/50';
      default:
        return 'bg-teal-500';
    }
  };

  const getBadgeStyle = () => {
    switch (score) {
      case 0:
        return 'text-red-400 border-red-500/30 bg-red-500/10';
      case 1:
        return 'text-orange-400 border-orange-500/30 bg-orange-500/10';
      case 2:
        return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
      case 3:
        return 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10';
      case 4:
        return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      default:
        return 'text-teal-400 border-teal-500/30 bg-teal-500/10';
    }
  };

  return (
    <div className="w-full rounded-2xl p-4 sm:p-5 bg-slate-900/60 dark:bg-slate-900/60 light:bg-slate-50 border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200">
      {/* Top Header: Label & Strength Status */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {score >= 3 ? (
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          ) : (
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          )}
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400 light:text-slate-500">
            Password Strength Estimate
          </span>
        </div>

        {/* Classification Badge */}
        <span
          className={`text-xs font-bold px-2.5 py-0.5 rounded-full border transition-colors ${getBadgeStyle()}`}
          data-testid="strength-label"
        >
          {label}
        </span>
      </div>

      {/* 5-segment Visual Strength Bar */}
      <div
        className="grid grid-cols-5 gap-1.5 sm:gap-2 h-2.5 w-full rounded-full overflow-hidden mb-3"
        role="progressbar"
        aria-valuenow={score + 1}
        aria-valuemin={1}
        aria-valuemax={5}
        aria-label={`Password strength estimate: ${label}`}
      >
        {[0, 1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className={`h-full rounded-full transition-all duration-300 ${getSegmentColor(index)}`}
          />
        ))}
      </div>

      {/* Metadata & Explanatory Caveat */}
      <div className="space-y-1.5 pt-1 border-t border-slate-800/50 dark:border-slate-800/50 light:border-slate-200 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 text-slate-400 dark:text-slate-400 light:text-slate-600">
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-200 dark:text-slate-200 light:text-slate-700">
              {length} characters
            </span>
            {entropyModel === 'search-space' && (
              <>
                <span>•</span>
                <span className="font-medium text-slate-200 dark:text-slate-200 light:text-slate-700">
                  {characterTypes} character type{characterTypes !== 1 ? 's' : ''}
                </span>
              </>
            )}
          </div>

          {feedback.length > 0 && (
            <span className="text-slate-400 dark:text-slate-400 light:text-slate-500 text-[11px] italic">
              {feedback[0]}
            </span>
          )}
        </div>

        <p className="text-[10px] text-slate-500 dark:text-slate-500 light:text-slate-400 leading-tight">
          {explanation}
        </p>
      </div>
    </div>
  );
};
