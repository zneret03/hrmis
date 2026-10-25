import axios from 'axios';
import { toast } from 'sonner';
import { axiosService } from '@/app/api/axios-client';
import { EmployeeLoyaltyThreshold } from '@/lib/types/loyalty_threshold';

export const getLoyaltyThreshold = async (params: string) => {
  try {
    const response = await axiosService.get(
      `/api/protected/loyalty_threshold${params}`,
    );

    return response.data.data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw e.response?.data.error;
    }
  }
};

export const addLoyaltyThreshold = async (
  yearThreshold: number,
): Promise<EmployeeLoyaltyThreshold | undefined> => {
  try {
    const response = await axiosService.post(
      '/api/protected/loyalty_threshold',
      {
        year_threshold: yearThreshold,
        type: 'add-loyalty-threshold',
      },
    );

    toast('Successfully', {
      description: response.data.message,
    });

    return response.data.data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      toast.error('ERROR!', {
        description: e.response?.data.error,
      });
      throw e.response?.data.error;
    }
  }
};

export const deleteLoyaltyThreshold = async (id: string): Promise<void> => {
  try {
    await axiosService.delete(`/api/protected/loyalty_threshold/${id}`);

    toast('Successfully', {
      description: 'Successfully deleted loyalty threshold.',
    });
  } catch (e) {
    if (axios.isAxiosError(e)) {
      toast.error('ERROR!', {
        description: e.response?.data.error,
      });
      throw e.response?.data.error;
    }
  }
};

export const editLoyaltyThreshold = async (data: {
  [key: string]: string | number;
}) => {
  try {
    const response = await axiosService.put(
      `/api/protected/loyalty_threshold/${data.id}`,
      {
        year_threshold: data.year_threshold,
        type: 'edit-loyalty-threshold',
      },
    );

    toast('Successfully', {
      description: response.data.message,
    });
  } catch (e) {
    if (axios.isAxiosError(e)) {
      toast.error('ERROR!', {
        description: e.response?.data.error,
      });
      throw e.response?.data.error;
    }
  }
};
