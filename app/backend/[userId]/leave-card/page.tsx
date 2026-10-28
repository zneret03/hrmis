import { JSX } from 'react';
import { createClient } from '@/config';
import { Container } from '@/components/custom/Container';
import {
  EmployeePickerList,
  PickerEmployee,
} from '@/app/components/EmployeePickerList';

type EmployeeRow = {
  user_id: string | null;
  users: {
    id: string;
    username: string | null;
    email: string;
    employee_id: string | null;
    role: string;
  } | null;
};

export default async function LeaveCardPage(): Promise<JSX.Element> {
  const supabase = await createClient();

  const { data: employees } = await supabase
    .from('leave_credits')
    .select(
      'user_id, users!leave_credits_user_id_fkey(id, username, email, employee_id, role)',
    )
    .is('archived_at', null)
    .order('created_at', { ascending: true });

  const raw = (employees ?? []) as unknown as EmployeeRow[];
  const list: PickerEmployee[] = raw.flatMap(({ users }) =>
    users?.role === 'employee'
      ? [
          {
            id: users.id,
            name: users.username,
            email: users.email,
            employee_id: users.employee_id,
          },
        ]
      : [],
  );

  return (
    <Container
      title="Personnel Leave Card"
      description="Select an employee to view or encode their leave card."
    >
      <EmployeePickerList employees={list} />
    </Container>
  );
}
