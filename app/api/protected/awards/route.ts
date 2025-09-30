import { NextRequest } from 'next/server'
import { createClient } from '@/config'
import { paginatedData } from '../../helpers/paginated-data'
import {
  badRequestResponse,
  generalErrorResponse,
  successResponse,
  validationErrorNextResponse
} from '../../helpers/response'
import { AttendanceDB } from '@/lib/types/attendance'
import { isEmpty } from 'lodash'
import { addAwards } from '../model/awards'

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
          'id, title, description, read, users!user_id!inner(email, username, id, employee_id), award_type, year, created_at, updated_at, archived_at',
        search: { column: 'title', query: search },
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

export async function POST(req: NextRequest) {
  const body = await req.json()

  if (isEmpty(body)) {
    return validationErrorNextResponse()
  }

  if (body.type === 'add-award') {
    return addAwards(body.data)
  }
}
