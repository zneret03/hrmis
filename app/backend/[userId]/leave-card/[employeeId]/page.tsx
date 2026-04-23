import { JSX } from 'react';
import { createClient } from '@/config';
import { Container } from '@/components/custom/Container';
import { LeaveCardTable } from '../components/LeaveCardTable';
import { LeaveCardEntryDialog } from '../components/LeaveCardEntryDialog';
import { DeleteLeaveCardEntryDialog } from '../components/DeleteLeaveCardEntryDialog';
import { PreviousButton } from '@/components/custom/PreviousButton';
import { Badge } from '@/components/ui/badge';

export default async function EmployeeLeaveCardPage({
  params,
}: {
  params: Promise<{ userId: string; employeeId: string }>;
}): Promise<JSX.Element> {
  const { employeeId } = await params;
  const supabase = await createClient();

  const [entriesResult, userResult] = await Promise.all([
    supabase
      .from('leave_card_entries')
      .select('*')
      .eq('user_id', employeeId)
      .is('archived_at', null)
      .order('year', { ascending: false })
      .order('month', { ascending: true }),
    supabase
      .from('users')
      .select('id, username, email, employee_id')
      .eq('id', employeeId)
      .single(),
  ]);

  const entries = entriesResult.data ?? [];
  const employee = userResult.data;

  return (
    <Container
      title="Personnel Leave Card"
      description="Leave card ledger encoded by HR/Admin."
    >
      <PreviousButton />
      <>
        <div className="flex flex-col gap-1">
          <div className="space-y-4">
            <span className="text-3xl font-semibold capitalize">
              {employee?.username ?? '—'}
            </span>
            <p className="text-muted-foreground text-sm">{employee?.email}</p>
            {employee?.employee_id && (
              <Badge variant="outline" className="text-xl">
                ID: {employee.employee_id}
              </Badge>
            )}
          </div>
        </div>

        <LeaveCardTable data={entries} userId={employeeId} />

        <LeaveCardEntryDialog targetUserId={employeeId} />
        <DeleteLeaveCardEntryDialog />
      </>
    </Container>
  );
}
