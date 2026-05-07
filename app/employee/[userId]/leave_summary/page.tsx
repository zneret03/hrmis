import { JSX } from 'react';
import { Container } from '@/components/custom/Container';
import { getLeaveApplications } from '@/services/leave_applications/leave-applications.services';
import { Leaves } from './components/Leaves';
import { EmptyPlaceholder } from '@/components/custom/EmptyPlaceholder';
import { CancelLeaveDialog } from './components/CancelLeaveDialog';
import { LeavePageHeader } from './components/LeavePageHeader';

export default async function leaveSummary({
  searchParams,
}: {
  searchParams: Promise<{ page: string }>;
}): Promise<JSX.Element> {
  const { page } = await searchParams;

  const response = await getLeaveApplications(
    `?page=${page || 1}&perPage=20&sortBy=status`,
  );

  const hasLeaves = (response?.leave_applications?.length ?? 0) > 0;

  return (
    <Container
      title="Leave Applications"
      description="Your leave applications and history."
    >
      <>
        <LeavePageHeader />

        <div className="space-y-2">
          {hasLeaves ? (
            <Leaves
              leaveApplications={response?.leave_applications}
              totalPages={response.totalPages}
              currentPage={response.currentPage}
              count={response.count}
            />
          ) : (
            <div className="text-center">
              <EmptyPlaceholder />
            </div>
          )}
        </div>

        <CancelLeaveDialog />
      </>
    </Container>
  );
}
