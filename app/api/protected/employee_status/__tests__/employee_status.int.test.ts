import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/protected/employee_status/route';
import { PUT, DELETE } from '@/app/api/protected/employee_status/[id]/route';
import { createClient } from '@/config';

vi.mock('@/config', () => ({ createClient: vi.fn() }));
const mockedCreateClient = vi.mocked(createClient);

// `from('employee_status').select().is().order()` -> resolves to result.
function selectAllBuilder(result: unknown) {
  const b: Record<string, unknown> = {};
  b.select = vi.fn(() => b);
  b.is = vi.fn(() => b);
  b.order = vi.fn().mockResolvedValue(result);
  return b;
}

// `from('employee_status').update(data).eq('id', id)` -> resolves to result.
function updateBuilder(result: unknown) {
  const b: Record<string, unknown> = {};
  b.update = vi.fn(() => b);
  b.eq = vi.fn().mockResolvedValue(result);
  return b;
}

const jsonReq = (body: unknown): NextRequest =>
  ({ json: async () => body }) as unknown as NextRequest;

const searchReq = (qs: string): NextRequest =>
  ({
    nextUrl: { searchParams: new URLSearchParams(qs) },
  }) as unknown as NextRequest;

beforeEach(() => vi.clearAllMocks());

describe('employee_status API', () => {
  it('GET ?all=true returns active statuses', async () => {
    const rows = [
      { id: '1', name: 'Casual' },
      { id: '2', name: 'Permanent' },
    ];
    mockedCreateClient.mockResolvedValue({
      from: vi.fn(() => selectAllBuilder({ data: rows, error: null })),
    } as never);

    const res = await GET(searchReq('all=true'));
    expect(res?.status).toBe(200);
    const json = await res!.json();
    expect(json.data.employee_status).toEqual(rows);
  });

  it('POST add-employee-status inserts and returns 200', async () => {
    const insert = vi.fn().mockResolvedValue({ error: null });
    mockedCreateClient.mockResolvedValue({
      from: vi.fn(() => ({ insert })),
    } as never);

    const res = await POST(
      jsonReq({ type: 'add-employee-status', name: 'Contractual' }),
    );
    expect(res?.status).toBe(200);
    expect(insert).toHaveBeenCalledWith({ name: 'Contractual' });
  });

  it('POST returns 400 for an empty body', async () => {
    const res = await POST(jsonReq({}));
    expect(res?.status).toBe(400);
  });

  it('POST surfaces a DB error as 500', async () => {
    mockedCreateClient.mockResolvedValue({
      from: vi.fn(() => ({
        insert: vi.fn().mockResolvedValue({
          error: { message: 'duplicate key value' },
        }),
      })),
    } as never);

    const res = await POST(
      jsonReq({ type: 'add-employee-status', name: 'Permanent' }),
    );
    expect(res?.status).toBe(500);
  });

  it('PUT edit-employee-status updates the name', async () => {
    const builder = updateBuilder({ error: null });
    mockedCreateClient.mockResolvedValue({
      from: vi.fn(() => builder),
    } as never);

    const res = await PUT(
      jsonReq({ type: 'edit-employee-status', name: 'Elected' }),
      {
        params: Promise.resolve({ id: 'abc' }),
      },
    );
    expect(res?.status).toBe(200);
    expect(builder.update).toHaveBeenCalledWith({ name: 'Elected' });
    expect(builder.eq).toHaveBeenCalledWith('id', 'abc');
  });

  it('DELETE soft-deletes by setting archived_at', async () => {
    const builder = updateBuilder({ error: null });
    mockedCreateClient.mockResolvedValue({
      from: vi.fn(() => builder),
    } as never);

    const res = await DELETE({} as never, {
      params: Promise.resolve({ id: 'abc' }),
    });
    expect(res?.status).toBe(200);
    expect(builder.update).toHaveBeenCalledOnce();
    const payload = (builder.update as ReturnType<typeof vi.fn>).mock
      .calls[0][0];
    expect(payload).toHaveProperty('archived_at');
  });
});
