import axios from 'axios'
import { axiosService } from '@/app/api/axios-client'
import { LeaveCredits, LeaveCreditsForm } from '@/lib/types/leave_credits'
import { Pagination } from '@/lib/types/pagination'
import { toast } from 'sonner'

export interface CreditsForm extends Pagination {
  user_credits: LeaveCreditsForm[]
}

export const fetchUserCredits = async (
  params: string
): Promise<CreditsForm | undefined> => {
  try {
    const response = await axiosService.get(
      `/api/protected/user_credits${params}`
    )

    return response.data.data
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw e.response?.data.error
    }
  }
}

export const fetchUserWitHCredits = async (id: string) => {
  try {
    const response = await axiosService.get(`/api/protected/user_credits/${id}`)

    return response.data.data
  } catch (e) {
    if (axios.isAxiosError(e)) {
      if (e.response?.data.error === 'user does not have employee id') {
        toast.error('ERROR', {
          description: e.response?.data.error
        })
        return
      }
      throw e.response?.data.error
    }
  }
}

export const updateLeaveCredits = async (
  data: Pick<LeaveCredits, 'id' | 'credits'>
) => {
  try {
    const response = await axiosService.post('/api/protected/user_credits', {
      ...data,
      type: 'update-credits'
    })

    toast('Successful', {
      description: response.data.message
    })
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw e.response?.data.error
    }
  }
}
