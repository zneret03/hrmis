import axios from 'axios';
import { toast } from 'sonner';
import { axiosService } from '@/app/api/axios-client';
import { ServiceRecordWithUser } from '@/lib/types/service_record';

export interface ServiceRecordForm {
  id?: string;
  user_id?: string;
  position?: string | null;
  status?: string | null;
  salary?: string | null;
  station?: string | null;
  from_date?: string | null;
  to_date?: string | null;
  remarks?: string | null;
}

export const getServiceRecords = async (
  userId?: string,
): Promise<ServiceRecordWithUser[]> => {
  try {
    const query = userId ? `?userId=${userId}` : '';
    const response = await axiosService.get(
      `/api/protected/service_record${query}`,
    );
    return response.data.data.service_record ?? [];
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw e.response?.data.error;
    }
    return [];
  }
};

export const addServiceRecord = async (
  data: ServiceRecordForm,
): Promise<void> => {
  try {
    const response = await axiosService.post('/api/protected/service_record', {
      ...data,
      type: 'add-service-record',
    });
    toast('Successfully', { description: response.data.message });
  } catch (e) {
    if (axios.isAxiosError(e)) {
      toast.error('ERROR!', { description: e.response?.data.error });
      throw e.response?.data.error;
    }
  }
};

export const editServiceRecord = async (
  data: ServiceRecordForm,
): Promise<void> => {
  try {
    const response = await axiosService.put(
      `/api/protected/service_record/${data.id}`,
      { ...data, type: 'edit-service-record' },
    );
    toast('Successfully', { description: response.data.message });
  } catch (e) {
    if (axios.isAxiosError(e)) {
      toast.error('ERROR!', { description: e.response?.data.error });
      throw e.response?.data.error;
    }
  }
};

export const deleteServiceRecord = async (id: string): Promise<void> => {
  try {
    await axiosService.delete(`/api/protected/service_record/${id}`);
    toast('Successfully', {
      description: 'Successfully deleted service record.',
    });
  } catch (e) {
    if (axios.isAxiosError(e)) {
      toast.error('ERROR!', { description: e.response?.data.error });
      throw e.response?.data.error;
    }
  }
};
