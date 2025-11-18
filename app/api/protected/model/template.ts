import { createClient } from '@/config';
import { removeImageViaPath, uploadImage } from '../../helpers/image/image';
import { getImagePath } from '../../helpers/image/image';
import { generalErrorResponse, successResponse } from '../../helpers/response';

export const updatePdf = async (args: {
  id: string;
  file: File;
  oldFile: string;
}) => {
  try {
    const { id, file, oldFile } = args;

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
};

export const updatePdfWithName = async (args: {
  id: string;
  name: string;
  file: File;
  type: string;
  oldFile: string;
}) => {
  try {
    const { id, name, file, type, oldFile } = args;

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
};
