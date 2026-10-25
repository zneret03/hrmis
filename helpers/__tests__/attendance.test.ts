import { describe, it, expect } from 'vitest';
import {
  computeDayAttendance,
  getPeriodRange,
  localDayKey,
} from '@/helpers/attendance';

// Build a timestamp whose local wall-clock (after the -8h normalisation) is
// exactly localH:localM on 2026-01-15.
const at = (localH: number, localM = 0): string =>
  new Date(Date.UTC(2026, 0, 15, localH + 8, localM)).toISOString();

describe('computeDayAttendance', () => {
  it('flags an empty day as incomplete', () => {
    const d = computeDayAttendance([]);
    expect(d.incomplete).toBe(true);
    expect(d.isLate).toBe(false);
    expect(d.isUndertime).toBe(false);
  });

  it('is not late when the first punch is at or before 08:00', () => {
    expect(computeDayAttendance([at(8, 0), at(17, 0)]).isLate).toBe(false);
    expect(computeDayAttendance([at(7, 45), at(17, 0)]).isLate).toBe(false);
  });

  it('is late when the first punch is after 08:00', () => {
    expect(computeDayAttendance([at(8, 1), at(17, 0)]).isLate).toBe(true);
    expect(computeDayAttendance([at(9, 30), at(17, 0)]).isLate).toBe(true);
  });

  it('sums paired punches into worked hours (with a lunch break)', () => {
    // 08:00-12:00 + 13:00-17:00 = 8h
    const d = computeDayAttendance([at(8), at(12), at(13), at(17)]);
    expect(d.workedHours).toBe(8);
    expect(d.isUndertime).toBe(false);
  });

  it('flags undertime when worked hours < 8 (out early at 4pm)', () => {
    // 08:00 -> 16:00 single pair = 8h exactly (not undertime)
    expect(computeDayAttendance([at(8), at(16)]).isUndertime).toBe(false);
    // 08:00 -> 15:00 = 7h -> undertime
    const d = computeDayAttendance([at(8), at(15)]);
    expect(d.workedHours).toBe(7);
    expect(d.isUndertime).toBe(true);
  });

  it('treats a single punch as incomplete, not undertime', () => {
    const d = computeDayAttendance([at(8)]);
    expect(d.incomplete).toBe(true);
    expect(d.isUndertime).toBe(false);
    expect(d.timeOut).toBeNull();
  });

  it('formats time-in/out as hh:mm a', () => {
    const d = computeDayAttendance([at(8, 5), at(17, 30)]);
    expect(d.timeIn).toBe('08:05 AM');
    expect(d.timeOut).toBe('05:30 PM');
  });
});

describe('getPeriodRange', () => {
  const anchor = new Date(Date.UTC(2026, 0, 15)); // Thu 2026-01-15

  it('monthly spans the whole month', () => {
    expect(getPeriodRange('monthly', anchor)).toEqual({
      start: '2026-01-01',
      end: '2026-01-31',
    });
  });

  it('yearly spans the whole year', () => {
    expect(getPeriodRange('yearly', anchor)).toEqual({
      start: '2026-01-01',
      end: '2026-12-31',
    });
  });

  it('weekly is the Monday-Sunday around the anchor', () => {
    // 2026-01-15 is a Thursday -> week is Mon 12th .. Sun 18th
    expect(getPeriodRange('weekly', anchor)).toEqual({
      start: '2026-01-12',
      end: '2026-01-18',
    });
  });
});

describe('localDayKey', () => {
  it('normalises a punch to its local calendar day', () => {
    // 2026-01-15 16:00Z -> local 08:00 on 2026-01-15
    expect(localDayKey('2026-01-15T16:00:00.000Z')).toBe('2026-01-15');
  });
});
