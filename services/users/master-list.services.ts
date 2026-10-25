import axios from 'axios';
import { axiosService } from '@/app/api/axios-client';

export interface MasterListRow {
  employee_id: string;
  name: string;
  gender: string;
  employment_status: string;
  position: string;
  email: string;
}

export const getEmployeeMasterList = async (
  status: string,
): Promise<MasterListRow[]> => {
  try {
    const response = await axiosService.get(
      `/api/protected/users/master-list?status=${encodeURIComponent(status)}`,
    );

    return response.data.data.employees ?? [];
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw e.response?.data.error;
    }
    return [];
  }
};
