import { JSX } from 'react';
import { Container } from '@/components/custom/Container';

import {
  fetchGenderStatistics,
  fetchAgeStatistics,
  fetchLoyaltyAwards,
  fetchEmploymentStatusStatistics,
  fetchTardinessStatistics,
} from '@/services/users/users.services';
import { AgeStatisticsTable } from './components/AgeStatisticsTable';
import { GenderStatisticsTable } from './components/GenderStatisticsTable';
import { LoyaltyAwardsTable } from './components/LoyaltyAwardsTable';
import { EmploymentStatusTable } from './components/EmploymentStatusTable';
import { TardinessTable } from './components/TardinessTable';

export default async function Charts(): Promise<JSX.Element> {
  const gender = await fetchGenderStatistics();
  const age = await fetchAgeStatistics();
  const loyaltyAwards = await fetchLoyaltyAwards();
  const employmentStatus = await fetchEmploymentStatusStatistics();
  const tardiness = await fetchTardinessStatistics();

  return (
    <Container title="Charts" description="All table charts here">
      <section className="space-y-4">
        <GenderStatisticsTable {...{ gender }} />
        <AgeStatisticsTable {...{ age }} />
        <LoyaltyAwardsTable {...{ loyaltyAwards }} />
        <EmploymentStatusTable {...{ employmentStatus }} />
        <TardinessTable {...{ tardiness }} />
      </section>
    </Container>
  );
}
