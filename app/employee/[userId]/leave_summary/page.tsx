import { JSX } from 'react';
import { Container } from '@/components/custom/Container';
import { getLeaveApplications } from '@/services/leave_applications/leave-applications.services';
import { getLeaveCategories } from '@/services/leave_categories/leave-categories.services';
import { Leaves } from './components/Leaves';
import { EmptyPlaceholder } from '@/components/custom/EmptyPlaceholder';
import { FileLeaveDialog } from '@/app/auth/components/FileLeaveDialog';
import { CancelLeaveDialog } from './components/CancelLeaveDialog';
import { LeavePageHeader } from './components/LeavePageHeader';

export default async function leaveSummary({
  searchParams,
}: {
  searchParams: Promise<{ page: string }>;
}): Promise<JSX.Element> {
  const { page } = await searchParams;

  const [response, categoryResponse] = await Promise.all([
    getLeaveApplications(`?page=${page || 1}&perPage=20&sortBy=status`),
    getLeaveCategories(`?&search=&sortBy=created_at`),
  ]);

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

        <FileLeaveDialog category={categoryResponse?.leave_categories ?? []} />
        <CancelLeaveDialog />
      </>
    </Container>
  );
}
