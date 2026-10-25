import { JSX } from 'react';
import { Container } from '@/components/custom/Container';
import { EmployeeStatusTable } from './components/EmployeeStatusTable';
import { AddEmployeeStatusDialog } from './components/AddStatusDialog';
import { EditEmployeeStatusDialog } from './components/EditStatusDialog';
import { DeleteEmployeeStatusDialog } from './components/DeleteDialog';
import { getEmployeeStatus } from '@/services/employee_status/employee-status.services';
import { EmployeeStatus as EmployeeStatusType } from '@/lib/types/employee_status';

export default async function EmployeeStatusPage({
  searchParams,
}: {
  searchParams: Promise<{ page: string; search: string }>;
}): Promise<JSX.Element> {
  const { page, search } = await searchParams;
  const response = await getEmployeeStatus(
    `?page=${page}&perPage=10&search=${search}&sortBy=created_at`,
  );

  return (
    <Container
      title="Employee Status"
      description="Manage the employment statuses available during employee registration"
    >
      <EmployeeStatusTable
        {...{
          employee_status:
            (response?.employee_status as EmployeeStatusType[]) || [],
          totalPages: response?.totalPages as number,
          currentPage: response?.currentPage as number,
          count: response?.count as number,
        }}
      />

      <AddEmployeeStatusDialog />
      <EditEmployeeStatusDialog />
      <DeleteEmployeeStatusDialog />
    </Container>
  );
}
