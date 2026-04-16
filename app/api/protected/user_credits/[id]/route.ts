import { NextRequest } from 'next/server';
import { createClient } from '@/config';
import {
  successResponse,
  badRequestResponse,
  generalErrorResponse,
  conflictRequestResponse,
} from '../../../helpers/response';
import { LeaveCreditsForm } from '@/lib/types/leave_credits';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await createClient();
    const { id: userId } = await params;

    const { error, data } = await supabase
      .from('leave_credits')
      .select(
        `id, credits, users!inner(
          id, employee_id, username, first_name, last_name, middle_name,
          birthdate, gender, civil_status, address, contact_number,
          position, employment_status, date_of_original_appointment,
          bp_number, philhealth, pagibig, tin,
          email, role, avatar, created_at, updated_at, archived_at
          ), created_at, updated_at, archived_at`,
      )
      .eq('user_id', userId)
      .single()
      .returns<LeaveCreditsForm>();

    if (error) {
      return badRequestResponse({ error: error.message });
    }

    if (data.users.employee_id === '') {
      return conflictRequestResponse({
        error: 'user does not have employee id',
      });
    }

    return successResponse({
      message: 'Successfully fetched user credits',
      data,
    });
  } catch (error) {
    const newError = error as Error;
    return generalErrorResponse({ error: newError.message });
  }
}
