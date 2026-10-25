import axios from 'axios';
import { toast } from 'sonner';
import { axiosService } from '@/app/api/axios-client';
import { EmployeeStatus } from '@/lib/types/employee_status';

export const getEmployeeStatus = async (params: string) => {
  try {
    const response = await axiosService.get(
      `/api/protected/employee_status${params}`,
    );

    return response.data.data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw e.response?.data.error;
    }
  }
};

export const getAllEmployeeStatus = async (): Promise<
  Pick<EmployeeStatus, 'id' | 'name'>[]
> => {
  try {
    const response = await axiosService.get(
      '/api/protected/employee_status?all=true',
    );

    return response.data.data.employee_status ?? [];
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw e.response?.data.error;
    }
    return [];
  }
};

export const addEmployeeStatus = async (
  name: string,
): Promise<EmployeeStatus | undefined> => {
  try {
    const response = await axiosService.post('/api/protected/employee_status', {
      name,
      type: 'add-employee-status',
    });

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

export const deleteEmployeeStatus = async (id: string): Promise<void> => {
  try {
    await axiosService.delete(`/api/protected/employee_status/${id}`);

    toast('Successfully', {
      description: 'Successfully deleted employee status.',
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

export const editEmployeeStatus = async (data: { [key: string]: string }) => {
  try {
    const response = await axiosService.put(
      `/api/protected/employee_status/${data.id}`,
      {
        name: data.name,
        type: 'edit-employee-status',
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
