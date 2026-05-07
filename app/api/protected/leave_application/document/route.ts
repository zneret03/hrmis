import { NextRequest } from 'next/server';
import {
  generalErrorResponse,
  conflictRequestResponse,
  successResponse,
} from '@/app/api/helpers/response';
import { createClient } from '@/config';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const username = formData.get('username') as string;

    if (!file) {
      return conflictRequestResponse({ error: 'No file provided' });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    const filePath = `leave-applications/${username}/${timestamp}-leave-form.pdf`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, fileBuffer, {
        contentType: 'application/pdf',
        upsert: false,
      });

    if (uploadError) {
      return generalErrorResponse({ error: uploadError.message });
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('documents').getPublicUrl(uploadData.path);

    return successResponse({
      message: 'Document uploaded successfully',
      data: { url: publicUrl },
    });
  } catch (error) {
    const newError = error as Error;
    return generalErrorResponse({ error: newError.message });
  }
}
