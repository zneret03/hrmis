import { describe, it, expect } from 'vitest';
import {
  isLoyaltyAwardYear,
  loyaltyBracket,
  NOT_ELIGIBLE_LABEL,
} from '@/helpers/loyalty';

describe('isLoyaltyAwardYear', () => {
  it('is true only on exact milestone years', () => {
    for (const y of [5, 10, 15, 20, 25, 30, 35, 40]) {
      expect(isLoyaltyAwardYear(y)).toBe(true);
    }
  });

  it('is false for in-between years (per spec: 11, 14 -> none)', () => {
    for (const y of [0, 1, 9, 11, 14, 16, 24, 41, 45, 50]) {
      expect(isLoyaltyAwardYear(y)).toBe(false);
    }
  });

  it('respects a custom threshold list', () => {
    expect(isLoyaltyAwardYear(5, [10, 20])).toBe(false);
    expect(isLoyaltyAwardYear(20, [10, 20])).toBe(true);
  });
});

describe('loyaltyBracket', () => {
  it('labels exact milestone years', () => {
    expect(loyaltyBracket(10)).toBe('10 years loyalty award');
    expect(loyaltyBracket(40)).toBe('40 years loyalty award');
    expect(loyaltyBracket(5)).toBe('5 years loyalty award');
  });

  it('labels everything else as not eligible', () => {
    expect(loyaltyBracket(11)).toBe(NOT_ELIGIBLE_LABEL);
    expect(loyaltyBracket(14)).toBe(NOT_ELIGIBLE_LABEL);
    expect(loyaltyBracket(16)).toBe(NOT_ELIGIBLE_LABEL);
    expect(loyaltyBracket(41)).toBe(NOT_ELIGIBLE_LABEL);
  });
});
