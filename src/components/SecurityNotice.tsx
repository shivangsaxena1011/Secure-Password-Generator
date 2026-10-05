import React from 'react';
import { ShieldCheck, HardDrive, FileText, Clock, KeyRound, CheckCircle2 } from 'lucide-react';

interface SecurityNoticeProps {
  id?: string;
}

export const SecurityNotice: React.FC<SecurityNoticeProps> = ({ id }) => {
  const principles = [
    {
      icon: <ShieldCheck className="w-4 h-4 text-teal-400" />,
      title: 'Local Generation',
      description: 'Passwords and passphrases are generated entirely within your browser.',
    },
    {
      icon: <HardDrive className="w-4 h-4 text-cyan-400" />,
      title: 'No Remote Storage',
      description: 'Generated credentials are never sent to any backend, server, or cloud service.',
    },
    {
      icon: <FileText className="w-4 h-4 text-emerald-400" />,
      title: 'No Password Logging',
      description: 'Generated credentials are never written to telemetry, URLs, or console logs.',
    },
    {
      icon: <Clock className="w-4 h-4 text-amber-400" />,
      title: 'Session-Only History',
      description: 'History is optional, stored in temporary browser memory only, and wiped on close.',
    },
    {
      icon: <KeyRound className="w-4 h-4 text-teal-400" />,
      title: 'Use a Password Manager',
      description: 'Store credentials in a dedicated encrypted password manager rather than plain notes.',
    },
    {
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
      title: 'Enable MFA',
      description: 'Pair strong credentials with multi-factor authentication wherever supported.',
    },
  ];

  return (
    <section
      id={id}
      aria-label="Security and Privacy Principles"
      className="w-full rounded-2xl border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 bg-slate-900/40 dark:bg-slate-900/40 light:bg-slate-50 p-5 sm:p-6 transition-all"
    >
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck className="w-5 h-5 text-teal-400" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 dark:text-slate-200 light:text-slate-800">
          Security & Privacy Architecture
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {principles.map((item) => (
          <div
            key={item.title}
            className="p-3 rounded-xl bg-slate-950/60 dark:bg-slate-950/60 light:bg-white border border-slate-800/60 dark:border-slate-800/60 light:border-slate-200 space-y-1"
          >
            <div className="flex items-center gap-2">
              {item.icon}
              <h3 className="text-xs font-semibold text-slate-100 dark:text-slate-100 light:text-slate-900">
                {item.title}
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-600 leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
