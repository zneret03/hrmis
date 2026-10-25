import { JSX } from 'react';
import { Container } from '@/components/custom/Container';
import { MasterListTable } from './components/MasterListTable';
import { getEmployeeMasterList } from '@/services/users/master-list.services';
import { getAllEmployeeStatus } from '@/services/employee_status/employee-status.services';

export default async function EmployeeMasterListPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}): Promise<JSX.Element> {
  const { status } = await searchParams;
  const activeStatus = status || 'all';

  const [employees, statuses] = await Promise.all([
    getEmployeeMasterList(activeStatus),
    getAllEmployeeStatus(),
  ]);

  return (
    <Container
      title="Employee Master List"
      description="View or export the list of employees, filtered by employment status"
    >
      <MasterListTable
        {...{
          employees: employees || [],
          statuses: statuses || [],
          activeStatus,
        }}
      />
    </Container>
  );
}
