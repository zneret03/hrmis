import { JSX } from 'react';
import { Container } from '@/components/custom/Container';

import {
  fetchGenderStatistics,
  fetchAgeStatistics,
} from '@/services/users/users.services';
import { AgeStatisticsTable } from './components/AgeStatisticsTable';
import { GenderStatisticsTable } from './components/GenderStatisticsTable';

export default async function Charts(): Promise<JSX.Element> {
  const gender = await fetchGenderStatistics();
  const age = await fetchAgeStatistics();

  return (
    <Container title="Charts" description="All table charts here">
      <section className="space-y-4">
        <GenderStatisticsTable {...{ gender }} />
        <AgeStatisticsTable {...{ age }} />
      </section>
    </Container>
  );
}
