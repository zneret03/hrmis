import { axiosService } from '@/app/api/axios-client'
import axios from 'axios'

export const fetchUserPds = async (id: string) => {
  try {
    const response = await axiosService.get(
      `/api/protected/document_request/pds/${id}`
    )

    return response.data.data
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw e.response?.data.error
    }
  }
}
