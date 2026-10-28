import { describe, it, expect } from 'vitest';
import { withCurrentOption } from '@/helpers/withCurrentOption';

describe('withCurrentOption', () => {
  const managed = ['Permanent', 'Casual'];

  it('returns the options as-is when the current value is one of them', () => {
    expect(withCurrentOption(managed)).toEqual(managed);
    expect(withCurrentOption(managed, 'Casual')).toEqual(managed);
    expect(withCurrentOption(managed, '')).toEqual(managed);
  });

  it('appends a current value that is not in the options', () => {
    expect(withCurrentOption(managed, 'Temporary')).toEqual([
      'Permanent',
      'Casual',
      'Temporary',
    ]);
  });

  it('does not mutate the given options', () => {
    withCurrentOption(managed, 'Temporary');
    expect(managed).toEqual(['Permanent', 'Casual']);
  });
});
