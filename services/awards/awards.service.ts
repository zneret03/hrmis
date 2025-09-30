import axios from 'axios'
import { axiosService } from '@/app/api/axios-client'

export const getAwards = async (params: string) => {
  try {
    const response = await axiosService.get(`/api/protected/awards${params}`)

    return response.data.data
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw e.response?.data.error
    }
  }
}
