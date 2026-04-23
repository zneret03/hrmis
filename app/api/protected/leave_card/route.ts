import { NextRequest } from 'next/server';
import { createClient } from '@/config';
import {
  badRequestResponse,
  successResponse,
  generalErrorResponse,
  validationErrorNextResponse,
} from '../../helpers/response';
import { isEmpty } from 'lodash';
import { addLeaveCardEntry } from '../model/leave_card_entries';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const url = req.nextUrl.searchParams;
    const userId = url.get('userId') || '';
    const year = url.get('year') || '';

    let query = supabase
      .from('leave_card_entries')
      .select(
        'id, user_id, year, month, earned_vacation, earned_sick, enjoyed_vacation, enjoyed_sick, tardy_count, undertime_hours, undertime_minutes, undertime_days_equiv, total_spent_vacation, total_spent_sick, lwop_vacation, lwop_sick, balance_vacation, balance_sick, maternity_leave, remarks, encoded_by, leave_application_id, created_at, updated_at, users!leave_card_entries_user_id_fkey(id, username, email, employee_id)',
      )
      .is('archived_at', null)
      .order('year', { ascending: false })
      .order('month', { ascending: true });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    if (year) {
      query = query.eq('year', Number(year));
    }

    const { data, error } = await query;

    if (error) {
      return badRequestResponse({ error: error.message });
    }

    return successResponse({
      message: 'Successfully fetched leave card entries.',
      data: { leave_card_entries: data },
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

  if (body.type === 'add-leave-card-entry') {
    return addLeaveCardEntry(body.data);
  }

  return validationErrorNextResponse();
}
