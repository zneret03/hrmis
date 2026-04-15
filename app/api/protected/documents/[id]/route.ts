import { NextRequest } from 'next/server';
import { isEmpty } from 'lodash';
import { createClient } from '@/config';
import {
  generalErrorResponse,
  successResponse,
  validationErrorNextResponse,
} from '@/app/api/helpers/response';
import { updateDocument } from '../../model/certificates';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('certificates')
      .select('id, title, reasons')
      .eq('user_id', id)
      .is('read_at', null);

    if (error) {
      return generalErrorResponse({ error: error });
    }

    return successResponse({
      message: 'Successfully fetch certificates',
      data,
    });
  } catch (error) {
    return generalErrorResponse({ error: error });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();

  if (isEmpty(body)) {
    return validationErrorNextResponse();
  }

  if (body.type === 'update-document') {
    return updateDocument(body.data, id);
  }
}
