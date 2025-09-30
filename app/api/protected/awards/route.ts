import { NextRequest } from 'next/server'
import { createClient } from '@/config'
import { paginatedData } from '../../helpers/paginated-data'
import {
  badRequestResponse,
  generalErrorResponse,
  successResponse
} from '../../helpers/response'
import { AttendanceDB } from '@/lib/types/attendance'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()

    const url = req.nextUrl.searchParams

    const page = Number(url.get('page') || 1)
    const perPage = Number(url.get('perPage') || 10)
    const sortBy = url.get('sortBy') || 'created_at'
    const search = url.get('search') || ''
    const limit = url.get('limit') || ''

    const { data, error, count, totalPages, currentPage } =
      await paginatedData<AttendanceDB>({
        tableName: 'awards',
        supabase,
        columns:
          'id, users!user_id!inner(email, username, id, employee_id), award_type, year, created_at, updated_at, archived_at',
        search: { column: 'users.email', query: search },
        page,
        perPage,
        sortBy,
        limit: Number(limit) as number
      })

    if (error) {
      return badRequestResponse({ error: error.message })
    }

    return successResponse({
      message: 'Successfully fetch awards',
      data: {
        awards: data || null,
        count,
        totalPages,
        currentPage
      }
    })
  } catch (error) {
    const newError = error as Error
    return generalErrorResponse({ error: newError.message })
  }
}
