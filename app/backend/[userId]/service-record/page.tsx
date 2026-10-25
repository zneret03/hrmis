import { JSX } from 'react';
import { Container } from '@/components/custom/Container';
import { ServiceRecordTable } from './components/ServiceRecordTable';
import { ServiceRecordFormDialog } from './components/ServiceRecordFormDialog';
import { DeleteServiceRecordDialog } from './components/DeleteDialog';
import { getServiceRecords } from '@/services/service_record/service-record.services';
import { fetchAllUsers } from '@/services/users/users.services';

export default async function ServiceRecordPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}): Promise<JSX.Element> {
  const { page } = await searchParams;
  const currentPage = Math.max(Number(page) || 1, 1);

  const [list, usersResponse] = await Promise.all([
    getServiceRecords({ page: currentPage }),
    fetchAllUsers(),
  ]);

  const users = (usersResponse?.users ?? []) as {
    id: string;
    employee_id: string | null;
    email: string;
  }[];

  return (
    <Container
      title="Employee Service Record"
      description="Add, edit, or delete service record entries for employees"
    >
      <ServiceRecordTable
        records={list.records}
        totalPages={list.totalPages}
        currentPage={list.currentPage}
      />
      <ServiceRecordFormDialog users={users} />
      <DeleteServiceRecordDialog />
    </Container>
  );
}
