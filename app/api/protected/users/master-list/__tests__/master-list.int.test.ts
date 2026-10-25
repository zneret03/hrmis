import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NextRequest } from 'next/server';
import { GET } from '@/app/api/protected/users/master-list/route';
import { createClient } from '@/config';

vi.mock('@/config', () => ({ createClient: vi.fn() }));
const mockedCreateClient = vi.mocked(createClient);

// Chainable + thenable users query builder: select/is/order/eq return `b`, and
// `await b` resolves to `result`.
function usersBuilder(result: unknown) {
  const b: Record<string, unknown> = {};
  b.select = vi.fn(() => b);
  b.is = vi.fn(() => b);
  b.order = vi.fn(() => b);
  b.eq = vi.fn(() => b);
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
    position: 'Clerk',
    email: 'jane@example.com',
  },
];

beforeEach(() => vi.clearAllMocks());

describe('GET /api/protected/users/master-list', () => {
  it('returns all active employees with a composed name', async () => {
    const builder = usersBuilder({ data: SAMPLE, error: null });
    mockedCreateClient.mockResolvedValue({
      from: vi.fn(() => builder),
    } as never);

    const res = await GET(searchReq(''));
    expect(res?.status).toBe(200);
    const json = await res!.json();
    expect(json.data.employees[0]).toMatchObject({
      employee_id: 'E1',
      name: 'Doe, Jane, M',
      employment_status: 'Permanent',
    });
    // No status filter -> eq not applied.
    expect(builder.eq).not.toHaveBeenCalled();
  });

  it('filters by employment status', async () => {
    const builder = usersBuilder({ data: SAMPLE, error: null });
    mockedCreateClient.mockResolvedValue({
      from: vi.fn(() => builder),
    } as never);

    await GET(searchReq('status=Permanent'));
    expect(builder.eq).toHaveBeenCalledWith('employment_status', 'Permanent');
  });

  it('exports CSV with headers and attachment disposition', async () => {
    const builder = usersBuilder({ data: SAMPLE, error: null });
    mockedCreateClient.mockResolvedValue({
      from: vi.fn(() => builder),
    } as never);

    const res = await GET(searchReq('status=all&format=csv'));
    expect(res?.headers.get('Content-Type')).toContain('text/csv');
    expect(res?.headers.get('Content-Disposition')).toContain(
      'employees-all.csv',
    );
    const body = await res!.text();
    expect(body).toContain('Employee ID,Name,Gender,Employment Status');
    expect(body).toContain('E1,"Doe, Jane, M",Female,Permanent');
  });

  it('returns 400 on a DB error', async () => {
    const builder = usersBuilder({ data: null, error: { message: 'boom' } });
    mockedCreateClient.mockResolvedValue({
      from: vi.fn(() => builder),
    } as never);

    const res = await GET(searchReq(''));
    expect(res?.status).toBe(400);
  });
});
