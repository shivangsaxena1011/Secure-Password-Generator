# SecurePass Generator

> **Generate strong, secure passwords instantly.**

SecurePass Generator is a modern, client-side cryptographic utility designed to create high-entropy, customizable passwords and memorable passphrases with zero external dependencies, zero network requests, and zero data persistence.

---

## Key Features

- **Cryptographically Secure Randomness**: Uses `window.crypto.getRandomValues()` combined with rejection sampling to eliminate modulo bias.
- **Strict Character Pool Guarantees**: Guarantees at least one character from each enabled character category (uppercase, lowercase, digits, symbols) before filling remaining positions.
- **Cryptographic Shuffling**: Employs an unbiased Fisher-Yates shuffle powered by secure random integers to ensure uniform character distribution.
- **Synchronized Length Controls**: Range slider and direct numeric stepper synchronized from 4 to 128 characters (default 16).
- **Comprehensive Password Strength Meter**: Evaluates length, character set diversity, entropy, consecutive repetitions, and sequential patterns across 5 calibrated tiers (*Very Weak*, *Weak*, *Fair*, *Strong*, *Very Strong*).
- **Estimated Shannon Entropy**: Approximates theoretical search space bits (`length × log2(pool_size)`) accompanied by brute-force time estimates and character pool metrics.
- **One-Click Presets**:
  - **Quick**: 12 characters, alphanumeric (letters & numbers).
  - **Strong**: 16 characters, all 4 categories enabled (default).
  - **Extra Strong**: 24 characters, full character pool.
  - **Maximum**: 32 characters, maximum brute-force resistance.
- **Memorable Passphrase Generator**: Optional secondary mode generating multi-word passphrases using curated wordlists, custom separators, word capitalization, and optional numeric suffixes.
- **Real Clipboard Integration**: One-click copying with animated "Copied ✓" state feedback and automatic fallback for restricted environments.
- **Volatile Session History**: Keeps the last 5 generated passwords purely in browser memory during the active session. History is completely wiped on tab closure and can be manually cleared anytime.
- **Dark & Light Themes**: Dark mode by default with modern glassmorphism, glowing accents, smooth transitions, and persistent theme preference.
- **Accessibility & Responsive Design**: Semantic HTML, full keyboard navigation, screen-reader-friendly ARIA attributes, and responsive layout across desktop, tablet, and mobile displays.

---

## Security Architecture

### Why Secure Randomness Matters

Standard pseudo-random number generators (such as `Math.random()`) are deterministic PRNGs (often based on xoshiro or Mersenne Twister). They are optimized for speed and statistical uniformity in simulations, **not for cryptographic unpredictability**. An adversary who observes a few outputs can reconstruct the internal PRNG state and predict subsequent passwords.

SecurePass Generator strictly utilizes the Web Cryptography API:

```ts
window.crypto.getRandomValues(uint32Buffer);
```

This interface draws entropy directly from underlying operating system sources (e.g., `/dev/urandom` on Unix-like systems, or `CryptGenRandom`/CNG on Windows).

### Zero Modulo Bias via Rejection Sampling

A naive mapping such as `rand % max` introduces statistical bias when the range of random integers (e.g., $2^{32}$) is not an exact multiple of `max`. SecurePass Generator employs rejection sampling:

```ts
const limit = Math.floor(4294967296 / max) * max;
do {
  cryptoInstance.getRandomValues(uint32Buffer);
  rand = uint32Buffer[0];
} while (rand >= limit);

return rand % max;
```

Any sample falling in the remainder zone is discarded, guaranteeing an exact uniform distribution across all characters.

### Password Strength & Entropy Engine

The password strength engine evaluates multiple threat vectors:

1. **Shannon Entropy Approximation**:
   $$\text{Entropy} \approx L \times \log_2(N)$$
   where $L$ is password length and $N$ is the active character pool size (e.g., $N = 26 + 26 + 10 + 27 = 89$).
2. **Character Set Diversity**: Evaluates presence of uppercase letters, lowercase letters, numerals, and special punctuation.
3. **Pattern Penalties**: Detects and penalizes:
   - Consecutive repeating characters (e.g., `aaaa`).
   - Ascending or descending sequential runs (e.g., `abc`, `123`).
   - Single-character-set monotony.

---

## Privacy First Guarantee

- **No Remote Servers**: Password generation occurs 100% locally inside the user's browser runtime.
- **No Network Requests**: The application makes zero API calls, telemetry pings, or analytics transmissions.
- **No Plaintext Logging**: Passwords are never written to browser console logs, external services, or URL query parameters.
- **No Unsolicited Persistence**: Generated passwords are never saved to `localStorage`, `sessionStorage`, or cookies. Only the user's preferred visual theme (dark/light) is stored.

---

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Testing**: Vitest + Testing Library

---

## Local Development

### Prerequisites

- Node.js (version 18+ or 20+ recommended)
- npm (or compatible package manager)

### Installation

```bash
# Install dependencies
npm install
```

### Running Locally

```bash
# Start Vite development server
npm run dev
```

The application will be available at `http://localhost:5173`.

### Running Tests

```bash
# Execute Vitest test suite
npm test

# Run tests in watch mode
npm run test:watch
```

### Linting

```bash
# Run linter
npm run lint
```

### Production Build

```bash
# Type check and build static production bundle
npm run build

# Preview production build locally
npm run preview
```

The compiled assets will be located in the `dist/` directory, ready for deployment to any static web server (such as Cloudflare Pages, Vercel, Netlify, or AWS S3/CloudFront).

---

## Security Disclaimer

SecurePass Generator is designed to produce strong, cryptographically randomized passwords and passphrases. Strength estimates and entropy scores are mathematical approximations based on search space complexity. No password utility can guarantee absolute security against compromised hardware, keyloggers, phishing attacks, or social engineering. Users are encouraged to store generated credentials in a secure, audited password manager and enable multi-factor authentication (MFA) whenever supported.
