import { JSX } from 'react'
import { Container } from '@/components/custom/Container'
import { UserDetails } from '../components/UserDetails'
import { AttendanceTabs } from '../components/AttendanceTabs'
import { BiometricsTable } from '../components/BiometricsTable'
import { RenderedTable } from '../components/RenderedTable'
import { getAttendanceSummary } from '@/services/attendance/attendance.services'
import { AttendanceSummaryDB } from '@/lib/types/attendance'

export default async function AttendnaceSummary({
  params,
  searchParams
}: {
  params: Promise<{ attendanceId: string }>
  searchParams: Promise<{ page: string }>
}): Promise<JSX.Element> {
  const { attendanceId } = await params
  const { page } = await searchParams

  const response = await getAttendanceSummary(
    attendanceId,
    `?page=${page || 1}&perPage=10&sortBy=created_at`
  )

  const listTabs = [
    {
      value: 'biometrics',
      title: 'Bioemtrics'
    },
    {
      value: 'rendered_hours',
      title: 'Rendered Hours'
    }
  ]

  const content = [
    {
      value: 'biometrics',
      tabContent: (
        <BiometricsTable
          {...{
            data: response.biometrics.data,
            totalPages: response?.biometrics.totalPages as number,
            currentPage: response?.biometrics.currentPage as number,
            count: response?.biometrics.count as number
          }}
        />
      )
    },
    {
      value: 'rendered_hours',
      tabContent: (
        <RenderedTable
          data={response.attendanceSummary as AttendanceSummaryDB[]}
        />
      )
    }
  ]

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
      <AttendanceTabs
        defaultValue='biometrics'
        listTabs={listTabs}
        content={content}
      />
    </Container>
  )
}
