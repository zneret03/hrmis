import { createClient } from '@/config'
import {
  badRequestResponse,
  conflictRequestResponse,
  generalErrorResponse,
  successResponse
} from '@/app/api/helpers/response'
import { NextRequest } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()

    const { id: userId } = await params

    if (!userId) {
      return conflictRequestResponse({ error: 'User Id is undefined' })
    }

    const { error, data } = await supabase
      .from('pds')
      .select(
        `id, users!inner(id, email, username, role, employee_id), personal_information, family_background, educational_background, 
         civil_service_eligibility, work_experience, voluntary_work, training_programs, 
         other_information, file, created_at, updated_at, other_static_data, pds_references`
      )
      .eq('user_id', userId)
      .single()

    if (error) {
      return badRequestResponse({ error: error.message })
    }

    return successResponse({
      message: 'Successfully fetched user credits',
      data
    })
  } catch (error) {
    const newError = error as Error
    return generalErrorResponse({ error: newError.message })
  }
}
