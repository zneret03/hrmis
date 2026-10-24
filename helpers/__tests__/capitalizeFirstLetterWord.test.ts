import { describe, it, expect } from 'vitest';
import { capitalizeFirstLetterWord } from '@/helpers/capitalizeFirstLetterWord';

describe('capitalizeFirstLetterWord', () => {
  it('capitalizes the first letter of a lowercase word', () => {
    expect(capitalizeFirstLetterWord('hello')).toBe('Hello');
  });

  it('leaves an already-capitalized word unchanged', () => {
    expect(capitalizeFirstLetterWord('World')).toBe('World');
  });

  it('only touches the first character, not the rest', () => {
    expect(capitalizeFirstLetterWord('hRMIS')).toBe('HRMIS');
  });

  it('returns an empty string for empty input', () => {
    expect(capitalizeFirstLetterWord('')).toBe('');
  });
});
