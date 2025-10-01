import {
  generalErrorResponse,
  successResponse
} from '@/app/api/helpers/response'
import { aggregateAttendance } from './helpers/aggregatedData'
import { createClient } from '@/config'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl.searchParams

    const year = Number(url.get('year') || 1)
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('attendance')
      .select('month, days_present, tardiness_count, days_absent')

    if (error) {
      return generalErrorResponse({ error: error.message })
    }

    const aggregatedData = aggregateAttendance(data, Number(year))

    return successResponse({
      message: 'Successfully fetched data',
      data: aggregatedData
    })
  } catch (error) {
    const newError = error as Error
    return generalErrorResponse({ error: newError.message })
  }
}
