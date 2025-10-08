import { JSX } from 'react'
import { Container } from '@/components/custom/Container'
import { getDashboardAnalytics } from '@/services/dashboard/dashboard.service'
import { LeaveApplicationsForm } from '@/lib/types/leave_application'
import { LeaveCard } from '@/app/components/LeaveCard'
import { AnalyticsCards } from './components/AnalyticsCards'
import { getLeaveApplications } from '@/services/leave_applications/leave-applications.services'
import { AttendanceLeaves } from '@/app/employee/[userId]/personal_management/components/AttendanceLeave'
import { FileLeaveDialog } from '@/app/auth/components/FileLeaveDialog'
import { getLeaveCategories } from '@/services/leave_categories/leave-categories.services'
import { getAttendanceAnalytics } from '@/services/attendance/attendance.services'
import { Chart } from './components/Barchart'
import { FormattedYear } from '@/lib/types/attendance'
import { getAwards } from '@/services/awards/awards.service'
import { EmployeeAwardsTable } from '../awards/components/AwardsTable'
import { CancelLeaveDialog } from '@/app/employee/[userId]/personal_management/components/CancelLeave'

export default async function Dashboard({
  searchParams
}: {
  searchParams: Promise<{ year: string }>
}): Promise<JSX.Element> {
  const { year } = await searchParams
  const today = new Date()

  const analytics = await getDashboardAnalytics()

  const { leave_applications: leaveApplications } = await getLeaveApplications(
    `?page=1&perPage=5&limt=5&sortBy=status`
  )

  const category = await getLeaveCategories('')

  const attendanceAnalytics = await getAttendanceAnalytics(
    `?year=${year || today.getFullYear()}`
  )

  const response = await getAwards(`?limit=5`)

  const dataMonths = (attendanceAnalytics as FormattedYear[])
    .map((item) => item.data)
    .flat()

  const dataYear = (attendanceAnalytics as FormattedYear[]).map(
    (item) => item.year
  )

  return (
    <Container
      title='Dashboard'
      description='You can see all statistics summaries here (e.g, attendance, card analytics and leave requests)'
    >
      <main className='space-y-4'>
        <AnalyticsCards
          {...{
            users: analytics.users || 0,
            leaves: analytics.leaves || 0,
            awards: analytics.awards || 0,
            certificates: analytics.certificates || 0
          }}
        />
        <div className='flex gap-4'>
          <section className='flex-3'>
            <Chart
              data={dataMonths}
              year={dataYear}
              currentYear={today.getFullYear().toString()}
            />
          </section>
          <section className='flex-1'>
            <div className='flex-1 space-y-4'>
              <AttendanceLeaves />
              {leaveApplications.map((item: LeaveApplicationsForm) => (
                <LeaveCard key={item.id} {...item} />
              ))}

              {leaveApplications.length <= 0 && (
                <div className='text-gray-500'>No leave requests</div>
              )}
            </div>
          </section>
        </div>

        <EmployeeAwardsTable
          {...{
            awards: response.awards,
            totalPages: response.totalPages,
            currentPage: response.currentPage,
            count: response.count
          }}
        />
      </main>

      <FileLeaveDialog category={category.leave_categories} />
      <CancelLeaveDialog />
    </Container>
  )
}
