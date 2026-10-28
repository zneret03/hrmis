import { JSX } from 'react';
import { Container } from '@/components/custom/Container';
import {
  EmployeePickerList,
  PickerEmployee,
} from '@/app/components/EmployeePickerList';
import { fetchAllUsers } from '@/services/users/users.services';
import { employeeName } from '@/helpers/employeeName';
import { Users } from '@/lib/types/users';

type EmployeeRow = Pick<
  Users,
  | 'id'
  | 'username'
  | 'first_name'
  | 'last_name'
  | 'email'
  | 'employee_id'
  | 'role'
  | 'archived_at'
>;

export default async function ServiceRecordPage(): Promise<JSX.Element> {
  const usersResponse = await fetchAllUsers();
  const users = (usersResponse?.users ?? []) as EmployeeRow[];

  const list: PickerEmployee[] = users
    .filter((user) => user.role === 'employee' && !user.archived_at)
    .map((user) => ({
      id: user.id,
      name: employeeName(user),
      email: user.email,
      employee_id: user.employee_id,
    }))
    .sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''));

  return (
    <Container
      title="Employee Service Record"
      description="Select an employee to view or encode their service record."
    >
      <EmployeePickerList employees={list} />
    </Container>
  );
}
