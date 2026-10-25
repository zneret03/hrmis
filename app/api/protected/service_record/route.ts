import { NextRequest } from 'next/server';
import {
  validationErrorNextResponse,
  badRequestResponse,
  successResponse,
  generalErrorResponse,
  unauthorizedResponse,
  forbiddenResponse,
} from '../../helpers/response';
import { createClient } from '@/config';
import { isEmpty } from 'lodash';
import { addServiceRecord } from '../model/service_record';

const SELECT =
  'id, user_id, position, status, salary, station, from_date, to_date, remarks, created_at, updated_at, archived_at, users:user_id(first_name, last_name, employee_id)';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return unauthorizedResponse();

    const { data: me } = await supabase
      .from('users')
      .select('role, id')
      .eq('id', user.id)
      .single();

    // Employees may only see their own records; admins can see all or filter.
    let targetUserId = req.nextUrl.searchParams.get('userId');
    if (me?.role !== 'admin') {
      targetUserId = me?.id ?? '';
    }

    let query = supabase
      .from('service_record')
      .select(SELECT)
      .is('archived_at', null)
      .order('from_date', { ascending: false });

    if (targetUserId) {
      query = query.eq('user_id', targetUserId);
    }

    const { data, error } = await query;
    if (error) return badRequestResponse({ error: error.message });

    return successResponse({
      message: 'Successfully fetched service records',
      data: { service_record: data },
    });
  } catch (error) {
    const newError = error as Error;
    return generalErrorResponse({ error: newError.message });
  }
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return unauthorizedResponse();

  const { data: me } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();
  if (me?.role !== 'admin') {
    return forbiddenResponse({
      error: 'Only admins can manage service records.',
    });
  }

  const body = await req.json();
  if (isEmpty(body)) {
    return validationErrorNextResponse();
  }

  if (body.type === 'add-service-record') {
    return addServiceRecord(body);
  }
}
