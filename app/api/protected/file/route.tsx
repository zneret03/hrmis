import { uploadFile } from './model/file';

export async function POST(req: Request) {
  const body = await req.formData();

  if (body.get('type') === 'upload-file') {
    return uploadFile(body);
  }
}
