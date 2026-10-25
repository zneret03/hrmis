import { PostgrestError, SupabaseClient } from '@supabase/supabase-js';

interface RangeableQuery<T> {
  range(
    from: number,
    to: number,
  ): PromiseLike<{ data: T[] | null; error: PostgrestError | null }>;
}

/**
 * Fetches every row of a query in batches, working around PostgREST's `max_rows`
 * cap (1000). `makeQuery` must return a FRESH query builder on each call (select
 * + filters + order, without range), e.g.
 *   fetchAllRows(() => supabase.from('users').select(cols).is('archived_at', null))
 * Use for CSV exports / aggregations that must include the full result set.
 */
export async function fetchAllRows<T>(
  makeQuery: () => RangeableQuery<T>,
  batchSize = 1000,
): Promise<{ data: T[]; error: PostgrestError | null }> {
  const all: T[] = [];
  let from = 0;

  for (;;) {
    const { data, error } = await makeQuery().range(from, from + batchSize - 1);
    if (error) return { data: all, error };
    if (!data || data.length === 0) break;
    all.push(...data);
    if (data.length < batchSize) break;
    from += batchSize;
  }

  return { data: all, error: null };
}

interface PaginatedData {
  tableName: string;
  supabase: SupabaseClient;
  columns: string;
  search?: {
    column: string;
    query: string;
  };
  sortOrder?: 'asc' | 'desc';
  page?: number;
  perPage?: number;
  sortBy?: string;
  specificTable?: {
    column: string;
    tableId: string;
  } | null;
  limit?: number;
}

export const paginatedData = async <TData>({
  tableName,
  supabase,
  columns,
  search,
  page,
  perPage,
  sortBy,
  specificTable,
  sortOrder = 'asc',
  limit,
}: PaginatedData): Promise<{
  data: TData[] | null;
  error: PostgrestError | null;
  totalPages: number;
  currentPage: number;
  count: number | null;
}> => {
  let query = supabase
    .from(tableName)
    .select(columns, { count: 'exact' })
    .is('archived_at', null);

  if (limit) {
    query = query.limit(limit);
  }

  if (specificTable?.column) {
    query = query.eq(specificTable.column, specificTable.tableId);
  }

  if (search && search.column && search.query !== 'undefined') {
    query = query.ilike(search.column, `%${search.query}%`);
  }

  if (sortBy) {
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });
  }

  const from = ((page as number) - 1) * (perPage as number);
  const to = from + (perPage as number) - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  const totalPages = Math.ceil(Number(count) / Number(perPage));

  return {
    data: data as TData[],
    totalPages,
    currentPage: page as number,
    error,
    count,
  };
};
