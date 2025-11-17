import { NextRequest } from 'next/server';
import {
  generalErrorResponse,
  successResponse,
} from '@/app/api/helpers/response';
import { removeImageViaPath, uploadImage } from '@/app/api/helpers/image/image';
import { getImagePath } from '@/app/api/helpers/image/image';
import { createClient } from '@/config';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const formData = await request.formData();
    const { id } = await params;

    const name = formData.get('name') as string;
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;
    const oldFile = formData.get('oldFile') as string;

    const supabase = await createClient();

    removeImageViaPath(supabase, getImagePath(oldFile), 'documents');

    const { imageUrls, error } = await uploadImage(
      [file] as File[],
      supabase,
      'template',
      'documents',
      'application/pdf',
    );

    if (error) {
      return generalErrorResponse({ error: error });
    }

    const { error: templateError } = await supabase
      .from('document_templates')
      .update({
        file: imageUrls[0],
        type,
        name: name,
      })
      .eq('id', id);

    if (templateError) {
      removeImageViaPath(supabase, getImagePath(imageUrls[0]), 'documents');
      return generalErrorResponse({ error: templateError.message });
    }

    return successResponse({ message: 'Successfully updated template' });
  } catch (error) {
    const newError = error as Error;
    return generalErrorResponse({ error: newError.message });
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
