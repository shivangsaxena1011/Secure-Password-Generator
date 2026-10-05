import React from 'react';
import { ShieldCheck, Lock, KeyRound, AlertTriangle } from 'lucide-react';

interface SecurityNoticeProps {
  id?: string;
}

export const SecurityNotice: React.FC<SecurityNoticeProps> = ({ id }) => {
  return (
    <div
      id={id}
      className="w-full rounded-2xl border border-teal-500/25 bg-gradient-to-br from-teal-950/20 via-slate-900/60 to-slate-900/60 dark:from-teal-950/20 dark:via-slate-900/60 dark:to-slate-900/60 light:from-teal-50 light:via-white light:to-slate-50 p-5 sm:p-6 shadow-lg shadow-teal-950/10"
    >
      <div className="flex items-start gap-3.5">
        <div className="p-2.5 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-400 shrink-0">
          <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
        </div>

        <div className="space-y-3">
          <div>
            <h3 className="text-base font-bold text-white dark:text-white light:text-slate-900 flex items-center gap-2">
              Privacy First & Local Execution
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 dark:text-slate-300 light:text-slate-600 mt-1 leading-relaxed">
              Passwords are generated locally in your browser using the cryptographically secure{' '}
              <code className="font-mono text-teal-300 dark:text-teal-300 light:text-teal-700 bg-slate-800/80 px-1 py-0.5 rounded text-xs">
                crypto.getRandomValues()
              </code>{' '}
              API. No password values or configurations are ever sent to a remote server, external database, or third-party service.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="flex items-start gap-2 text-xs text-slate-400 dark:text-slate-400 light:text-slate-600">
              <Lock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                <strong>Use a Password Manager:</strong> Store your generated passwords in a reputable end-to-end encrypted password manager rather than plain text notes.
              </span>
            </div>

            <div className="flex items-start gap-2 text-xs text-slate-400 dark:text-slate-400 light:text-slate-600">
              <KeyRound className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Unique Per Account:</strong> Never reuse the same password across multiple services to prevent credential stuffing compromises.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-950/40 dark:bg-slate-950/40 light:bg-slate-100 border border-slate-800/60 dark:border-slate-800/60 light:border-slate-200 text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-600">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Disclaimer:</strong> Designed to generate strong random passwords. Strength and entropy estimates are mathematical approximations based on character search spaces. No software can guarantee 100% immunity against compromised endpoints, malware, or phishing attacks.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
