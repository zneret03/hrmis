import { NextRequest } from 'next/server';
import {
  badRequestResponse,
  generalErrorResponse,
  successResponse,
  csvResponse,
} from '../../../helpers/response';
import { createClient } from '@/config';
import { toCSV } from '@/app/api/helpers/csvHelpers';
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
  'employee_id, first_name, middle_name, last_name, gender, employment_status, birthdate, date_of_original_appointment';

type CategoryUser = Pick<
  Users,
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

function categoryValue(user: CategoryUser, category: Category): string {
  switch (category) {
    case 'gender':
      return user.gender ?? '';
    case 'employment':
      return user.employment_status ?? '';
    case 'age':
      return user.birthdate
        ? String(differenceInYears(new Date(), new Date(user.birthdate)))
        : '';
    case 'loyalty':
      return user.date_of_original_appointment
        ? String(
            differenceInYears(
              new Date(),
              new Date(user.date_of_original_appointment),
            ),
          )
        : '';
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

    const { data, error } = await supabase
      .from('users')
      .select(USER_COLUMNS)
      .is('archived_at', null)
      .order('last_name', { ascending: true });

    if (error) {
      return badRequestResponse({ error: error.message });
    }

    const header = COLUMN_HEADER[category];
    // Only include users who have the relevant attribute, matching the chart
    // statistics (which count `WHERE <attribute> IS NOT NULL`).
    const rows = ((data ?? []) as CategoryUser[])
      .map((user) => ({
        employee_id: user.employee_id ?? '',
        name: composeName(user),
        value: categoryValue(user, category),
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
