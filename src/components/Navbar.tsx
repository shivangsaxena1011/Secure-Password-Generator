import React from 'react';
import { ShieldCheck, Moon, Sun, Lock } from 'lucide-react';
import type { Theme } from '../hooks/useTheme';

interface NavbarProps {
  theme: Theme;
  toggleTheme: () => void;
  onOpenSecurity: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ theme, toggleTheme, onOpenSecurity }) => {
  return (
    <header className="w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 transition-colors duration-200 dark:border-slate-800/80 dark:bg-slate-950/80 light:border-slate-200 light:bg-white/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand logo & title */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-teal-500/20 text-slate-950">
            <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-white dark:text-white light:text-slate-900">
                SecurePass
              </span>
              <span className="text-teal-400 font-semibold text-lg">Generator</span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Client-side cryptographic utility
            </p>
          </div>
        </div>

        {/* Navigation actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSecurity}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-700/60 text-slate-300 hover:text-teal-300 hover:border-teal-500/40 hover:bg-slate-800/50 transition-all dark:border-slate-700/60 dark:text-slate-300 dark:hover:text-teal-300 light:border-slate-300 light:text-slate-700 light:hover:text-teal-600 light:hover:bg-slate-100"
            aria-label="View Privacy & Security information"
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Privacy First</span>
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-slate-700/60 text-slate-300 hover:text-amber-400 hover:border-amber-400/40 hover:bg-slate-800/50 transition-all dark:border-slate-700/60 dark:text-slate-300 dark:hover:text-amber-400 light:border-slate-300 light:text-slate-700 light:hover:text-amber-600 light:hover:bg-slate-100"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 transition-transform hover:-rotate-12" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
