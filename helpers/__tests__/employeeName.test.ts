import { describe, it, expect } from 'vitest';
import { employeeName } from '@/helpers/employeeName';

describe('employeeName', () => {
  it('formats as "Last, First"', () => {
    expect(
      employeeName({ first_name: 'Jan', last_name: 'Rosum', username: 'jr' }),
    ).toBe('Rosum, Jan');
  });

  it('uses whichever name part exists', () => {
    expect(employeeName({ last_name: 'Rosum' })).toBe('Rosum');
  });

  it('falls back to the username', () => {
    expect(
      employeeName({ first_name: null, last_name: '', username: 'jan.rosum' }),
    ).toBe('jan.rosum');
  });

  it('returns null when there is nothing to show', () => {
    expect(employeeName(null)).toBeNull();
    expect(employeeName({})).toBeNull();
  });
});
