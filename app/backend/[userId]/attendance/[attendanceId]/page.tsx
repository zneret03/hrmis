import { JSX } from 'react'
import { Container } from '@/components/custom/Container'
import { UserDetails } from '../components/UserDetails'
import { AttendanceTabs } from '../components/AttendanceTabs'
import { getAttendanceSummary } from '@/services/attendance/attendance.services'

export default async function AttendnaceSummary({
  params
}: {
  params: Promise<{ attendanceId: string }>
}): Promise<JSX.Element> {
  const { attendanceId } = await params

  const response = await getAttendanceSummary(attendanceId)

  return (
    <Container
      title='Attendance Summary'
      description='We can see the summary of time in time out of the specific employee here.'
    >
      <UserDetails
        {...{
          users: response.users,
          attendance: {
            daysPresent: response.attendance.days_present,
            daysAbsent: response.attendance.days_absent
          },
          credits: response.userCredits.credits
        }}
      />
      <AttendanceTabs />
    </Container>
  )
}
