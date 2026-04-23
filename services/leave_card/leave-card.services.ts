import axios from 'axios';
import { axiosService } from '@/app/api/axios-client';
import { toast } from 'sonner';
import { LeaveCardEntryInsert } from '@/lib/types/leave_card_entries';

export const getLeaveCardEntries = async (params: string) => {
  try {
    const response = await axiosService.get(`/api/protected/leave_card${params}`);
    return response.data.data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw e.response?.data.error;
    }
  }
};

export const addLeaveCardEntry = async (data: LeaveCardEntryInsert) => {
  try {
    const response = await axiosService.post('/api/protected/leave_card', {
      data,
      type: 'add-leave-card-entry',
    });

    toast('Success', { description: response.data.message });
  } catch (e) {
    if (axios.isAxiosError(e)) {
      toast.error('Error', { description: e.response?.data.error });
      throw e.response?.data.error;
    }
  }
};

export const updateLeaveCardEntry = async (
  id: string,
  data: Partial<LeaveCardEntryInsert>,
) => {
  try {
    const response = await axiosService.put(`/api/protected/leave_card/${id}`, {
      data,
      type: 'update-leave-card-entry',
    });

    toast('Success', { description: response.data.message });
  } catch (e) {
    if (axios.isAxiosError(e)) {
      toast.error('Error', { description: e.response?.data.error });
      throw e.response?.data.error;
    }
  }
};

export const deleteLeaveCardEntry = async (id: string) => {
  try {
    const response = await axiosService.delete(
      `/api/protected/leave_card/${id}`,
    );

    toast('Success', { description: response.data.message });
  } catch (e) {
    if (axios.isAxiosError(e)) {
      toast.error('Error', { description: e.response?.data.error });
      throw e.response?.data.error;
    }
  }
};
