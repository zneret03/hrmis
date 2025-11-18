import { NextRequest } from 'next/server';
import {
  generalErrorResponse,
  successResponse,
  badRequestResponse,
} from '@/app/api/helpers/response';
import { removeImageViaPath } from '@/app/api/helpers/image/image';
import { getImagePath } from '@/app/api/helpers/image/image';
import { TemplateDB } from '@/lib/types/template';
import { createClient } from '@/config';
import { updatePdf, updatePdfWithName } from '../../model/template';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    const { error, data } = await supabase
      .from('document_templates')
      .select('id, file, name, type, created_at, updated_at, archived_at')
      .eq('id', id)
      .single()
      .returns<TemplateDB>();

    if (error) {
      return badRequestResponse({ error: error.message });
    }

    return successResponse({
      message: 'Successfully fetched document template',
      data,
    });
  } catch (error) {
    const newError = error as Error;
    return generalErrorResponse({ error: newError.message });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const formData = await request.formData();
  const { id } = await params;

  const routeType = formData.get('routeType') as string;
  const name = formData.get('name') as string;
  const file = formData.get('file') as File;
  const type = formData.get('type') as string;
  const oldFile = formData.get('oldFile') as string;

  if (routeType === 'update-pdf') {
    return updatePdf({ id, file, oldFile });
  }

  if (routeType === 'update-pdf-with-name') {
    return updatePdfWithName({
      id,
      name,
      file,
      type,
      oldFile,
    });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const body = await req.json();
    const { id } = await params;
    const supabase = await createClient();

    removeImageViaPath(
      supabase,
      getImagePath(body.file as string),
      'documents',
    );

    await supabase.from('document_templates').delete().eq('id', id);

    return successResponse({
      message: 'Successfully Deleted template',
    });
  } catch (error) {
    const newError = error as Error;
    return generalErrorResponse({ error: newError.message });
  }
}
