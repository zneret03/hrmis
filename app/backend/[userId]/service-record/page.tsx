import { JSX } from 'react';
import { Container } from '@/components/custom/Container';
import { ServiceRecordTable } from './components/ServiceRecordTable';
import { ServiceRecordFormDialog } from './components/ServiceRecordFormDialog';
import { DeleteServiceRecordDialog } from './components/DeleteDialog';
import { getServiceRecords } from '@/services/service_record/service-record.services';
import { fetchAllUsers } from '@/services/users/users.services';

export default async function ServiceRecordPage(): Promise<JSX.Element> {
  const [records, usersResponse] = await Promise.all([
    getServiceRecords(),
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
      <ServiceRecordTable records={records ?? []} />
      <ServiceRecordFormDialog users={users} />
      <DeleteServiceRecordDialog />
    </Container>
  );
}
