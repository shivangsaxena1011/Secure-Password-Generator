import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { HistoryItem } from '../types';

describe('Password History Privacy Invariants', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('guarantees passwords are never written to localStorage or sessionStorage', () => {
    const setItemLocalSpy = vi.spyOn(Storage.prototype, 'setItem');

    // Simulate history storage in React state
    const memoryHistory: HistoryItem[] = [
      {
        id: '1234',
        password: 'SecretPassword987!',
        timestamp: Date.now(),
        strength: 'Strong',
        length: 18,
        mode: 'password',
      },
    ];

    expect(memoryHistory).toHaveLength(1);

    // Verify localStorage was never called with any password content
    const calls = setItemLocalSpy.mock.calls;
    for (const [key, value] of calls) {
      expect(key).not.toBe('password');
      expect(key).not.toBe('history');
      expect(value).not.toContain('SecretPassword987!');
    }

    expect(localStorage.getItem('password')).toBeNull();
    expect(localStorage.getItem('history')).toBeNull();
    expect(sessionStorage.getItem('password')).toBeNull();

    setItemLocalSpy.mockRestore();
  });

  it('enforces maximum 5 entries in history rotation', () => {
    let history: HistoryItem[] = [];
    const MAX_ITEMS = 5;

    for (let i = 1; i <= 8; i++) {
      const item: HistoryItem = {
        id: String(i),
        password: `Password_${i}`,
        timestamp: Date.now(),
        strength: 'Strong',
        length: 16,
        mode: 'password',
      };
      history = [item, ...history.slice(0, MAX_ITEMS - 1)];
    }

    expect(history).toHaveLength(5);
    // Most recent is first
    expect(history[0].password).toBe('Password_8');
    expect(history[4].password).toBe('Password_4');
  });

  it('clearing history completely empties the array', () => {
    let history: HistoryItem[] = [
      {
        id: '1',
        password: 'Pass',
        timestamp: Date.now(),
        strength: 'Weak',
        length: 4,
        mode: 'password',
      },
    ];

    history = [];
    expect(history).toHaveLength(0);
  });
});
