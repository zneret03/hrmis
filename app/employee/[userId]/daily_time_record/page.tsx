import { JSX } from 'react';
import { Container } from '@/components/custom/Container';
import { fetchDTRByMonth } from '@/services/biometrics/biometrics.services';
import { DTRTable } from './components/DTRTable';

export default async function DailyTimeRecord(): Promise<JSX.Element> {
  const response = await fetchDTRByMonth();

  return (
    <Container
      title="Daily Time Record"
      description="You can see here your daily time record"
    >
      <DTRTable
        dtr={response?.dtr ?? []}
        employee={
          response?.employee ?? {
            first_name: null,
            last_name: null,
            position: null,
            employee_id: '',
          }
        }
      />
    </Container>
  );
}
