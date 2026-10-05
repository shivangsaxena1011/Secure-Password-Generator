import React from 'react';
import { Shield, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="text-center max-w-2xl mx-auto pt-8 pb-6 px-4">
      {/* Security badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/25 mb-4 shadow-sm shadow-teal-500/10">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
        </span>
        <Shield className="w-3.5 h-3.5" />
        <span className="tracking-wider uppercase text-[11px]">Secure Password Generator</span>
      </div>

      {/* Main heading */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white dark:text-white light:text-slate-900 mb-3">
        Create stronger passwords in{' '}
        <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
          seconds.
        </span>
      </h1>

      {/* Subheading */}
      <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed dark:text-slate-400 light:text-slate-600">
        Generate unique, customizable passwords locally and securely using cryptographic browser randomness.
      </p>

      <div className="flex items-center justify-center gap-4 mt-3 text-xs text-slate-500 dark:text-slate-500 light:text-slate-500">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-teal-400" /> 100% Client-Side
        </span>
        <span>•</span>
        <span>Zero Network Requests</span>
        <span>•</span>
        <span>Zero Storage Persistence</span>
      </div>
    </div>
  );
};
