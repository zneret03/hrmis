import { describe, it, expect } from 'vitest';
import { isValidDateRange } from '@/helpers/serviceRecord';

describe('isValidDateRange', () => {
  it('accepts From before or on To', () => {
    expect(isValidDateRange('2016-05-01', '2020-12-31')).toBe(true);
    expect(isValidDateRange('2020-12-31', '2020-12-31')).toBe(true);
  });

  it('rejects From after To', () => {
    expect(isValidDateRange('2021-01-01', '2020-12-31')).toBe(false);
  });

  it('accepts open-ended periods', () => {
    expect(isValidDateRange('2021-01-01', null)).toBe(true);
    expect(isValidDateRange('2021-01-01', '')).toBe(true);
    expect(isValidDateRange(undefined, '2020-12-31')).toBe(true);
  });
});
