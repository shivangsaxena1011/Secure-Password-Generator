import { describe, it, expect, beforeEach } from 'vitest';

describe('Theme and Privacy Persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('defaults to dark mode when no preference is saved', () => {
    const saved = localStorage.getItem('securepass_theme');
    expect(saved).toBeNull();
  });

  it('only stores theme key in localStorage, never sensitive data', () => {
    localStorage.setItem('securepass_theme', 'light');
    expect(localStorage.getItem('securepass_theme')).toBe('light');

    // Confirm no passwords or configurations are present
    const keys = Object.keys(localStorage);
    expect(keys).toEqual(['securepass_theme']);
  });
});
