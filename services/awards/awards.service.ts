import axios from 'axios';
import { axiosService } from '@/app/api/axios-client';
import { Awards } from '@/lib/types/awards';
import { toast } from 'sonner';

export const getAwards = async (params: string) => {
  try {
    const response = await axiosService.get(`/api/protected/awards${params}`);

    return response.data.data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw e.response?.data.error;
    }
  }
};

export const addAward = async (data: Partial<Awards>) => {
  try {
    const response = await axiosService.post(`/api/protected/awards`, {
      data,
      type: 'add-award',
    });

    return response.data.data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw e.response?.data.error;
    }
  }
};

export const updateAward = async (
  data: Partial<Awards> | { value: number },
  id: string,
  type = 'update-award',
) => {
  try {
    await axiosService.put(`/api/protected/awards/${id}`, {
      data,
      type,
    });

    if (type === 'update-threshold') {
      toast('Successfully', {
        description: 'Successfully updated threshold',
      });
    }
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw e.response?.data.error;
    }
  }
};

export const unreadAwards = async () => {
  try {
    const response = await axiosService.get(`/api/protected/awards/unread`);

    return response.data.data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw e.response?.data.error;
    }
  }
};
