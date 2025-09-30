import { createClient } from '@/config'
import {
  badRequestResponse,
  generalErrorResponse,
  successResponse
} from '../../../helpers/response'

export async function GET() {
  try {
    const supabase = await createClient()

    const { error, data } = await supabase
      .from('awards')
      .select(
        'id, title, description, read, users!user_id!inner(email, username, id, employee_id), award_type, year, created_at, updated_at, archived_at'
      )
      .is('read', null)

    if (error) {
      return badRequestResponse({ error: error.message })
    }

    return successResponse({
      message: 'Successfully unread awards',
      data: {
        awards: data || null
      }
    })
  } catch (error) {
    const newError = error as Error
    return generalErrorResponse({ error: newError.message })
  }
}
