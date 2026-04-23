import { NextRequest } from 'next/server';
import { markNotificationRead } from '../../model/notifications';

export async function PUT(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return markNotificationRead(id);
}
