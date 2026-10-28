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
import { differenceInYears } from 'date-fns';
import { Users } from '@/lib/types/users';

type Category = 'gender' | 'age' | 'employment' | 'loyalty';

const COLUMN_HEADER: Record<Category, string> = {
  gender: 'Gender',
  age: 'Age',
  employment: 'Employment Status',
  loyalty: 'Years of Service',
};

const USER_COLUMNS =
  'id, employee_id, first_name, middle_name, last_name, gender, employment_status, birthdate, date_of_original_appointment';

type CategoryUser = Pick<
  Users,
  | 'id'
  | 'employee_id'
  | 'first_name'
  | 'middle_name'
  | 'last_name'
  | 'gender'
  | 'employment_status'
  | 'birthdate'
  | 'date_of_original_appointment'
>;

function isCategory(value: string | null): value is Category {
  return (
    value === 'gender' ||
    value === 'age' ||
    value === 'employment' ||
    value === 'loyalty'
  );
}

function composeName(user: CategoryUser): string {
  return [user.last_name, user.first_name, user.middle_name]
    .filter(Boolean)
    .join(', ');
}

// One row per employee counted for loyalty: years since they became Permanent
// (see the get_employee_years_of_service SQL function).
type YearsOfService = { user_id: string; years_of_service: number };

function categoryValue(
  user: CategoryUser,
  category: Category,
  yearsOfService: Map<string, number>,
): string {
  switch (category) {
    case 'gender':
      return user.gender ?? '';
    case 'employment':
      return user.employment_status ?? '';
    case 'age':
      return user.birthdate
        ? String(differenceInYears(new Date(), new Date(user.birthdate)))
        : '';
    case 'loyalty': {
      const years = yearsOfService.get(user.id);
      return years === undefined ? '' : String(years);
    }
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();

    const url = req.nextUrl.searchParams;
    const category = url.get('category');
    const format = url.get('format');

    if (!isCategory(category)) {
      return badRequestResponse({
        error: 'category must be one of gender, age, employment, loyalty',
      });
    }

    // Full set (batched past the 1000-row cap) so View and Export match the
    // chart statistic counts.
    const { data, error } = await fetchAllRows<CategoryUser>(() =>
      supabase
        .from('users')
        .select(USER_COLUMNS)
        .is('archived_at', null)
        .order('last_name', { ascending: true }),
    );

    if (error) {
      return badRequestResponse({ error: error.message });
    }

    // Loyalty uses the same years-of-service rule as the chart statistic.
    const yearsOfService = new Map<string, number>();
    if (category === 'loyalty') {
      const { data: years, error: yearsError } =
        await fetchAllRows<YearsOfService>(() =>
          supabase
            .rpc('get_employee_years_of_service')
            .order('user_id', { ascending: true }),
        );

      if (yearsError) {
        return badRequestResponse({ error: yearsError.message });
      }

      for (const row of years) {
        yearsOfService.set(row.user_id, row.years_of_service);
      }
    }

    const header = COLUMN_HEADER[category];
    // Only include users who have the relevant attribute, matching the chart
    // statistics (which count `WHERE <attribute> IS NOT NULL`).
    const rows = ((data ?? []) as CategoryUser[])
      .map((user) => ({
        employee_id: user.employee_id ?? '',
        name: composeName(user),
        value: categoryValue(user, category, yearsOfService),
      }))
      .filter((row) => row.value !== '');

    if (format === 'csv') {
      const csv = toCSV(rows, [
        { key: 'employee_id', header: 'Employee ID' },
        { key: 'name', header: 'Name' },
        { key: 'value', header },
      ]);
      return csvResponse(csv, `employees-by-${category}.csv`);
    }

    return successResponse({
      message: 'Successfully fetched employees by category',
      data: { header, employees: rows },
    });
  } catch (error) {
    const newError = error as Error;
    return generalErrorResponse({ error: newError.message });
  }
}
