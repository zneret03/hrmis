import { describe, it, expect } from 'vitest';
import type { PostgrestError } from '@supabase/supabase-js';
import { fetchAllRows } from '@/app/api/helpers/paginated-data';

interface Row {
  id: number;
}

const pgError = {
  message: 'boom',
  details: '',
  hint: '',
  code: '500',
} as unknown as PostgrestError;

// A fake query source that slices `rows` by range, like PostgREST would.
function source(rows: Row[], errorAtCall?: number) {
  let calls = 0;
  const makeQuery = () => ({
    range: async (from: number, to: number) => {
      calls += 1;
      if (errorAtCall && calls === errorAtCall) {
        return { data: null, error: pgError };
      }
      return { data: rows.slice(from, to + 1), error: null };
    },
  });
  return { makeQuery, getCalls: () => calls };
}

describe('fetchAllRows', () => {
  it('fetches every row across multiple batches', async () => {
    const rows = [1, 2, 3, 4, 5].map((id) => ({ id }));
    const { makeQuery, getCalls } = source(rows);

    const { data, error } = await fetchAllRows<Row>(makeQuery, 2);

    expect(error).toBeNull();
    expect(data.map((r) => r.id)).toEqual([1, 2, 3, 4, 5]);
    // 2 + 2 + 1(short, stop) => 3 calls
    expect(getCalls()).toBe(3);
  });

  it('stops after one call when the first batch is short', async () => {
    const { makeQuery, getCalls } = source([{ id: 1 }], 0);
    const { data } = await fetchAllRows<Row>(makeQuery, 1000);
    expect(data).toHaveLength(1);
    expect(getCalls()).toBe(1);
  });

  it('returns an empty array with no rows', async () => {
    const { makeQuery, getCalls } = source([]);
    const { data, error } = await fetchAllRows<Row>(makeQuery, 2);
    expect(data).toEqual([]);
    expect(error).toBeNull();
    expect(getCalls()).toBe(1);
  });

  it('propagates an error and returns what it had so far', async () => {
    const rows = [1, 2, 3, 4].map((id) => ({ id }));
    const { makeQuery } = source(rows, 2); // fail on the 2nd batch
    const { data, error } = await fetchAllRows<Row>(makeQuery, 2);
    expect(error).not.toBeNull();
    expect(data.map((r) => r.id)).toEqual([1, 2]);
  });
});
