import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 mt-16 py-8 text-center text-xs text-slate-500 dark:text-slate-500 light:text-slate-500 transition-colors">
      <div className="max-w-4xl mx-auto px-4 space-y-2">
        <div className="flex items-center justify-center gap-2 text-slate-400 dark:text-slate-400 light:text-slate-600 font-medium">
          <ShieldCheck className="w-4 h-4 text-teal-400" />
          <span>SecurePass Generator — Client-side cryptographic utility</span>
        </div>
        <p className="max-w-xl mx-auto text-[11px] text-slate-500 leading-relaxed">
          Passwords are generated entirely inside your browser using hardware-backed cryptographic randomness. Strength estimates are approximate. Always use unique passwords paired with multi-factor authentication (MFA).
        </p>
        <p className="text-[10px] text-slate-600 dark:text-slate-600 light:text-slate-400 pt-1">
          Zero data collection • Zero tracking cookies • Zero server transmission
        </p>
      </div>
    </footer>
  );
};
