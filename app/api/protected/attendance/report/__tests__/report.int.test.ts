import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NextRequest } from 'next/server';
import { GET } from '@/app/api/protected/attendance/report/route';
import { createClient } from '@/config';

vi.mock('@/config', () => ({ createClient: vi.fn() }));
const mockedCreateClient = vi.mocked(createClient);

function bioBuilder(result: unknown) {
  const b: Record<string, unknown> = {};
  for (const m of ['select', 'is', 'gte', 'lte', 'order']) {
    b[m] = vi.fn(() => b);
  }
  b.range = vi.fn().mockResolvedValue(result);
  return b;
}

function usersBuilder(result: unknown) {
  const b: Record<string, unknown> = {};
  b.select = vi.fn(() => b);
  b.is = vi.fn(() => b);
  b.range = vi.fn().mockResolvedValue(result);
  return b;
}

const searchReq = (qs: string): NextRequest =>
  ({
    nextUrl: { searchParams: new URLSearchParams(qs) },
  }) as unknown as NextRequest;

// Jan 15 2026: in 08:30 local (late), out 16:00 local (7.5h worked -> undertime).
const BIO = [
  { employee_id: 'E1', timestamp: '2026-01-15T16:30:00.000Z' },
  { employee_id: 'E1', timestamp: '2026-01-16T00:00:00.000Z' },
];
const USERS = [
  {
    employee_id: 'E1',
    first_name: 'Jane',
    middle_name: null,
    last_name: 'Doe',
  },
];

function mockDb(bio: unknown, users: unknown) {
  mockedCreateClient.mockResolvedValue({
    from: vi.fn((table: string) =>
      table === 'biometrics'
        ? bioBuilder({ data: bio, error: null })
        : usersBuilder({ data: users, error: null }),
    ),
  } as never);
}

beforeEach(() => vi.clearAllMocks());

describe('GET /api/protected/attendance/report', () => {
  it('computes late and undertime for a day in the period', async () => {
    mockDb(BIO, USERS);
    const res = await GET(searchReq('period=monthly&date=2026-01-15'));
    expect(res?.status).toBe(200);
    const json = await res!.json();
    expect(json.data).toMatchObject({
      period: 'monthly',
      start: '2026-01-01',
      end: '2026-01-31',
    });
    expect(json.data.rows).toHaveLength(1);
    expect(json.data.rows[0]).toMatchObject({
      employee_id: 'E1',
      name: 'Doe, Jane',
      date: '2026-01-15',
      time_in: '08:30 AM',
      time_out: '04:00 PM',
      worked_hours: '7.5',
      late: 'Yes',
      undertime: 'Yes',
    });
  });

  it('excludes punches outside the period', async () => {
    mockDb(BIO, USERS);
    const res = await GET(searchReq('period=monthly&date=2026-02-15'));
    const json = await res!.json();
    expect(json.data.rows).toHaveLength(0);
  });

  it('exports CSV with the attendance headers', async () => {
    mockDb(BIO, USERS);
    const res = await GET(
      searchReq('period=monthly&date=2026-01-15&format=csv'),
    );
    expect(res?.headers.get('Content-Type')).toContain('text/csv');
    const body = await res!.text();
    expect(body).toContain(
      'Employee ID,Name,Date,Time In,Time Out,Worked Hours,Late,Undertime',
    );
    expect(body).toContain(
      'E1,"Doe, Jane",2026-01-15,08:30 AM,04:00 PM,7.5,Yes,Yes',
    );
  });

  it('defaults to monthly for an unknown period', async () => {
    mockDb([], []);
    const res = await GET(searchReq('period=daily&date=2026-01-15'));
    const json = await res!.json();
    expect(json.data.period).toBe('monthly');
  });
});
