# SecurePass Generator

> **Generate strong, secure passwords and passphrases instantly.**

SecurePass Generator is a privacy-first, client-side cryptographic security utility built with React, TypeScript, and Tailwind CSS. It produces high-entropy randomized passwords and memorable passphrases with zero external network requests, zero backend dependencies, and zero persistent credential storage.

---

## Key Features

- **Hardware-Backed Cryptographic Randomness**: Powered exclusively by the Web Cryptography API (`window.crypto.getRandomValues()`) with rejection sampling to eliminate modulo bias. Does not fall back to insecure pseudo-random sources (`Math.random()`).
- **Strict Category Guarantees**: Guarantees at least one character from each enabled character category (uppercase, lowercase, numerals, symbols) whenever requested length allows.
- **Strict Consecutive Duplicate Invariant (`avoidRepeated`)**: Enforces `password[i] !== password[i + 1]` across all adjacent character positions without best-effort compromises.
- **Ambiguous Character Filter**: Exclude visually confusing characters (such as `O`/`0`, `I`/`l`/`1`) to enhance usability and prevent transcription errors.
- **Symbol Compatibility Modes**:
  - **Standard Set** (27 symbols): `!@#$%^&*()-_=+[]{};:,.?/<>~`
  - **Compatible Set** (14 symbols): `!@#$%^&*()-_=+` (ideal for legacy banking systems and restrictive enterprise portals).
- **Synchronized Length Controls**: Range slider, direct numeric stepper, and one-click quick length buttons (`12`, `16`, `20`, `32`, `64`).
- **Carefully Calibrated Strength Estimate**:
  - Wording: *Password Strength Estimate*
  - Heuristics based on length, character diversity, consecutive repetitions, sequential runs, and search space.
  - 5 tiers: *Very Weak*, *Weak*, *Fair*, *Strong*, and *Very Strong*.
- **Estimated Search-Space Entropy**:
  - **Character Passwords**: Approximated as $L \times \log_2(N)$ bits, where $L$ is password length and $N$ is active character pool size.
  - **Passphrases**: Dedicated model based on wordlist size and options: $\text{wordCount} \times \log_2(\text{wordListSize}) + \text{suffixBits}$.
  - Search-space complexity descriptions ($~2^B$ combinations) replacing misleading crack-time claims.
- **Memorable Passphrase Generator**:
  - Bundled local dictionary of 400+ distinct English words (zero remote downloads).
  - Configurable word counts (3 to 8).
  - Multiple separators (`-`, `_`, `.`, `+`, space).
  - Word capitalization toggle.
  - Optional random 2-digit numeric suffix (`10`–`99`).
  - **Avoid duplicate words** mode ensuring unique words per passphrase.
- **Session-Only Memory History**:
  - Opt-in session history toggle.
  - Keeps at most 5 generated credentials purely in volatile React state.
  - Completely erased when the tab or browser session is closed.
  - No credential data is ever persisted to `localStorage`, `sessionStorage`, cookies, or IndexedDB.
- **Dark & Light Mode**: Default dark theme with high-contrast glassmorphism and persistent theme preference.
- **Zero Remote Dependencies & True Offline Execution**: No external Google Fonts, no external CDNs, and no analytics or telemetry scripts.
- **Production-Ready Vercel Configuration**: Pre-configured with strict security headers (Content-Security-Policy, X-Content-Type-Options: nosniff, Referrer-Policy, Permissions-Policy).

---

## Security Architecture

### Cryptographic Randomness & Rejection Sampling

Standard PRNGs (such as `Math.random()`) are predictable and inappropriate for cryptographic key generation. SecurePass Generator uses operating system entropy via the Web Crypto API:

```ts
const cryptoInstance = window.crypto;
cryptoInstance.getRandomValues(uint32Buffer);
```

To eliminate modulo bias when mapping 32-bit random integers into bounded ranges $[0, \text{max})$, rejection sampling discards values falling beyond the largest multiple of `max` $\le 2^{32}$:

```ts
const limit = Math.floor(4294967296 / max) * max;
do {
  cryptoInstance.getRandomValues(uint32Buffer);
  rand = uint32Buffer[0];
} while (rand >= limit);

return rand % max;
```

### Safe Failure Guarantee

If the Web Cryptography API is unavailable in an execution environment (e.g. archaic browsers or insecure contexts), SecurePass Generator refuses to generate passwords and displays a clear security alert. It **never** silently falls back to pseudo-random numbers.

### Theoretical Search-Space Entropy Models

1. **Character Mode**:
   $$\text{Entropy} \approx L \times \log_2(N)$$
   Calculates theoretical search space based on uniform distribution across the selected character pool.

2. **Passphrase Mode**:
   $$\text{Entropy} \approx W \times \log_2(D) + (\text{suffix ? } \log_2(90) : 0)$$
   where $W$ is the word count and $D$ is the dictionary size.

---

## Privacy Architecture

- **Client-Side Only**: All logic executes directly in the user's browser runtime.
- **Zero Remote Storage**: Passwords are never sent over the network or saved to remote databases.
- **Zero Password Logging**: Passwords are never written to `console.log`, analytics trackers, or URLs.
- **Zero External Fonts or Assets**: Operates entirely from bundled static assets.

---

## Local Development

### Prerequisites

- Node.js 18+ or 20+
- npm

### Installation

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

The application runs on `http://localhost:5173`.

### Run Tests

```bash
# Run test suite
npm test

# Run tests in watch mode
npm run test:watch
```

### Run Linter

```bash
npm run lint
```

### Production Build

```bash
# Type check and build static production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## Vercel Deployment

Deploying to Vercel is seamless:

1. Push your repository to GitHub.
2. In the Vercel dashboard, click **Add New Project** and import the repository.
3. Vercel automatically detects the Vite build configuration:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy**.

Security headers (CSP, X-Content-Type-Options, etc.) are applied automatically via `vercel.json`.

---

## Security Disclaimer

SecurePass Generator is designed to generate strong random passwords and passphrases locally. Strength and entropy estimates are mathematical approximations based on search-space complexity. No password generator can guarantee 100% immunity against compromised endpoints, malware, keyloggers, or phishing attacks. Users are advised to store credentials in a reputable encrypted password manager and enable multi-factor authentication (MFA) on all critical accounts.
