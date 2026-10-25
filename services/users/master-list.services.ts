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

export interface MasterList {
  employees: MasterListRow[];
  count: number;
  totalPages: number;
  currentPage: number;
}

export const getEmployeeMasterList = async (
  status: string,
  page: number,
): Promise<MasterList> => {
  try {
    const response = await axiosService.get(
      `/api/protected/users/master-list?status=${encodeURIComponent(status)}&page=${page}`,
    );

    const { data } = response.data;
    return {
      employees: data.employees ?? [],
      count: data.count ?? 0,
      totalPages: data.totalPages ?? 1,
      currentPage: data.currentPage ?? 1,
    };
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw e.response?.data.error;
    }
    return { employees: [], count: 0, totalPages: 1, currentPage: 1 };
  }
};
