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

function rpcBuilder(result: unknown) {
  const b: Record<string, unknown> = {};
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
    id: 'u1',
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

// Not Permanent (e.g. Elected): absent from get_employee_years_of_service.
const NOT_PERMANENT = {
  ...SAMPLE[0],
  id: 'u2',
  employee_id: 'E2',
  first_name: 'Maria',
  last_name: 'Santos',
  employment_status: 'Elected',
};

function mockUsers(result: unknown, yearsResult: unknown = { data: [] }) {
  const rpc = vi.fn(() =>
    rpcBuilder({ error: null, ...(yearsResult as object) }),
  );
  mockedCreateClient.mockResolvedValue({
    from: vi.fn(() => usersBuilder(result)),
    rpc,
  } as never);
  return { rpc };
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

  it('takes loyalty years of service from the Permanent-date RPC', async () => {
    // Original appointment 2016 but Permanent since 2015 → the RPC's 11 wins.
    const { rpc } = mockUsers(
      { data: SAMPLE, error: null },
      { data: [{ user_id: 'u1', years_of_service: 11 }] },
    );
    const res = await GET(searchReq('category=loyalty'));
    const json = await res!.json();
    expect(rpc).toHaveBeenCalledWith('get_employee_years_of_service');
    expect(json.data.header).toBe('Years of Service');
    expect(json.data.employees).toEqual([
      { employee_id: 'E1', name: 'Doe, Jane, M', value: '11' },
    ]);
  });

  it('excludes employees who are not Permanent from loyalty', async () => {
    mockUsers(
      { data: [SAMPLE[0], NOT_PERMANENT], error: null },
      { data: [{ user_id: 'u1', years_of_service: 10 }] },
    );
    const res = await GET(searchReq('category=loyalty'));
    const json = await res!.json();
    expect(
      json.data.employees.map((e: { employee_id: string }) => e.employee_id),
    ).toEqual(['E1']);
  });

  it('returns 400 when the years-of-service RPC fails', async () => {
    mockUsers(
      { data: SAMPLE, error: null },
      { data: null, error: { message: 'rpc failed' } },
    );
    const res = await GET(searchReq('category=loyalty'));
    expect(res?.status).toBe(400);
  });

  it('does not call the years-of-service RPC for other categories', async () => {
    const { rpc } = mockUsers({ data: SAMPLE, error: null });
    await GET(searchReq('category=gender'));
    expect(rpc).not.toHaveBeenCalled();
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
