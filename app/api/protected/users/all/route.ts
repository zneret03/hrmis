import {
  badRequestResponse,
  generalErrorResponse,
  successResponse,
} from '../../../helpers/response';
import { createClient } from '@/config';

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('users')
      .select(
        'id, employee_id, username, email, role, avatar, created_at, updated_at, archived_at',
      );

    if (error) {
      return badRequestResponse({ error: error.message });
    }

    return successResponse({
      message: 'Successfully fetched users',
      data: {
        users: data,
      },
    });
  } catch (error) {
    const newError = error as Error;
    return generalErrorResponse({ error: newError.message });
  }
}
