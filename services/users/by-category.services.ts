import axios from 'axios';
import { axiosService } from '@/app/api/axios-client';

export type EmployeeCategory = 'gender' | 'age' | 'employment' | 'loyalty';

export interface CategoryRow {
  employee_id: string;
  name: string;
  value: string;
}

export interface CategoryList {
  header: string;
  employees: CategoryRow[];
}

export const getEmployeesByCategory = async (
  category: EmployeeCategory,
): Promise<CategoryList> => {
  try {
    const response = await axiosService.get(
      `/api/protected/users/by-category?category=${category}`,
    );

    return {
      header: response.data.data.header ?? '',
      employees: response.data.data.employees ?? [],
    };
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw e.response?.data.error;
    }
    return { header: '', employees: [] };
  }
};
