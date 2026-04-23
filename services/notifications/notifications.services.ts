import axios from 'axios';
import { axiosService } from '@/app/api/axios-client';
import { toast } from 'sonner';

export const getNotifications = async (recipientId: string) => {
  try {
    const response = await axiosService.get(
      `/api/protected/notifications?recipientId=${recipientId}`,
    );
    return response.data.data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw e.response?.data.error;
    }
  }
};

export const markNotificationRead = async (id: string) => {
  try {
    await axiosService.put(`/api/protected/notifications/${id}`);
  } catch (e) {
    if (axios.isAxiosError(e)) {
      toast.error('Error', { description: e.response?.data.error });
    }
  }
};
