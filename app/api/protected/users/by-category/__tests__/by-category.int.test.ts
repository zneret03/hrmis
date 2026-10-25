import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NextRequest } from 'next/server';
import { differenceInYears } from 'date-fns';
import { GET } from '@/app/api/protected/users/by-category/route';
import { createClient } from '@/config';

vi.mock('@/config', () => ({ createClient: vi.fn() }));
const mockedCreateClient = vi.mocked(createClient);

function usersBuilder(result: unknown) {
  const b: Record<string, unknown> = {};
  b.select = vi.fn(() => b);
  b.is = vi.fn(() => b);
  b.order = vi.fn(() => b);
  b.range = vi.fn().mockResolvedValue(result);
  return b;
}

const searchReq = (qs: string): NextRequest =>
  ({
    nextUrl: { searchParams: new URLSearchParams(qs) },
  }) as unknown as NextRequest;

const SAMPLE = [
  {
    employee_id: 'E1',
    first_name: 'Jane',
    middle_name: 'M',
    last_name: 'Doe',
    gender: 'Female',
    employment_status: 'Permanent',
    birthdate: '1990-06-15',
    date_of_original_appointment: '2016-01-01',
  },
];

function mockUsers(result: unknown) {
  mockedCreateClient.mockResolvedValue({
    from: vi.fn(() => usersBuilder(result)),
  } as never);
}

beforeEach(() => vi.clearAllMocks());

describe('GET /api/protected/users/by-category', () => {
  it('rejects an unknown category with 400', async () => {
    const res = await GET(searchReq('category=salary'));
    expect(res?.status).toBe(400);
  });

  it('returns gender values with the Gender header', async () => {
    mockUsers({ data: SAMPLE, error: null });
    const res = await GET(searchReq('category=gender'));
    const json = await res!.json();
    expect(json.data.header).toBe('Gender');
    expect(json.data.employees[0]).toMatchObject({
      employee_id: 'E1',
      name: 'Doe, Jane, M',
      value: 'Female',
    });
  });

  it('computes age from birthdate', async () => {
    mockUsers({ data: SAMPLE, error: null });
    const res = await GET(searchReq('category=age'));
    const json = await res!.json();
    const expected = String(
      differenceInYears(new Date(), new Date('1990-06-15')),
    );
    expect(json.data.header).toBe('Age');
    expect(json.data.employees[0].value).toBe(expected);
  });

  it('computes years of service for loyalty', async () => {
    mockUsers({ data: SAMPLE, error: null });
    const res = await GET(searchReq('category=loyalty'));
    const json = await res!.json();
    const expected = String(
      differenceInYears(new Date(), new Date('2016-01-01')),
    );
    expect(json.data.employees[0].value).toBe(expected);
  });

  it('exports CSV with the category header', async () => {
    mockUsers({ data: SAMPLE, error: null });
    const res = await GET(searchReq('category=employment&format=csv'));
    expect(res?.headers.get('Content-Type')).toContain('text/csv');
    expect(res?.headers.get('Content-Disposition')).toContain(
      'employees-by-employment.csv',
    );
    const body = await res!.text();
    expect(body).toContain('Employee ID,Name,Employment Status');
    expect(body).toContain('E1,"Doe, Jane, M",Permanent');
  });
});
