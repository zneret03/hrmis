import { NextRequest } from 'next/server';
import { validationErrorNextResponse } from '../../../helpers/response';
import { isEmpty } from 'lodash';
import { editLoyaltyThreshold } from '../../model/loyalty_threshold';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();

  if (isEmpty(body)) {
    return validationErrorNextResponse();
  }

  if (body.type === 'delete-loyalty-threshold') {
    return editLoyaltyThreshold({ archived_at: body.archivedAt }, id);
  }

  if (body.type === 'edit-loyalty-threshold') {
    return editLoyaltyThreshold(
      { year_threshold: Number(body.year_threshold) },
      id,
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const today = new Date();

  if (!id) {
    return validationErrorNextResponse();
  }

  return editLoyaltyThreshold({ archived_at: today }, id);
}
