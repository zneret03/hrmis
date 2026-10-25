import { JSX } from 'react';
import { Container } from '@/components/custom/Container';
import { ServiceRecordView } from './components/ServiceRecordView';
import { getServiceRecords } from '@/services/service_record/service-record.services';

export default async function EmployeeServiceRecordPage(): Promise<JSX.Element> {
  // The API scopes employees to their own records automatically. A high perPage
  // returns the full (small) personal history in one view.
  const list = await getServiceRecords({ perPage: 1000 });

  return (
    <Container title="Service Record" description="Your service record history">
      <ServiceRecordView records={list.records} />
    </Container>
  );
}
