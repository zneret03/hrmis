import { describe, it, expect } from 'vitest';
import { convertKeysToSnakeCase } from '@/helpers/camelToSnakeCase';

describe('convertKeysToSnakeCase', () => {
  it('converts top-level camelCase keys to snake_case', () => {
    expect(
      convertKeysToSnakeCase({ firstName: 'Jane', lastName: 'Doe' }),
    ).toEqual({ first_name: 'Jane', last_name: 'Doe' });
  });

  it('maps each element of an array of objects', () => {
    expect(
      convertKeysToSnakeCase([{ employeeId: 1 }, { employeeId: 2 }]),
    ).toEqual([{ employee_id: 1 }, { employee_id: 2 }]);
  });

  it('returns primitives untouched', () => {
    expect(convertKeysToSnakeCase('leaveCredits')).toBe('leaveCredits');
    expect(convertKeysToSnakeCase(42)).toBe(42);
  });
});
