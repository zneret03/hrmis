import { NextRequest } from 'next/server';
import {
  validationErrorNextResponse,
  unauthorizedResponse,
  forbiddenResponse,
} from '../../../helpers/response';
import { isEmpty } from 'lodash';
import { createClient } from '@/config';
import { editServiceRecord } from '../../model/service_record';

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, response: unauthorizedResponse() };

  const { data: me } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();
  if (me?.role !== 'admin') {
    return {
      ok: false as const,
      response: forbiddenResponse({
        error: 'Only admins can manage service records.',
      }),
    };
  }
  return { ok: true as const };
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await params;
  const body = await req.json();

  if (isEmpty(body)) {
    return validationErrorNextResponse();
  }

  if (body.type === 'delete-service-record') {
    return editServiceRecord({ archived_at: body.archivedAt }, id);
  }

  if (body.type === 'edit-service-record') {
    return editServiceRecord(body, id);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await params;
  if (!id) {
    return validationErrorNextResponse();
  }

  return editServiceRecord({ archived_at: new Date() }, id);
}
