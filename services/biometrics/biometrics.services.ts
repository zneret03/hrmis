import axios from 'axios';
import { axiosService } from '@/app/api/axios-client';
import { DTRMonth } from '@/lib/types/biometrics';

export interface DTREmployee {
  first_name: string | null;
  last_name: string | null;
  position: string | null;
  employee_id: string;
}

export interface DTRResponse {
  dtr: DTRMonth[];
  employee: DTREmployee;
}

export const fetchDTRByMonth = async (): Promise<DTRResponse | undefined> => {
  try {
    const response = await axiosService.get('/api/protected/biometrics');
    return response.data.data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw e.response?.data.error;
    }
  }
};
