import axios from 'axios'
import { axiosService } from '@/app/api/axios-client'

export const getCertificates = async (params: string) => {
  try {
    const response = await axiosService.get(`/api/protected/documents${params}`)

    return response.data.data
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw e.response?.data.error
    }
  }
}
