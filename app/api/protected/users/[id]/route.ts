import {
  validationErrorNextResponse,
  badRequestResponse,
  generalErrorResponse,
  successResponse,
} from '@/app/api/helpers/response';
import { revokeUser, updateUserInfo } from '../../model/user';
import { createClient } from '@/config';
import { isEmpty } from 'lodash';
import { NextRequest } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await createClient();
    const { id: userId } = await params;

    const { error, data } = await supabase
      .from('users')
      .select(
        'id, email, username, avatar, role, employee_id, created_at, updated_at, archived_at',
      )
      .eq('id', userId)
      .single();

    if (error) {
      return badRequestResponse({ error: error.message });
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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const body = await req.json();
  const { id: userId } = await params;

  if (isEmpty(body)) {
    return validationErrorNextResponse();
  }

  if (body.type === 'banned-until') {
    return revokeUser(body, userId);
  }

  if (body.type === 'update-user-info') {
    return updateUserInfo(body, userId);
  }
}
