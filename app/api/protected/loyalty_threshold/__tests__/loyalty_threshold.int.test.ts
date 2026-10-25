import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NextRequest } from 'next/server';
import { POST } from '@/app/api/protected/loyalty_threshold/route';
import { PUT, DELETE } from '@/app/api/protected/loyalty_threshold/[id]/route';
import { createClient } from '@/config';

vi.mock('@/config', () => ({ createClient: vi.fn() }));
const mockedCreateClient = vi.mocked(createClient);

// `select('id').eq().is().limit()` duplicate-check chain -> resolves to result.
function selectCheckBuilder(result: unknown) {
  const b: Record<string, unknown> = {};
  b.select = vi.fn(() => b);
  b.eq = vi.fn(() => b);
  b.is = vi.fn(() => b);
  b.limit = vi.fn().mockResolvedValue(result);
  return b;
}

// `update(data).eq('id', id)` -> resolves to result.
function updateBuilder(result: unknown) {
  const b: Record<string, unknown> = {};
  b.update = vi.fn(() => b);
  b.eq = vi.fn().mockResolvedValue(result);
  return b;
}

const jsonReq = (body: unknown): NextRequest =>
  ({ json: async () => body }) as unknown as NextRequest;

beforeEach(() => vi.clearAllMocks());

describe('loyalty_threshold API', () => {
  it('POST add-loyalty-threshold inserts when the value is new', async () => {
    const insert = vi.fn().mockResolvedValue({ error: null });
    mockedCreateClient.mockResolvedValue({
      from: vi
        .fn()
        .mockReturnValueOnce(selectCheckBuilder({ data: [], error: null }))
        .mockReturnValueOnce({ insert }),
    } as never);

    const res = await POST(
      jsonReq({ type: 'add-loyalty-threshold', year_threshold: '10' }),
    );
    expect(res?.status).toBe(200);
    expect(insert).toHaveBeenCalledWith({ year_threshold: 10 });
  });

  it('POST rejects a duplicate active threshold with 409', async () => {
    mockedCreateClient.mockResolvedValue({
      from: vi.fn(() =>
        selectCheckBuilder({ data: [{ id: 'x' }], error: null }),
      ),
    } as never);

    const res = await POST(
      jsonReq({ type: 'add-loyalty-threshold', year_threshold: 10 }),
    );
    expect(res?.status).toBe(409);
  });

  it('POST returns 400 for an empty body', async () => {
    const res = await POST(jsonReq({}));
    expect(res?.status).toBe(400);
  });

  it('PUT edit-loyalty-threshold updates the value (coerced to number)', async () => {
    const builder = updateBuilder({ error: null });
    mockedCreateClient.mockResolvedValue({
      from: vi.fn(() => builder),
    } as never);

    const res = await PUT(
      jsonReq({ type: 'edit-loyalty-threshold', year_threshold: '20' }),
      { params: Promise.resolve({ id: 'abc' }) },
    );
    expect(res?.status).toBe(200);
    expect(builder.update).toHaveBeenCalledWith({ year_threshold: 20 });
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
    const payload = (builder.update as ReturnType<typeof vi.fn>).mock
      .calls[0][0];
    expect(payload).toHaveProperty('archived_at');
  });
});
