import { JSX } from 'react'
import { FileLeaveDialog } from '@/app/auth/components/FileLeaveDialog'
import { AttendanceLeaves } from './components/AttendanceLeave'
import { UserDetails } from '@/app/components/UserDetails'
import { fetchUserWitHCredits } from '@/services/leave_credits/leave_credits.services'
import { Container } from '@/components/custom/Container'
import { LeaveCard } from '@/app/components/LeaveCard'

import { getAttendanceSummary } from '@/services/attendance/attendance.services'
import { getLeaveCategories } from '@/services/leave_categories/leave-categories.services'
import { getLeaveApplications } from '@/services/leave_applications/leave-applications.services'
import { LeaveApplicationsForm } from '@/lib/types/leave_application'
import { CancelLeaveDialog } from './components/CancelLeave'
import { EmptyPlaceholder } from '@/components/custom/EmptyPlaceholder'
import { PDFAction } from '@/app/components/PDFAction'
import { UpdatePDFDialog } from '@/app/components/PDFDialog'
import { PdfForm } from '@/app/components/PdfForm'
import { fetchUserPds } from '@/services/pds/pds.service'
import { AwardDialog } from '@/app/components/AwardDialog'
import { unreadAwards } from '@/services/awards/awards.service'
import { Banner } from '@/app/components/Banner'

export default async function PersonalManagement({
  params
}: {
  params: Promise<{ userId: string }>
}): Promise<JSX.Element> {
  const { userId } = await params
  const response = await fetchUserWitHCredits(userId)

  const employeeId = response.users.employee_id
  const today = new Date()
  const todayMonth = (today.getMonth() + 1).toString()
  const formatted = todayMonth.padStart(2, '0')

  const pdsInfo = await fetchUserPds(userId)

  const unopenAwards = await unreadAwards()

  const attendanceResponse = await getAttendanceSummary(
    employeeId,
    `?page=1&perPage=31&sortBy=created_at&month=${formatted}&year=${today.getFullYear()}`
  )

  const { leave_applications: leaveApplications } = await getLeaveApplications(
    `?page=1&perPage=5&limt=5&sortBy=status`
  )

  const category = await getLeaveCategories('')
  const unreadRewards = unopenAwards.awards.length

  return (
    <Container
      title='Personal Data Management'
      description='You can update your PDS here'
    >
      {unreadRewards > 0 && (
        <Banner
          path={`/employee/${userId}/nominated_awards`}
          rewardCount={unreadRewards}
        />
      )}
      <UserDetails
        {...{
          users: attendanceResponse.users,
          attendance: {
            daysPresent: attendanceResponse.attendance?.days_present || 0,
            daysAbsent: attendanceResponse.attendance?.days_absent || 0,
            tardiness_count:
              attendanceResponse?.attendance?.tardiness_count || 0
          },
          credits: attendanceResponse.userCredits?.credits,
          isAdmin: false
        }}
      />

      <section className='flex gap-2'>
        <div className='flex-1'>
          <PDFAction data={pdsInfo} />
          <PdfForm file={pdsInfo.file} />
        </div>
        <div className='flex-1 space-y-4'>
          <AttendanceLeaves />
          {leaveApplications.map((item: LeaveApplicationsForm) => (
            <LeaveCard key={item.id} {...item} />
          ))}

          {leaveApplications.length <= 0 && (
            <div className='text-center'>
              <EmptyPlaceholder />
            </div>
          )}
        </div>
      </section>

      <FileLeaveDialog category={category.leave_categories} />
      <CancelLeaveDialog />
      <UpdatePDFDialog userId={userId} />
      <AwardDialog />
    </Container>
  )
}
