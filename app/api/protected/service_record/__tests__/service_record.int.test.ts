import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/protected/service_record/route';
import { createClient } from '@/config';

vi.mock('@/config', () => ({ createClient: vi.fn() }));
const mockedCreateClient = vi.mocked(createClient);

function usersRoleBuilder(role: string, id: string) {
  const b: Record<string, unknown> = {};
  b.select = vi.fn(() => b);
  b.eq = vi.fn(() => b);
  b.single = vi.fn().mockResolvedValue({ data: { role, id }, error: null });
  return b;
}

function srSelectBuilder(rows: unknown[]) {
  const b: Record<string, unknown> = {};
  b.select = vi.fn(() => b);
  b.is = vi.fn(() => b);
  b.order = vi.fn(() => b);
  b.eq = vi.fn(() => b);
  b.range = vi
    .fn()
    .mockResolvedValue({ data: rows, error: null, count: rows.length });
  return b;
}

const srInsertBuilder = () => ({
  insert: vi.fn().mockResolvedValue({ error: null }),
});

function setup(role: string, userId: string, sr: unknown) {
  const users = usersRoleBuilder(role, userId);
  mockedCreateClient.mockResolvedValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: userId } } }),
    },
    from: vi.fn((table: string) => (table === 'users' ? users : sr)),
  } as never);
  return { users, sr };
}

const jsonReq = (body: unknown): NextRequest =>
  ({ json: async () => body }) as unknown as NextRequest;

const searchReq = (qs: string): NextRequest =>
  ({
    nextUrl: { searchParams: new URLSearchParams(qs) },
  }) as unknown as NextRequest;

beforeEach(() => vi.clearAllMocks());

describe('service_record API', () => {
  it('POST is forbidden for non-admins', async () => {
    setup('employee', 'emp-1', srInsertBuilder());
    const res = await POST(
      jsonReq({ type: 'add-service-record', user_id: 'x', position: 'Clerk' }),
    );
    expect(res?.status).toBe(403);
  });

  it('POST add inserts for an admin', async () => {
    const sr = srInsertBuilder();
    setup('admin', 'admin-1', sr);
    const res = await POST(
      jsonReq({
        type: 'add-service-record',
        user_id: 'emp-1',
        position: 'Clerk',
        from_date: '',
      }),
    );
    expect(res?.status).toBe(200);
    // Empty date coerced to null.
    expect(sr.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'emp-1',
        position: 'Clerk',
        from_date: null,
      }),
    );
  });

  it('GET returns all records for an admin (no user filter)', async () => {
    const sr = srSelectBuilder([{ id: 'r1' }, { id: 'r2' }]);
    setup('admin', 'admin-1', sr);
    const res = await GET(searchReq(''));
    expect(res?.status).toBe(200);
    const json = await res!.json();
    expect(json.data.service_record).toHaveLength(2);
    expect(sr.eq).not.toHaveBeenCalled();
  });

  it('GET scopes an employee to their own records, ignoring ?userId', async () => {
    const sr = srSelectBuilder([]);
    setup('employee', 'emp-1', sr);
    await GET(searchReq('userId=someone-else'));
    expect(sr.eq).toHaveBeenCalledWith('user_id', 'emp-1');
  });
});
