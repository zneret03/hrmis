import { NextRequest } from 'next/server';
import { validationErrorNextResponse } from '../../../helpers/response';
import { isEmpty } from 'lodash';
import { editEmployeeStatus } from '../../model/employee_status';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();

  if (isEmpty(body)) {
    return validationErrorNextResponse();
  }

  if (body.type === 'delete-employee-status') {
    return editEmployeeStatus({ archived_at: body.archivedAt }, id);
  }

  if (body.type === 'edit-employee-status') {
    return editEmployeeStatus({ name: body.name }, id);
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

  return editEmployeeStatus({ archived_at: today }, id);
}
