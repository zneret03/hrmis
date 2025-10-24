'use client';

import { JSX } from 'react';
import { LeaveApplicationsForm } from '@/lib/types/leave_application';
import { LeaveCard } from '@/app/components/LeaveCard';

import { Pagination } from '@/components/custom/Pagination';
import { Pagination as PaginationTypes } from '@/lib/types/pagination';

interface Leaves extends PaginationTypes {
  leaveApplications: LeaveApplicationsForm[];
}

export function Leaves({
  leaveApplications,
  totalPages,
  currentPage,
  count,
}: Leaves): JSX.Element {
  return (
    <main>
      <div className="xs:grid-cols-1 grid grid-cols-4 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {leaveApplications?.map((item: LeaveApplicationsForm) => (
          <LeaveCard key={item.id} {...item} />
        ))}
      </div>

      <Pagination {...{ totalPages, currentPage, count }} />
    </main>
  );
}
