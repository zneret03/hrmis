import { describe, it, expect } from 'vitest';
import { isValidLeaveCardYear, leaveCardYearError } from '@/helpers/leaveCard';

describe('isValidLeaveCardYear', () => {
  it('accepts whole years from 1900 to the current year', () => {
    expect(isValidLeaveCardYear('1900', 2026)).toBe(true);
    expect(isValidLeaveCardYear('2026', 2026)).toBe(true);
  });

  it('rejects future, too-old, fractional, and empty years', () => {
    expect(isValidLeaveCardYear('2027', 2026)).toBe(false);
    expect(isValidLeaveCardYear('1899', 2026)).toBe(false);
    expect(isValidLeaveCardYear('2020.5', 2026)).toBe(false);
    expect(isValidLeaveCardYear('', 2026)).toBe(false);
    expect(isValidLeaveCardYear('  ', 2026)).toBe(false);
  });
});

describe('leaveCardYearError', () => {
  it('names the allowed range', () => {
    expect(leaveCardYearError(2026)).toBe(
      'Year must be between 1900 and 2026.',
    );
  });
});
