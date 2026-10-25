import { persist } from 'zustand/middleware';
import { createJSONStorage } from 'zustand/middleware';
import { create } from 'zustand';
import { EmployeeLoyaltyThreshold } from '@/lib/types/loyalty_threshold';

type LoyaltyThresholdDialogType = 'add' | 'edit' | 'delete' | null;

export type LoyaltyThresholdData = Pick<
  EmployeeLoyaltyThreshold,
  'year_threshold' | 'id'
>;

export interface LoyaltyThresholdDialog {
  open: boolean;
  type: LoyaltyThresholdDialogType;
  data: Partial<LoyaltyThresholdData> | null;
  toggleOpenDialog?: (
    isOpen: boolean,
    type: LoyaltyThresholdDialogType,
    data: LoyaltyThresholdData | null,
  ) => void;
}

const initialState: LoyaltyThresholdDialog = {
  data: {
    year_threshold: null,
    id: '',
  },
  open: false,
  type: null,
};

export const useLoyaltyThresholdDialog = create<LoyaltyThresholdDialog>()(
  persist(
    (set) => ({
      ...initialState,
      toggleOpenDialog: (
        isOpen: boolean,
        type: LoyaltyThresholdDialogType,
        data: LoyaltyThresholdData | null,
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
      name: 'loyalty-threshold-dialog',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
