import { describe, it, expect } from 'vitest';
import { escapeCSVField, toCSV } from '@/app/api/helpers/csvHelpers';

describe('escapeCSVField', () => {
  it('returns plain values unquoted', () => {
    expect(escapeCSVField('Permanent')).toBe('Permanent');
    expect(escapeCSVField(42)).toBe('42');
  });

  it('empties null and undefined', () => {
    expect(escapeCSVField(null)).toBe('');
    expect(escapeCSVField(undefined)).toBe('');
  });

  it('quotes values containing commas, quotes, or newlines', () => {
    expect(escapeCSVField('Doe, Jane')).toBe('"Doe, Jane"');
    expect(escapeCSVField('a\nb')).toBe('"a\nb"');
  });

  it('doubles embedded quotes', () => {
    expect(escapeCSVField('say "hi"')).toBe('"say ""hi"""');
  });
});

describe('toCSV', () => {
  it('serializes rows with explicit columns in order', () => {
    const rows = [
      { employee_id: '10-023', name: 'Jan Rosum', gender: 'Male' },
      { employee_id: '102-3', name: 'Janny Golsing', gender: 'Female' },
    ];
    const csv = toCSV(rows, [
      { key: 'employee_id', header: 'Employee ID' },
      { key: 'name', header: 'Name' },
      { key: 'gender', header: 'Gender' },
    ]);
    expect(csv).toBe(
      'Employee ID,Name,Gender\r\n' +
        '10-023,Jan Rosum,Male\r\n' +
        '102-3,Janny Golsing,Female',
    );
  });

  it('infers columns from the first row when none are given', () => {
    expect(toCSV([{ a: 1, b: 2 }])).toBe('a,b\r\n1,2');
  });

  it('escapes fields that need quoting', () => {
    const csv = toCSV(
      [{ name: 'Doe, Jane' }],
      [{ key: 'name', header: 'Name' }],
    );
    expect(csv).toBe('Name\r\n"Doe, Jane"');
  });

  it('returns an empty string for an empty array without columns', () => {
    expect(toCSV([])).toBe('');
  });

  it('emits only the header row for an empty array with columns', () => {
    expect(toCSV<{ name: string }>([], [{ key: 'name', header: 'Name' }])).toBe(
      'Name',
    );
  });
});
