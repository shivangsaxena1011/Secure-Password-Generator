import { describe, it, expect, vi } from 'vitest';
import { secureRandomInt, secureShuffle, secureId } from '../utils/random';

describe('secureRandomInt', () => {
  it('returns 0 when max is 0 or 1', () => {
    expect(secureRandomInt(0)).toBe(0);
    expect(secureRandomInt(1)).toBe(0);
  });

  it('always produces numbers within [0, max)', () => {
    const max = 10;
    for (let i = 0; i < 100; i++) {
      const val = secureRandomInt(max);
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThan(max);
    }
  });

  it('uses crypto.getRandomValues and does not call Math.random', () => {
    const mathRandomSpy = vi.spyOn(Math, 'random');
    secureRandomInt(50);
    expect(mathRandomSpy).not.toHaveBeenCalled();
    mathRandomSpy.mockRestore();
  });
});

describe('secureShuffle', () => {
  it('preserves array length and all original elements', () => {
    const original = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const shuffled = secureShuffle(original);

    expect(shuffled).toHaveLength(original.length);
    expect(new Set(shuffled)).toEqual(new Set(original));
  });

  it('does not mutate the source array in place', () => {
    const original = ['a', 'b', 'c', 'd'];
    const copy = [...original];
    secureShuffle(original);
    expect(original).toEqual(copy);
  });
});

describe('secureId', () => {
  it('generates a hex string of expected length and uniqueness', () => {
    const id1 = secureId();
    const id2 = secureId();

    expect(id1).toHaveLength(16);
    expect(id2).toHaveLength(16);
    expect(id1).not.toBe(id2);
  });
});
