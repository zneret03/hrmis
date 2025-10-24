import { persist } from 'zustand/middleware';
import { createJSONStorage } from 'zustand/middleware';
import { create } from 'zustand';
import { Awards, YearThreshold } from '@/lib/types/awards';

type AwardsDialogType = 'add' | 'edit' | 'delete' | 'read' | null;

export type AwardsData = Omit<
  Awards,
  'created_at' | 'updated_at' | 'archived_at'
> & {
  yearThreshold?: YearThreshold;
};

export interface AwardsDialog {
  open: boolean;
  type: AwardsDialogType;
  data: Partial<AwardsData> | null;
  toggleOpenDialog?: (
    isOpen: boolean,
    type: AwardsDialogType,
    data: AwardsData | null,
  ) => void;
}

const initialState: AwardsDialog = {
  data: null,
  open: false,
  type: null,
};

export const useAwards = create<AwardsDialog>()(
  persist(
    (set) => ({
      ...initialState,
      toggleOpenDialog: (
        isOpen: boolean,
        type: AwardsDialogType,
        data: AwardsData | null,
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
      name: 'use-awards',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
