import axios from 'axios';
import { axiosService } from '@/app/api/axios-client';

export type AttendancePeriod = 'weekly' | 'monthly' | 'yearly';

export interface AttendanceReportRow {
  employee_id: string;
  name: string;
  date: string;
  time_in: string;
  time_out: string;
  worked_hours: string;
  late: string;
  undertime: string;
}

export interface AttendanceReport {
  period: AttendancePeriod;
  start: string;
  end: string;
  rows: AttendanceReportRow[];
  count: number;
  totalPages: number;
  currentPage: number;
}

export const getAttendanceReport = async (
  period: AttendancePeriod,
  date: string,
  page: number,
): Promise<AttendanceReport> => {
  try {
    const response = await axiosService.get(
      `/api/protected/attendance/report?period=${period}&date=${date}&page=${page}`,
    );
    const { data } = response.data;
    return {
      period: data.period,
      start: data.start,
      end: data.end,
      rows: data.rows ?? [],
      count: data.count ?? 0,
      totalPages: data.totalPages ?? 1,
      currentPage: data.currentPage ?? 1,
    };
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw e.response?.data.error;
    }
    return {
      period,
      start: '',
      end: '',
      rows: [],
      count: 0,
      totalPages: 1,
      currentPage: 1,
    };
  }
};
