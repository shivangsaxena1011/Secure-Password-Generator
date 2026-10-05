import React from 'react';
import type { PresetKey } from '../types';
import { PRESETS } from '../utils/passwordGenerator';
import { Zap, Shield, ShieldCheck, Flame } from 'lucide-react';

interface PresetSelectorProps {
  activePreset: PresetKey | null;
  onSelectPreset: (presetKey: PresetKey) => void;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({
  activePreset,
  onSelectPreset,
}) => {
  const presetIcons: Record<PresetKey, React.ReactNode> = {
    quick: <Zap className="w-3.5 h-3.5" />,
    strong: <Shield className="w-3.5 h-3.5" />,
    'extra-strong': <ShieldCheck className="w-3.5 h-3.5" />,
    maximum: <Flame className="w-3.5 h-3.5" />,
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-200 dark:text-slate-200 light:text-slate-800">
          Presets
        </label>
        <span className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500">
          Instant profiles
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {(Object.keys(PRESETS) as PresetKey[]).map((key) => {
          const preset = PRESETS[key];
          const isActive = activePreset === key;

          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelectPreset(key)}
              title={preset.description}
              className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                isActive
                  ? 'border-teal-500 bg-teal-500/15 text-teal-300 ring-1 ring-teal-500/40 shadow-sm shadow-teal-500/10'
                  : 'border-slate-800 dark:border-slate-800 light:border-slate-200 bg-slate-900/40 dark:bg-slate-900/40 light:bg-white text-slate-400 hover:text-slate-200 dark:hover:text-slate-200 light:hover:text-slate-900 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1 font-semibold text-xs">
                {presetIcons[key]}
                <span>{preset.label}</span>
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-400 light:text-slate-500">
                {preset.options.length} chars
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
