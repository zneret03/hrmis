import { subHours, differenceInMinutes } from 'date-fns';

// Attendance policy (per the Reporting spec):
// - Late: first time-in after 08:00 (local).
// - Undertime: fewer than 8 worked hours in a day.
// Biometric timestamps are normalised to the local wall-clock the same way the
// DTR view does (subtract 8 hours). Wall-clock fields are then read in UTC so the
// result is deterministic regardless of the server's timezone.
export const STANDARD_START_HOUR = 8; // 08:00
export const STANDARD_WORK_HOURS = 8;

export type AttendancePeriod = 'weekly' | 'monthly' | 'yearly';

export function toLocal(timestamp: string): Date {
  return subHours(new Date(timestamp), 8);
}

function ymd(year: number, month0: number, day: number): string {
  return `${year}-${String(month0 + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/** The local (normalised) calendar day of a biometric punch, as YYYY-MM-DD. */
export function localDayKey(timestamp: string): string {
  const d = toLocal(timestamp);
  return ymd(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

/**
 * Inclusive YYYY-MM-DD bounds for a reporting period around an anchor date.
 * Weekly is Monday–Sunday. Computed in UTC so it is timezone-independent.
 */
export function getPeriodRange(
  period: AttendancePeriod,
  anchor: Date,
): { start: string; end: string } {
  const y = anchor.getUTCFullYear();
  const m = anchor.getUTCMonth();
  const d = anchor.getUTCDate();

  if (period === 'yearly') {
    return { start: ymd(y, 0, 1), end: ymd(y, 11, 31) };
  }

  if (period === 'monthly') {
    const lastDay = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
    return { start: ymd(y, m, 1), end: ymd(y, m, lastDay) };
  }

  // weekly: Monday..Sunday containing the anchor
  const dow = new Date(Date.UTC(y, m, d)).getUTCDay(); // 0=Sun..6=Sat
  const toMonday = (dow + 6) % 7;
  const monday = new Date(Date.UTC(y, m, d - toMonday));
  const sunday = new Date(Date.UTC(y, m, d - toMonday + 6));
  return {
    start: ymd(
      monday.getUTCFullYear(),
      monday.getUTCMonth(),
      monday.getUTCDate(),
    ),
    end: ymd(
      sunday.getUTCFullYear(),
      sunday.getUTCMonth(),
      sunday.getUTCDate(),
    ),
  };
}

function formatWallClock(date: Date): string {
  let hour = date.getUTCHours();
  const minute = date.getUTCMinutes();
  const meridiem = hour >= 12 ? 'PM' : 'AM';
  hour %= 12;
  if (hour === 0) hour = 12;
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${meridiem}`;
}

export interface DayAttendance {
  timeIn: string | null; // formatted hh:mm a
  timeOut: string | null;
  workedHours: number;
  isLate: boolean;
  isUndertime: boolean;
  incomplete: boolean; // fewer than 2 punches -> cannot derive a full day
}

/**
 * Derives a day's attendance from that day's biometric punches. Punches are
 * paired in order (in/out, in/out) to total worked hours. "Late" is based on the
 * first punch; "undertime" on worked hours (only when the day has an out punch).
 */
export function computeDayAttendance(timestamps: string[]): DayAttendance {
  if (timestamps.length === 0) {
    return {
      timeIn: null,
      timeOut: null,
      workedHours: 0,
      isLate: false,
      isUndertime: false,
      incomplete: true,
    };
  }

  const locals = timestamps
    .map(toLocal)
    .sort((a, b) => a.getTime() - b.getTime());

  const first = locals[0];
  const last = locals[locals.length - 1];
  const incomplete = locals.length < 2;

  const firstMinutes = first.getUTCHours() * 60 + first.getUTCMinutes();
  const isLate = firstMinutes > STANDARD_START_HOUR * 60;

  let minutes = 0;
  for (let i = 0; i + 1 < locals.length; i += 2) {
    minutes += differenceInMinutes(locals[i + 1], locals[i]);
  }
  const workedHours = Math.round((minutes / 60) * 100) / 100;

  return {
    timeIn: formatWallClock(first),
    timeOut: incomplete ? null : formatWallClock(last),
    workedHours,
    isLate,
    isUndertime: !incomplete && workedHours < STANDARD_WORK_HOURS,
    incomplete,
  };
}
