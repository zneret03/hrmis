import { NextRequest } from 'next/server';
import { validationErrorNextResponse } from '@/app/api/helpers/response';
import { isEmpty } from 'lodash';
import {
  updateLeaveCardEntry,
  deleteLeaveCardEntry,
} from '../../model/leave_card_entries';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const body = await req.json();
  const { id } = await params;

  if (isEmpty(body)) {
    return validationErrorNextResponse();
  }

  if (body.type === 'update-leave-card-entry') {
    return updateLeaveCardEntry(id, body.data);
  }

  return validationErrorNextResponse();
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return deleteLeaveCardEntry(id);
}
