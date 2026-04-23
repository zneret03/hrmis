import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { LeaveCardEntry } from '@/lib/types/leave_card_entries';

type LeaveCardDialogType = 'add' | 'edit' | 'delete' | null;

export interface LeaveCardDialog {
  open: boolean;
  type: LeaveCardDialogType;
  data: Partial<LeaveCardEntry> | null;
  toggleOpenDialog?: (
    isOpen: boolean,
    type: LeaveCardDialogType,
    data: Partial<LeaveCardEntry> | null,
  ) => void;
}

const initialState: LeaveCardDialog = {
  open: false,
  type: null,
  data: null,
};

export const useLeaveCardDialog = create<LeaveCardDialog>()(
  persist(
    (set) => ({
      ...initialState,
      toggleOpenDialog: (
        isOpen: boolean,
        type: LeaveCardDialogType,
        data: Partial<LeaveCardEntry> | null,
      ) => {
        set((state) => ({ ...state, open: isOpen, type, data }));
      },
    }),
    {
      name: 'leave-card-dialog',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
