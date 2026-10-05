import React, { useState } from 'react';
import { MIN_LENGTH, MAX_LENGTH } from '../utils/passwordGenerator';
import { Minus, Plus } from 'lucide-react';

interface LengthControlProps {
  length: number;
  setLength: (length: number) => void;
}

export const LengthControl: React.FC<LengthControlProps> = ({ length, setLength }) => {
  const [draftValue, setDraftValue] = useState<string | null>(null);
  const displayValue = draftValue !== null ? draftValue : String(length);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setDraftValue(null);
    setLength(val);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valStr = e.target.value;
    setDraftValue(valStr);

    const parsed = parseInt(valStr, 10);
    if (!isNaN(parsed) && parsed >= MIN_LENGTH && parsed <= MAX_LENGTH) {
      setLength(parsed);
    }
  };

  const handleInputBlur = () => {
    if (draftValue !== null) {
      const parsed = parseInt(draftValue, 10);
      if (isNaN(parsed) || parsed < MIN_LENGTH) {
        setLength(MIN_LENGTH);
      } else if (parsed > MAX_LENGTH) {
        setLength(MAX_LENGTH);
      } else {
        setLength(parsed);
      }
      setDraftValue(null);
    }
  };

  const increment = () => {
    if (length < MAX_LENGTH) {
      setDraftValue(null);
      setLength(length + 1);
    }
  };

  const decrement = () => {
    if (length > MIN_LENGTH) {
      setDraftValue(null);
      setLength(length - 1);
    }
  };

  // Calculate percentage for styling the custom slider track fill
  const percentage = ((length - MIN_LENGTH) / (MAX_LENGTH - MIN_LENGTH)) * 100;

  return (
    <div className="w-full space-y-3">
      {/* Label and synchronized direct numeric value control */}
      <div className="flex items-center justify-between">
        <div>
          <label
            htmlFor="password-length-slider"
            className="text-sm font-semibold text-slate-200 dark:text-slate-200 light:text-slate-800"
          >
            Password Length
          </label>
          <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500">
            Between {MIN_LENGTH} and {MAX_LENGTH} characters
          </p>
        </div>

        {/* Stepper + Numeric Input */}
        <div className="flex items-center gap-1.5 bg-slate-900 dark:bg-slate-900 light:bg-slate-100 p-1 rounded-xl border border-slate-700/60 dark:border-slate-700/60 light:border-slate-300">
          <button
            type="button"
            onClick={decrement}
            disabled={length <= MIN_LENGTH}
            className="p-1 rounded-lg text-slate-400 hover:text-white dark:hover:text-white light:hover:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-800 light:hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Decrease password length"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <input
            id="password-length-input"
            type="number"
            min={MIN_LENGTH}
            max={MAX_LENGTH}
            value={displayValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            aria-label="Direct password length numeric input"
            className="w-12 text-center font-mono font-bold text-sm bg-transparent text-teal-400 dark:text-teal-400 light:text-teal-700 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />

          <button
            type="button"
            onClick={increment}
            disabled={length >= MAX_LENGTH}
            className="p-1 rounded-lg text-slate-400 hover:text-white dark:hover:text-white light:hover:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-800 light:hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Increase password length"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Slider input */}
      <div className="relative pt-1 pb-1">
        <input
          id="password-length-slider"
          type="range"
          min={MIN_LENGTH}
          max={MAX_LENGTH}
          value={length}
          onChange={handleSliderChange}
          aria-label="Password length slider"
          aria-valuenow={length}
          aria-valuemin={MIN_LENGTH}
          aria-valuemax={MAX_LENGTH}
          style={{
            background: `linear-gradient(to right, #14b8a6 ${percentage}%, #334155 ${percentage}%)`,
          }}
          className="w-full h-2 rounded-full cursor-pointer transition-all focus:ring-2 focus:ring-teal-500/50"
        />

        {/* Min and Max helper markers */}
        <div className="flex justify-between text-[11px] font-mono text-slate-500 dark:text-slate-500 light:text-slate-400 mt-1.5">
          <span>{MIN_LENGTH}</span>
          <span className="text-teal-400 font-semibold">{length}</span>
          <span>{MAX_LENGTH}</span>
        </div>
      </div>
    </div>
  );
};
