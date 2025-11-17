import axios from 'axios';
import { toast } from 'sonner';
import { axiosService } from '@/app/api/axios-client';

export const getTemplates = async (params: string) => {
  try {
    const response = await axiosService.get(`/api/protected/template${params}`);

    return response.data.data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw e.response?.data.error;
    }
  }
};

export const uploadTemplate = async (
  name: string,
  file: File,
  type: string,
) => {
  try {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('file', file);
    formData.append('type', type);

    const response = await axiosService.post(
      `/api/protected/template`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    toast('Successfully', {
      description: response.data.message,
    });

    return response.data.data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw e.response?.data.error;
    }
  }
};

export const deleteTemplate = async (id: string, file: string) => {
  try {
    const response = await axiosService.delete(
      `/api/protected/template/${id}`,
      {
        data: { file },
      },
    );

    toast('Successfully', {
      description: response.data.message,
    });
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw e.response?.data.error;
    }
  }
};
