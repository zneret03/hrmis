import { axiosService } from '@/app/api/axios-client'
import axios from 'axios'

export const getDashboardAnalytics = async () => {
  try {
    const response = await axiosService.get(
      `/api/protected/dashboard/analytics`
    )

    return response.data.data
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw e.response?.data.error
    }
  }
}
