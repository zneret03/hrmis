import { generalErrorResponse, successResponse } from '../../helpers/response'
import { createClient } from '@/config'
import { LeaveCredits } from '@/lib/types/leave_credits'

export const updateCredits = async (
  data: Pick<LeaveCredits, 'id' | 'credits' | 'max_credits'>
) => {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('leave_credits')
      .update(data)
      .eq('user_id', data.id)

    if (error) {
      return generalErrorResponse({ error: error.message })
    }

    return successResponse({
      message: 'Successfully updated credits.'
    })
  } catch (error) {
    const newError = error as Error
    return generalErrorResponse({ error: newError.message })
  }
}
