import { JSX } from 'react';
import { Container } from '@/components/custom/Container';
import { ServiceRecordView } from './components/ServiceRecordView';
import { getServiceRecords } from '@/services/service_record/service-record.services';

export default async function EmployeeServiceRecordPage(): Promise<JSX.Element> {
  // The API scopes employees to their own records automatically.
  const records = await getServiceRecords();

  return (
    <Container title="Service Record" description="Your service record history">
      <ServiceRecordView records={records ?? []} />
    </Container>
  );
}
