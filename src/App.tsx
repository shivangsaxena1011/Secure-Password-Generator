import React, { useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PasswordDisplay } from './components/PasswordDisplay';
import { StrengthMeter } from './components/StrengthMeter';
import { LengthControl } from './components/LengthControl';
import { CharacterOptions } from './components/CharacterOptions';
import { PresetSelector } from './components/PresetSelector';
import { PassphraseControls } from './components/PassphraseControls';
import { AdvancedInfo } from './components/AdvancedInfo';
import { PasswordHistory } from './components/PasswordHistory';
import { SecurityNotice } from './components/SecurityNotice';
import { Footer } from './components/Footer';
import { usePasswordGenerator } from './hooks/usePasswordGenerator';
import { useTheme } from './hooks/useTheme';
import { KeyRound, Sparkles, RefreshCw, AlertCircle, ShieldAlert } from 'lucide-react';

export const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const securityNoticeRef = useRef<HTMLDivElement>(null);

  const {
    isCryptoSupported,
    mode,
    setMode,
    password,
    options,
    passphraseOptions,
    setPassphraseOptions,
    activePreset,
    strength,
    validationError,
    warningMessage,
    showPassword,
    setShowPassword,
    isRegenerating,
    history,
    isHistoryOpen,
    setIsHistoryOpen,
    enableSessionHistory,
    setEnableSessionHistory,
    setLength,
    toggleOption,
    setSymbolMode,
    applyPreset,
    generateNewPassword,
    clearHistory,
  } = usePasswordGenerator();

  const scrollToSecurity = () => {
    securityNoticeRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Top Navbar */}
      <Navbar theme={theme} toggleTheme={toggleTheme} onOpenSecurity={scrollToSecurity} />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-4 flex flex-col items-center">
        {/* Crypto Unavailable Critical Warning */}
        {!isCryptoSupported && (
          <div
            role="alert"
            className="w-full max-w-2xl mb-4 p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-3"
          >
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Cryptographically Secure Randomness Unavailable</p>
              <p className="text-xs text-rose-200/80 mt-1 leading-relaxed">
                Your browser environment does not support the Web Cryptography API (<code>window.crypto.getRandomValues</code>). SecurePass Generator intentionally refuses to use insecure pseudo-random fallbacks. Please access this application using a modern, secure browser.
              </p>
            </div>
          </div>
        )}

        {/* Hero Banner */}
        <Hero />

        {/* Mode Selector Tabs (Password vs Passphrase) */}
        <div className="w-full max-w-2xl flex items-center justify-center mb-6">
          <div className="bg-slate-900/80 dark:bg-slate-900/80 light:bg-slate-200/80 p-1 rounded-2xl border border-slate-800 dark:border-slate-800 light:border-slate-300 flex items-center gap-1 shadow-inner">
            <button
              type="button"
              onClick={() => setMode('password')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                mode === 'password'
                  ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                  : 'text-slate-400 hover:text-white dark:hover:text-white light:hover:text-slate-900'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Random Password</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('passphrase')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                mode === 'passphrase'
                  ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                  : 'text-slate-400 hover:text-white dark:hover:text-white light:hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Memorable Passphrase</span>
            </button>
          </div>
        </div>

        {/* Primary Generator Workspace Card */}
        <div className="w-full max-w-2xl space-y-5">
          {/* Main Generator Card */}
          <div className="glass-panel cyber-glow rounded-3xl p-5 sm:p-7 space-y-6 shadow-2xl relative overflow-hidden transition-all duration-300">
            {/* Top decorative gradient glow line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-cyan-400 to-emerald-400" />

            {/* Validation Error Banner */}
            {validationError && (
              <div
                role="alert"
                className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center gap-2.5 animate-fadeIn"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* 1. Password Display & Output Area */}
            <PasswordDisplay
              password={password}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              onRegenerate={generateNewPassword}
              isRegenerating={isRegenerating}
            />

            {/* 2. Password Strength Estimate Meter */}
            <StrengthMeter strength={strength} />

            {/* 3. Controls based on active mode */}
            {mode === 'password' ? (
              <div className="space-y-6 pt-2">
                {/* Length slider & direct numeric input with quick length buttons */}
                <LengthControl length={options.length} setLength={setLength} />

                {/* Character category toggles & symbol compatibility */}
                <CharacterOptions
                  options={options}
                  toggleOption={toggleOption}
                  setSymbolMode={setSymbolMode}
                  warningMessage={warningMessage}
                />

                {/* Quick Presets */}
                <PresetSelector activePreset={activePreset} onSelectPreset={applyPreset} />
              </div>
            ) : (
              <div className="pt-2">
                <PassphraseControls
                  options={passphraseOptions}
                  setOptions={setPassphraseOptions}
                  onGenerate={generateNewPassword}
                />
              </div>
            )}

            {/* 4. Primary "Generate Password" Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={generateNewPassword}
                disabled={!isCryptoSupported}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-teal-500 via-teal-400 to-cyan-400 hover:from-teal-400 hover:to-cyan-300 text-slate-950 font-bold text-base tracking-wide shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 active:scale-[0.99] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-teal-400/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw
                  className={`w-5 h-5 transition-transform duration-300 ${
                    isRegenerating ? 'rotate-180' : ''
                  }`}
                />
                <span>
                  {mode === 'password' ? 'Generate Password' : 'Generate Passphrase'}
                </span>
              </button>
            </div>
          </div>

          {/* Advanced Metrics & Estimated Search-Space Entropy */}
          <AdvancedInfo strength={strength} />

          {/* In-Memory Local Password History (Session-only, Opt-in) */}
          <PasswordHistory
            history={history}
            isOpen={isHistoryOpen}
            setIsOpen={setIsHistoryOpen}
            enableSessionHistory={enableSessionHistory}
            setEnableSessionHistory={setEnableSessionHistory}
            onClear={clearHistory}
          />

          {/* Security & Privacy Architecture Principles */}
          <div ref={securityNoticeRef}>
            <SecurityNotice id="privacy-notice" />
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
