import { NextRequest } from 'next/server';
import {
  validationErrorNextResponse,
  badRequestResponse,
  successResponse,
  generalErrorResponse,
} from '../../helpers/response';
import { paginatedData } from '../../helpers/paginated-data';
import { createClient } from '@/config';
import { isEmpty } from 'lodash';
import { addEmployeeStatus } from '../model/employee_status';
import { EmployeeStatus } from '@/lib/types/employee_status';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();

    const url = req.nextUrl.searchParams;

    // `?all=true` returns every active status (for registration dropdowns).
    if (url.get('all') === 'true') {
      const { data, error } = await supabase
        .from('employee_status')
        .select('id, name')
        .is('archived_at', null)
        .order('name', { ascending: true });

      if (error) {
        return badRequestResponse({ error: error.message });
      }

      return successResponse({
        message: 'Successfully fetched employee status',
        data: { employee_status: data },
      });
    }

    const page = Number(url.get('page') || 1);
    const perPage = Number(url.get('perPage') || 10);
    const sortBy = url.get('sortBy') || 'created_at';
    const search = url.get('search') || '';

    const { data, error, count, totalPages, currentPage } =
      await paginatedData<EmployeeStatus>({
        tableName: 'employee_status',
        supabase,
        columns: 'id, name, created_at, updated_at, archived_at',
        search: { column: 'name', query: search },
        page,
        perPage,
        sortBy,
      });

    if (error) {
      return badRequestResponse({ error: error.message });
    }

    return successResponse({
      message: 'Successfully fetched employee status',
      data: {
        employee_status: data,
        count,
        totalPages,
        currentPage,
      },
    });
  } catch (error) {
    const newError = error as Error;
    return generalErrorResponse({ error: newError.message });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (isEmpty(body)) {
    return validationErrorNextResponse();
  }

  if (body.type === 'add-employee-status') {
    return addEmployeeStatus(body.name);
  }
}
