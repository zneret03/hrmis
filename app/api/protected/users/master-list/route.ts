import { NextRequest } from 'next/server';
import {
  badRequestResponse,
  generalErrorResponse,
  successResponse,
  csvResponse,
} from '../../../helpers/response';
import { createClient } from '@/config';
import { toCSV } from '@/app/api/helpers/csvHelpers';
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

    let query = supabase
      .from('users')
      .select(USER_COLUMNS)
      .is('archived_at', null)
      .order('last_name', { ascending: true });

    // `all` (or empty) returns every active user; otherwise filter by status.
    if (status && status !== 'all') {
      query = query.eq('employment_status', status);
    }

    const { data, error } = await query;

    if (error) {
      return badRequestResponse({ error: error.message });
    }

    const rows: MasterListRow[] = ((data ?? []) as MasterListUser[]).map(
      (user) => ({
        employee_id: user.employee_id ?? '',
        name: [user.last_name, user.first_name, user.middle_name]
          .filter(Boolean)
          .join(', '),
        gender: user.gender ?? '',
        employment_status: user.employment_status ?? '',
        position: user.position ?? '',
        email: user.email ?? '',
      }),
    );

    if (format === 'csv') {
      const label = status === 'all' ? 'all' : status.toLowerCase();
      return csvResponse(toCSV(rows, CSV_COLUMNS), `employees-${label}.csv`);
    }

    return successResponse({
      message: 'Successfully fetched employee master list',
      data: { employees: rows },
    });
  } catch (error) {
    const newError = error as Error;
    return generalErrorResponse({ error: newError.message });
  }
}
