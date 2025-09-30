import axios from 'axios'
import { axiosService } from '@/app/api/axios-client'
import { Awards } from '@/lib/types/awards'

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

export const addAward = async (data: Partial<Awards>) => {
  try {
    const response = await axiosService.post(`/api/protected/awards`, {
      data,
      type: 'add-award'
    })

    return response.data.data
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw e.response?.data.error
    }
  }
}

export const updateAward = async (data: Partial<Awards>, id: string) => {
  try {
    await axiosService.put(`/api/protected/awards/${id}`, {
      data,
      type: 'update-award'
    })
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw e.response?.data.error
    }
  }
}

export const unreadAwards = async () => {
  try {
    const response = await axiosService.get(`/api/protected/awards/unread`)

    return response.data.data
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw e.response?.data.error
    }
  }
}
