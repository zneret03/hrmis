import {
  generalErrorResponse,
  successResponse,
  badRequestResponse,
} from '../../helpers/response';
import { paginatedData } from '../../helpers/paginated-data';
import { getImagePath, removeImageViaPath } from '../../helpers/image/image';
import { createClient } from '@/config';
import { uploadImage } from '../../helpers/image/image';
import { NextRequest } from 'next/server';
import { TemplateDB } from '@/lib/types/template';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();

    const url = req.nextUrl.searchParams;

    const page = Number(url.get('page') || 1);
    const perPage = Number(url.get('perPage') || 10);
    const sortBy = url.get('sortBy') || 'created_at';
    const search = url.get('search') || '';
    const limit = url.get('limit') || '';

    const { data, error, count, totalPages, currentPage } =
      await paginatedData<TemplateDB>({
        tableName: 'document_templates',
        supabase,
        columns: 'id, file, created_at, updated_at, archived_at',
        search: { column: 'file', query: search },
        page,
        perPage,
        sortBy,
        limit: Number(limit) as number,
      });

    if (error) {
      return badRequestResponse({ error: error.message });
    }

    return successResponse({
      message: 'Successfully fetch templates',
      data: {
        templates: data || null,
        count,
        totalPages,
        currentPage,
      },
    });
  } catch (error) {
    const newError = error as Error;
    return generalErrorResponse({ error: newError.message });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const supabase = await createClient();

    const file = formData.get('file') as File;

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
      .insert({
        file: imageUrls[0],
        name: file.name,
      });

    if (templateError) {
      removeImageViaPath(supabase, getImagePath(imageUrls[0]), 'documents');
      return generalErrorResponse({ error: templateError.message });
    }

    return successResponse({ message: 'Successfully uploaded template' });
  } catch (error) {
    return generalErrorResponse({ error: error });
  }
}
