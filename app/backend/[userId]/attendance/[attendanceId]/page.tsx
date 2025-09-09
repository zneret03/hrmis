import { JSX } from 'react'
import { Container } from '@/components/custom/Container'
import { UserDetails } from '../../components/UserDetails'
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
  searchParams: Promise<{ page: string; month: string; year: string }>
}): Promise<JSX.Element> {
  const { attendanceId } = await params
  const { page, month, year } = await searchParams

  const today = new Date()
  const todayMonth = (today.getMonth() + 1).toString()
  const formatted = todayMonth.padStart(2, '0')

  const response = await getAttendanceSummary(
    attendanceId,
    `?page=${page || 1}&perPage=31&sortBy=created_at&month=${month || formatted}&year=${year || today.getFullYear()}`
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
        isAdmin
      />
      <AttendanceTabs
        defaultValue='biometrics'
        listTabs={listTabs}
        content={content}
      />
    </Container>
  )
}
