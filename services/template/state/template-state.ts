import { persist } from 'zustand/middleware';
import { createJSONStorage } from 'zustand/middleware';
import { create } from 'zustand';
import { TemplateDB } from '@/lib/types/template';

type TemplateDialogType = 'add' | 'edit' | 'delete' | null;

export type TemplateData = TemplateDB & {
  blob?: Blob | null;
};

export interface TemplateDialog {
  open: boolean;
  type: TemplateDialogType;
  data: Partial<TemplateData> | null;
  toggleOpenDialog?: (
    isOpen: boolean,
    type: TemplateDialogType,
    data: TemplateData | null,
  ) => void;
}

const initialState: TemplateDialog = {
  data: {
    id: '',
    file: '',
    blob: null,
    type: '',
  },
  open: false,
  type: null,
};

export const useTemplateDialog = create<TemplateDialog>()(
  persist(
    (set) => ({
      ...initialState,
      toggleOpenDialog: (
        isOpen: boolean,
        type: TemplateDialogType,
        data: TemplateData | null,
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
      name: 'use-template',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
