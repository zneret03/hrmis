'use client'

import { JSX } from 'react'
import { LeaveApplicationsForm } from '@/lib/types/leave_application'
import { LeaveCard } from '../../personal_management/components/LeaveCard'

import { Pagination } from '@/components/custom/Pagination'
import { Pagination as PaginationTypes } from '@/lib/types/pagination'

interface Leaves extends PaginationTypes {
  leaveApplications: LeaveApplicationsForm[]
}

export function Leaves({
  leaveApplications,
  totalPages,
  currentPage,
  count
}: Leaves): JSX.Element {
  return (
    <main>
      <div className='grid grid-cols-4 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-4'>
        {leaveApplications?.map((item: LeaveApplicationsForm) => (
          <LeaveCard key={item.id} {...item} />
        ))}
      </div>

      <Pagination {...{ totalPages, currentPage, count }} />
    </main>
  )
}
