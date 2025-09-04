import axios from 'axios'
import { LeaveApplications } from '@/lib/types/leave_application'
import { axiosService } from '@/app/api/axios-client'
import { LeaveStatus } from '@/lib/types/leave_application'
import { toast } from 'sonner'

type LeaveFileRequest = Omit<
  LeaveApplications,
  'created_at' | 'updated_at' | 'archived_at' | 'id'
>

export const addLeaveRequest = async (
  data: LeaveFileRequest,
  credsCount: number
) => {
  try {
    const response = await axiosService.post(
      `/api/protected/leave_application`,
      {
        data,
        credsCount,
        type: 'add-leave-request'
      }
    )

    toast('Successfully', {
      description: response.data.message
    })
  } catch (e) {
    if (axios.isAxiosError(e)) {
      if (e.response?.data.error === 'Not enough credits, try again') {
        toast.error('ERROR!', {
          description: e.response?.data.error
        })
        return
      }
      throw e.response?.data.error
    }
  }
}

export const editLeaveRequest = async (
  data: LeaveFileRequest,
  leaveId: string
) => {
  try {
    const response = await axiosService.put(
      `/api/protected/leave_application/${leaveId}`,
      {
        data,
        type: 'edit-leave-request'
      }
    )

    toast('Successfully', {
      description: response.data.message
    })
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw e.response?.data.error
    }
  }
}

export const getLeaveApplications = async (params: string) => {
  try {
    const response = await axiosService.get(
      `/api/protected/leave_application${params}`
    )

    return response.data.data
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw e.response?.data.error
    }
  }
}

export const approveDisapprovestatus = async (
  status: LeaveStatus,
  userId: string,
  id: string,
  countDates: number
) => {
  try {
    const response = await axiosService.put(
      `/api/protected/leave_application/${id}`,
      {
        status,
        userId,
        countDates,
        type: 'update-leave-status'
      }
    )

    toast('Successfully', {
      description: response.data.message
    })
  } catch (e) {
    if (axios.isAxiosError(e)) {
      if (e.response?.data.error === 'User no longer have leave credits left') {
        toast.error('ERROR!', { description: e.response?.data.error })
        return
      }

      if (e.response?.data.error === 'Not enough leave credits, try again') {
        toast.error('ERROR!', { description: e.response?.data.error })
        return
      }

      throw e.response?.data.error
    }
  }
}

export const deleteLeaveRequest = async (id: string) => {
  try {
    const response = await axiosService.delete(
      `/api/protected/leave_application/${id}`
    )

    toast('Successfully', {
      description: response.data.message
    })
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw e.response?.data.error
    }
  }
}
