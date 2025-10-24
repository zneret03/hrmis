import { JSX } from 'react';
import { Container } from '@/components/custom/Container';
import { getLeaveApplications } from '@/services/leave_applications/leave-applications.services';

import { Leaves } from './components/Leaves';
import { EmptyPlaceholder } from '@/components/custom/EmptyPlaceholder';

export default async function leaveSummary({
  searchParams,
}: {
  searchParams: Promise<{ page: string }>;
}): Promise<JSX.Element> {
  const { page } = await searchParams;
  const response = await getLeaveApplications(
    `?page=${page || 1}&perPage=20&sortBy=status`,
  );

  return (
    <Container title="Leave Lists" description="Leave lists summary">
      <div className="space-y-2">
        <Leaves
          {...{
            leaveApplications: response?.leave_applications,
            totalPages: response.totalPages,
            currentPage: response.currentPage,
            count: response.count,
          }}
        />

        {response?.leaveApplications?.length <= 0 && (
          <div className="text-center">
            <EmptyPlaceholder />
          </div>
        )}
      </div>
    </Container>
  );
}
