import { persist } from 'zustand/middleware';
import { createJSONStorage } from 'zustand/middleware';
import { create } from 'zustand';
import { EmployeeStatus } from '@/lib/types/employee_status';

type EmployeeStatusDialogType = 'add' | 'edit' | 'delete' | null;

export type EmployeeStatusData = Pick<EmployeeStatus, 'name' | 'id'>;

export interface EmployeeStatusDialog {
  open: boolean;
  type: EmployeeStatusDialogType;
  data: Partial<EmployeeStatusData> | null;
  toggleOpenDialog?: (
    isOpen: boolean,
    type: EmployeeStatusDialogType,
    data: EmployeeStatusData | null,
  ) => void;
}

const initialState: EmployeeStatusDialog = {
  data: {
    name: '',
    id: '',
  },
  open: false,
  type: null,
};

export const useEmployeeStatusDialog = create<EmployeeStatusDialog>()(
  persist(
    (set) => ({
      ...initialState,
      toggleOpenDialog: (
        isOpen: boolean,
        type: EmployeeStatusDialogType,
        data: EmployeeStatusData | null,
      ) => {
        set((state) => ({
          ...state,
          open: isOpen,
          type,
          data,
        }));
      },
    }),
    {
      name: 'employee-status-dialog',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
