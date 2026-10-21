import { describe, it, expect } from 'vitest';
import { formatRupees, formatCompactRupees, parseRupees } from '../src/lib/currency';

describe('formatRupees', () => {
  it('formats standard Indian Rupee amounts with lakhs separator grouping', () => {
    expect(formatRupees(100000)).toBe('₹1,00,000');
    expect(formatRupees(2500000)).toBe('₹25,00,000');
    expect(formatRupees(10000000)).toBe('₹1,00,00,000');
    expect(formatRupees(450)).toBe('₹450');
  });

  it('handles zero, null, and undefined values cleanly', () => {
    expect(formatRupees(0)).toBe('₹0');
    expect(formatRupees(null)).toBe('₹0');
    expect(formatRupees(undefined)).toBe('₹0');
    expect(formatRupees(NaN)).toBe('₹0');
  });

  it('formats negative amounts with clear minus sign', () => {
    expect(formatRupees(-15000)).toBe('-₹15,000');
    expect(formatRupees(-100000)).toBe('-₹1,00,000');
  });
});

describe('formatCompactRupees', () => {
  it('formats lakhs and crores in readable shorthand', () => {
    expect(formatCompactRupees(150000)).toBe('₹1.50 Lakh');
    expect(formatCompactRupees(25000000)).toBe('₹2.50 Cr');
    expect(formatCompactRupees(5000)).toBe('₹5.0k');
    expect(formatCompactRupees(0)).toBe('₹0');
  });
});

describe('parseRupees', () => {
  it('extracts numeric values from formatted rupee strings', () => {
    expect(parseRupees('₹1,50,000')).toBe(150000);
    expect(parseRupees('  ₹ 45,000.50 ')).toBe(45000.5);
    expect(parseRupees('')).toBe(0);
  });
});
