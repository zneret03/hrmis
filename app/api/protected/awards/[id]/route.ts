import { NextRequest } from 'next/server';
import { isEmpty } from 'lodash';
import { validationErrorNextResponse } from '@/app/api/helpers/response';
import { updateAward, updateThreshold } from '../../model/awards';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();

  if (isEmpty(body)) {
    return validationErrorNextResponse();
  }

  if (body.type === 'update-award') {
    return updateAward(body.data, id);
  }

  if (body.type === 'update-threshold') {
    return updateThreshold(body.data.value, id);
  }
}
