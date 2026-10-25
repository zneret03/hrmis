import { persist, createJSONStorage } from 'zustand/middleware';
import { create } from 'zustand';
import { ServiceRecordForm } from '@/services/service_record/service-record.services';

type ServiceRecordDialogType = 'add' | 'edit' | 'delete' | null;

export interface ServiceRecordDialog {
  open: boolean;
  type: ServiceRecordDialogType;
  data: ServiceRecordForm | null;
  toggleOpenDialog?: (
    isOpen: boolean,
    type: ServiceRecordDialogType,
    data: ServiceRecordForm | null,
  ) => void;
}

const initialState: ServiceRecordDialog = {
  data: null,
  open: false,
  type: null,
};

export const useServiceRecordDialog = create<ServiceRecordDialog>()(
  persist(
    (set) => ({
      ...initialState,
      toggleOpenDialog: (isOpen, type, data) => {
        set((state) => ({ ...state, open: isOpen, type, data }));
      },
    }),
    {
      name: 'service-record-dialog',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
