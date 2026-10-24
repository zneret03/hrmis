import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NextRequest } from 'next/server';
import { POST } from '@/app/api/auth/route';
import { createClient } from '@/config';

// The route delegates to the Supabase server client; we mock it so the test
// exercises the full route -> model -> response pipeline without a live DB.
vi.mock('@/config', () => ({ createClient: vi.fn() }));

const mockedCreateClient = vi.mocked(createClient);

// Minimal chainable PostgREST query builder whose terminal `.single()`
// resolves to the supplied result.
function builder(result: unknown) {
  const b: Record<string, unknown> = {};
  for (const method of ['select', 'is', 'or', 'eq', 'limit']) {
    b[method] = vi.fn(() => b);
  }
  b.single = vi.fn().mockResolvedValue(result);
  return b;
}

function makeRequest(body: unknown): NextRequest {
  return { json: async () => body } as unknown as NextRequest;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('POST /api/auth', () => {
  it('returns 400 for an empty body', async () => {
    const res = await POST(makeRequest({}));
    expect(res?.status).toBe(400);
  });

  it('signs in a valid user by username and returns their profile', async () => {
    const supabase = {
      from: vi
        .fn()
        .mockReturnValueOnce(
          builder({ data: { email: 'admin2@example.com' }, error: null }),
        )
        .mockReturnValueOnce(
          builder({
            data: {
              role: 'admin',
              email: 'admin2@example.com',
              employee_id: null,
            },
            error: null,
          }),
        ),
      auth: {
        signInWithPassword: vi.fn().mockResolvedValue({
          data: { session: { access_token: 'token' }, user: { id: 'uid-1' } },
          error: null,
        }),
      },
    };
    mockedCreateClient.mockResolvedValue(supabase as never);

    const res = await POST(
      makeRequest({
        type: 'sign-in',
        username: 'hrmis_admin',
        password: 'Password123!',
      }),
    );

    expect(res?.status).toBe(200);
    const json = await res!.json();
    expect(json.data).toMatchObject({ role: 'admin', id: 'uid-1' });
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'admin2@example.com',
      password: 'Password123!',
    });
  });

  it('returns 401 when the username is not found', async () => {
    const supabase = {
      from: vi
        .fn()
        .mockReturnValueOnce(
          builder({ data: null, error: { code: 'PGRST116' } }),
        ),
      auth: { signInWithPassword: vi.fn() },
    };
    mockedCreateClient.mockResolvedValue(supabase as never);

    const res = await POST(
      makeRequest({ type: 'sign-in', username: 'ghost', password: 'nope' }),
    );

    expect(res?.status).toBe(401);
    expect(supabase.auth.signInWithPassword).not.toHaveBeenCalled();
  });

  it('returns 401 when the password is wrong', async () => {
    const supabase = {
      from: vi
        .fn()
        .mockReturnValueOnce(
          builder({ data: { email: 'admin2@example.com' }, error: null }),
        ),
      auth: {
        signInWithPassword: vi.fn().mockResolvedValue({
          data: { session: null },
          error: { message: 'Invalid login credentials' },
        }),
      },
    };
    mockedCreateClient.mockResolvedValue(supabase as never);

    const res = await POST(
      makeRequest({
        type: 'sign-in',
        username: 'hrmis_admin',
        password: 'wrong',
      }),
    );

    expect(res?.status).toBe(401);
  });

  it('signs out successfully', async () => {
    const supabase = {
      auth: { signOut: vi.fn().mockResolvedValue({ error: null }) },
    };
    mockedCreateClient.mockResolvedValue(supabase as never);

    const res = await POST(makeRequest({ type: 'sign-out' }));

    expect(res?.status).toBe(200);
    expect(supabase.auth.signOut).toHaveBeenCalled();
  });
});
