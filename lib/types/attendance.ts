import { Database } from './db-types'
import { Users } from './users'

export interface MonthData {
  month: string
  days_present: number
  tardiness_count: number
  days_absent: number
}

export interface FormattedYear {
  year: number
  data: MonthData[]
}

export interface AttendanceRecord {
  month: string
  days_present: number
  tardiness_count: number
  days_absent: number
}

export type AggregatedDataObject = {
  [year: string]: {
    [monthName: string]: {
      days_present: number
      tardiness_count: number
      days_absent: number
    }
  }
}

export type Attendance = Database['public']['Tables']['attendance']['Row']
export type AttendanceSummary =
  Database['public']['Tables']['attendance_summary']['Row']

export interface AttendanceDB extends Omit<Attendance, 'archived_at'> {
  users: Pick<Users, 'id' | 'email' | 'username' | 'employee_id'>
}

export type AttendanceSummaryDB = Pick<
  AttendanceSummary,
  'timestamp' | 'total_hours' | 'created_at' | 'updated_at' | 'status'
>
