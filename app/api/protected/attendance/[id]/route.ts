import { NextRequest } from 'next/server'
import { createClient } from '@/config'
import {
  badRequestResponse,
  generalErrorResponse,
  successResponse
} from '@/app/api/helpers/response'
import { paginatedData } from '@/app/api/helpers/paginated-data'
import { BiometricsDB } from '@/lib/types/biometrics'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params

    const url = req.nextUrl.searchParams

    const page = Number(url.get('page') || 1)
    const perPage = Number(url.get('perPage') || 10)
    const sortBy = url.get('sortBy') || 'created_at'
    const month = url.get('month')
    const year = url.get('year')

    const endDate = new Date(Number(year), Number(month), 0).getDate()

    if (!id) {
      return badRequestResponse()
    }

    const {
      data: biometrics,
      error: errorBiometrics,
      count,
      totalPages,
      currentPage
    } = await paginatedData<BiometricsDB>(
      'biometrics',
      supabase,
      'id, employee_id, timestamp, type, created_at, updated_at',
      { column: '', query: '' },
      page,
      perPage,
      sortBy,
      { column: 'employee_id', tableId: id }
    )

    if (errorBiometrics) {
      return generalErrorResponse({ error: errorBiometrics })
    }

    const { data: summary, error: errorSummary } = await supabase
      .from('attendance_summary')
      .select('timestamp, total_hours, created_at, updated_at')
      .order('created_at', { ascending: true })
      .eq('employee_id', id)
      .gte('timestamp', `${year}-${month}-01T00:00:00Z`)
      .lte('timestamp', `${year}-${month}-${endDate}T23:59:59Z`)

    if (errorSummary) {
      return generalErrorResponse({ error: errorSummary })
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, email, avatar, role, username, employee_id')
      .eq('employee_id', id)
      .single()

    if (userError) {
      return generalErrorResponse({ error: userError })
    }

    const { data: userCredits, error: errorCredits } = await supabase
      .from('leave_credits')
      .select('id, credits, created_at, updated_at, archived_at')
      .eq('user_id', userData.id)
      .single()

    if (errorCredits) {
      return generalErrorResponse({ error: errorCredits })
    }

    const { data: attendance, error: errorAttendance } = await supabase
      .from('attendance')
      .select('id, days_present, days_absent')
      .eq('employee_id', id)
      .single()

    if (errorAttendance) {
      return generalErrorResponse({ error: errorAttendance })
    }

    return successResponse({
      message: 'Successfully fetch data',
      data: {
        users: userData,
        attendanceSummary: summary,
        userCredits,
        biometrics: {
          data: biometrics,
          count,
          totalPages,
          currentPage
        },
        attendance
      }
    })
  } catch (error) {
    const newError = error as Error
    return generalErrorResponse({ error: newError.message })
  }
}
