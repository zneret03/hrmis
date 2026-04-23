import { NextRequest } from 'next/server';
import { createClient } from '@/config';
import {
  badRequestResponse,
  successResponse,
  generalErrorResponse,
} from '../../helpers/response';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const url = req.nextUrl.searchParams;
    const recipientId = url.get('recipientId') || '';

    let query = supabase
      .from('notifications')
      .select(
        'id, recipient_id, sender_id, type, reference_id, message, read_at, created_at, sender:users!notifications_sender_id_fkey(id, username, email)',
      )
      .is('archived_at', null)
      .order('created_at', { ascending: false });

    if (recipientId) {
      query = query.eq('recipient_id', recipientId);
    }

    const { data, error } = await query;

    if (error) {
      return badRequestResponse({ error: error.message });
    }

    return successResponse({
      message: 'Successfully fetched notifications.',
      data: { notifications: data },
    });
  } catch (error) {
    const newError = error as Error;
    return generalErrorResponse({ error: newError.message });
  }
}
