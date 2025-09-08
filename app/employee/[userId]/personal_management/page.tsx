import { JSX } from 'react'
import PdfForm from './components/PdfForm'
import { UserDetails } from '@/app/backend/[userId]/components/UserDetails'
import { getAttendanceSummary } from '@/services/attendance/attendance.services'
import { fetchUserWitHCredits } from '@/services/leave_credits/leave_credits.services'
import { Container } from '@/components/custom/Container'

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

  const attendanceResponse = await getAttendanceSummary(
    employeeId,
    `?page=1&perPage=31&sortBy=created_at&month=${formatted}&year=${today.getFullYear()}`
  )

  return (
    <Container
      title='Personal Data Management'
      description='You can update your PDS here'
    >
      <UserDetails
        {...{
          users: attendanceResponse.users,
          attendance: {
            daysPresent: attendanceResponse.attendance.days_present,
            daysAbsent: attendanceResponse.attendance.days_absent
          },
          credits: attendanceResponse.userCredits.credits,
          isAdmin: false
        }}
      />

      <PdfForm />
    </Container>
  )
}
