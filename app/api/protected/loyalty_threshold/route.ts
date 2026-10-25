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
import { addLoyaltyThreshold } from '../model/loyalty_threshold';
import { EmployeeLoyaltyThreshold } from '@/lib/types/loyalty_threshold';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();

    const url = req.nextUrl.searchParams;

    const page = Number(url.get('page') || 1);
    const perPage = Number(url.get('perPage') || 10);
    const sortBy = url.get('sortBy') || 'year_threshold';

    // No text search: year_threshold is an integer column (ilike would fail).
    const { data, error, count, totalPages, currentPage } =
      await paginatedData<EmployeeLoyaltyThreshold>({
        tableName: 'employee_loyalty_threshold',
        supabase,
        columns: 'id, year_threshold, created_at, updated_at, archived_at',
        page,
        perPage,
        sortBy,
      });

    if (error) {
      return badRequestResponse({ error: error.message });
    }

    return successResponse({
      message: 'Successfully fetched loyalty thresholds',
      data: {
        loyalty_threshold: data,
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

  if (body.type === 'add-loyalty-threshold') {
    return addLoyaltyThreshold(Number(body.year_threshold));
  }
}
