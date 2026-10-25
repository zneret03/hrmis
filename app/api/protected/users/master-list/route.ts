import { NextRequest } from 'next/server';
import {
  badRequestResponse,
  generalErrorResponse,
  successResponse,
  csvResponse,
} from '../../../helpers/response';
import { createClient } from '@/config';
import { toCSV } from '@/app/api/helpers/csvHelpers';
import { fetchAllRows } from '@/app/api/helpers/paginated-data';
import { Users } from '@/lib/types/users';

const USER_COLUMNS =
  'employee_id, first_name, middle_name, last_name, gender, employment_status, position, email';

type MasterListUser = Pick<
  Users,
  | 'employee_id'
  | 'first_name'
  | 'middle_name'
  | 'last_name'
  | 'gender'
  | 'employment_status'
  | 'position'
  | 'email'
>;

interface MasterListRow {
  employee_id: string;
  name: string;
  gender: string;
  employment_status: string;
  position: string;
  email: string;
}

const CSV_COLUMNS = [
  { key: 'employee_id' as const, header: 'Employee ID' },
  { key: 'name' as const, header: 'Name' },
  { key: 'gender' as const, header: 'Gender' },
  { key: 'employment_status' as const, header: 'Employment Status' },
  { key: 'position' as const, header: 'Position' },
  { key: 'email' as const, header: 'Email' },
];

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();

    const url = req.nextUrl.searchParams;
    const status = url.get('status') || 'all';
    const format = url.get('format');
    const page = Math.max(Number(url.get('page') || 1), 1);
    const perPage = Number(url.get('perPage') || 10);

    // Fresh base query per call — `all` returns every active user, otherwise
    // filter by status. Used both for the batched export and the paged view.
    const baseQuery = (withCount = false) => {
      let query = supabase
        .from('users')
        .select(USER_COLUMNS, withCount ? { count: 'exact' } : undefined)
        .is('archived_at', null)
        .order('last_name', { ascending: true });
      if (status && status !== 'all') {
        query = query.eq('employment_status', status);
      }
      return query;
    };

    const toRow = (user: MasterListUser): MasterListRow => ({
      employee_id: user.employee_id ?? '',
      name: [user.last_name, user.first_name, user.middle_name]
        .filter(Boolean)
        .join(', '),
      gender: user.gender ?? '',
      employment_status: user.employment_status ?? '',
      position: user.position ?? '',
      email: user.email ?? '',
    });

    // Export: every matching row (batched past the 1000-row cap).
    if (format === 'csv') {
      const { data, error } = await fetchAllRows<MasterListUser>(baseQuery);
      if (error) return badRequestResponse({ error: error.message });
      const label = status === 'all' ? 'all' : status.toLowerCase();
      return csvResponse(
        toCSV(data.map(toRow), CSV_COLUMNS),
        `employees-${label}.csv`,
      );
    }

    // View: one page at a time.
    const from = (page - 1) * perPage;
    const { data, error, count } = await baseQuery(true).range(
      from,
      from + perPage - 1,
    );
    if (error) return badRequestResponse({ error: error.message });

    return successResponse({
      message: 'Successfully fetched employee master list',
      data: {
        employees: ((data ?? []) as MasterListUser[]).map(toRow),
        count: count ?? 0,
        totalPages: Math.ceil((count ?? 0) / perPage),
        currentPage: page,
      },
    });
  } catch (error) {
    const newError = error as Error;
    return generalErrorResponse({ error: newError.message });
  }
}
