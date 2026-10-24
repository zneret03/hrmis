import { describe, it, expect } from 'vitest';
import { avatarName } from '@/helpers/avatarName';

describe('avatarName', () => {
  it('returns the first two characters uppercased', () => {
    expect(avatarName('admin2@example.com')).toBe('AD');
  });

  it('uppercases lowercase initials', () => {
    expect(avatarName('john.doe@example.com')).toBe('JO');
  });

  it('is already-uppercase safe', () => {
    expect(avatarName('ZZ-top@example.com')).toBe('ZZ');
  });
});
