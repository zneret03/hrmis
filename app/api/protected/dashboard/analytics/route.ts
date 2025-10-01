import {
  generalErrorResponse,
  successResponse
} from '@/app/api/helpers/response'
import { createClient } from '@/config'

export async function GET() {
  try {
    const supabase = await createClient()

    const { error: userError, count: userCount } = await supabase
      .from('users')
      .select('id', { count: 'exact' })

    if (userError) {
      return generalErrorResponse({ error: userError })
    }

    const { error: leaveError, count: leaveCount } = await supabase
      .from('leave_applications')
      .select('id', { count: 'exact' })

    if (leaveError) {
      return generalErrorResponse({ error: leaveError })
    }

    const { error: awardsError, count: awardCount } = await supabase
      .from('awards')
      .select('id', { count: 'exact' })
      .is('read', null)

    if (awardsError) {
      return generalErrorResponse({ error: awardsError })
    }

    const { error: certificatesError, count: certificateCount } = await supabase
      .from('certificates')
      .select('id', { count: 'exact' })
      .eq('certificate_type', 'pending')

    if (certificatesError) {
      return generalErrorResponse({ error: certificatesError })
    }

    return successResponse({
      message: 'Successfully fetch data',
      data: {
        users: {
          name: 'Total Users',
          count: userCount
        },
        leaves: {
          name: 'Total Leaves',
          count: leaveCount
        },
        awards: {
          name: 'Unread awards',
          count: awardCount
        },
        certificates: {
          name: 'Certificate Requests',
          count: certificateCount
        }
      }
    })
  } catch (error) {
    const newError = error as Error
    return generalErrorResponse({ error: newError.message })
  }
}
