import { describe, it, expect } from 'vitest';
import { calculatePasswordStrength } from '../utils/passwordStrength';

describe('calculatePasswordStrength', () => {
  it('handles empty or blank passwords', () => {
    const analysis = calculatePasswordStrength('');
    expect(analysis.score).toBe(0);
    expect(analysis.label).toBe('Very Weak');
    expect(analysis.percentage).toBe(0);
  });

  it('rates very short passwords as Very Weak or Weak', () => {
    const short1 = calculatePasswordStrength('aB1!');
    expect(short1.score).toBeLessThanOrEqual(1);

    const short2 = calculatePasswordStrength('pass');
    expect(short2.score).toBe(0);
    expect(short2.label).toBe('Very Weak');
  });

  it('rates standard 16-character diverse passwords as Strong or Very Strong', () => {
    const strongPassword = 'K7@qP2!mX9#vR8$z';
    const analysis = calculatePasswordStrength(strongPassword);

    expect(analysis.score).toBeGreaterThanOrEqual(3);
    expect(['Strong', 'Very Strong']).toContain(analysis.label);
    expect(analysis.characterTypes).toBe(4);
    expect(analysis.hasUppercase).toBe(true);
    expect(analysis.hasLowercase).toBe(true);
    expect(analysis.hasNumbers).toBe(true);
    expect(analysis.hasSymbols).toBe(true);
  });

  it('rates long 32-character diverse passwords as Very Strong', () => {
    const maxPassword = 'm9#Wq7!xR2@vL8$zP4*bN1^cT6&yK5(j';
    const analysis = calculatePasswordStrength(maxPassword);

    expect(analysis.score).toBe(4);
    expect(analysis.label).toBe('Very Strong');
    expect(analysis.entropy).toBeGreaterThan(150);
  });

  it('detects repeating patterns and applies deductions', () => {
    const normal = calculatePasswordStrength('Kx9#Pq2!vR8$zL4*');
    const repeating = calculatePasswordStrength('KK9#Pqq!vv8$zz4*');

    expect(repeating.hasRepetition).toBe(true);
    expect(repeating.percentage).toBeLessThan(normal.percentage);
  });

  it('detects sequential patterns like "123" and "abc"', () => {
    const sequential = calculatePasswordStrength('abc123XYZ!@#');
    expect(sequential.hasSequential).toBe(true);
  });

  it('provides actionable security feedback', () => {
    const weak = calculatePasswordStrength('abc');
    expect(weak.feedback.length).toBeGreaterThan(0);
    expect(weak.feedback[0]).toContain('length');
  });
});
