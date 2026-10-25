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

export interface ServiceRecordList {
  records: ServiceRecordWithUser[];
  count: number;
  totalPages: number;
  currentPage: number;
}

export const getServiceRecords = async (params?: {
  userId?: string;
  page?: number;
  perPage?: number;
}): Promise<ServiceRecordList> => {
  try {
    const qs = new URLSearchParams();
    if (params?.userId) qs.set('userId', params.userId);
    qs.set('page', String(params?.page ?? 1));
    if (params?.perPage) qs.set('perPage', String(params.perPage));

    const response = await axiosService.get(
      `/api/protected/service_record?${qs.toString()}`,
    );
    const { data } = response.data;
    return {
      records: data.service_record ?? [],
      count: data.count ?? 0,
      totalPages: data.totalPages ?? 1,
      currentPage: data.currentPage ?? 1,
    };
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw e.response?.data.error;
    }
    return { records: [], count: 0, totalPages: 1, currentPage: 1 };
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
