import { generalErrorResponse } from '@/app/api/helpers/response';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    console.log(formData);
  } catch (error) {
    return generalErrorResponse({ error: error });
  }
}
