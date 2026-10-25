import { JSX } from 'react';
import { Container } from '@/components/custom/Container';
import { LoyaltyThresholdTable } from './components/LoyaltyThresholdTable';
import { AddLoyaltyThresholdDialog } from './components/AddThresholdDialog';
import { EditLoyaltyThresholdDialog } from './components/EditThresholdDialog';
import { DeleteLoyaltyThresholdDialog } from './components/DeleteDialog';
import { getLoyaltyThreshold } from '@/services/loyalty_threshold/loyalty-threshold.services';
import { EmployeeLoyaltyThreshold } from '@/lib/types/loyalty_threshold';

export default async function LoyaltyThresholdPage({
  searchParams,
}: {
  searchParams: Promise<{ page: string }>;
}): Promise<JSX.Element> {
  const { page } = await searchParams;
  const response = await getLoyaltyThreshold(
    `?page=${page}&perPage=10&sortBy=year_threshold`,
  );

  return (
    <Container
      title="Loyalty Threshold"
      description="Manage the years-of-service milestones that qualify for a loyalty award"
    >
      <LoyaltyThresholdTable
        {...{
          loyalty_threshold:
            (response?.loyalty_threshold as EmployeeLoyaltyThreshold[]) || [],
          totalPages: response?.totalPages as number,
          currentPage: response?.currentPage as number,
          count: response?.count as number,
        }}
      />

      <AddLoyaltyThresholdDialog />
      <EditLoyaltyThresholdDialog />
      <DeleteLoyaltyThresholdDialog />
    </Container>
  );
}
