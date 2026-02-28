import { persist } from 'zustand/middleware';
import { createJSONStorage } from 'zustand/middleware';
import { create } from 'zustand';
import { Users } from '@/lib/types/users';

type UserDialogType =
  | 'add'
  | 'edit'
  | 'revoked'
  | 'reinstate'
  | 'verify-email'
  | 'update-password'
  | 'update-pdf'
  | null;

type UserDialogSteps =
  | 'account-identity'
  | 'personal-information'
  | 'contact-address'
  | 'employment-details'
  | 'goverment-ids';

export type UserData = Pick<
  Users,
  'username' | 'role' | 'employee_id' | 'avatar' | 'email' | 'id'
> & {
  credits?: number;
  maxCredits?: number;
};

export interface UserDialog {
  open: boolean;
  type: UserDialogType;
  data: Partial<UserData> | null;
  toggleOpenDialog?: (
    isOpen: boolean,
    type: UserDialogType,
    data: UserData | null,
  ) => void;
  onStep?: (step: UserDialogSteps) => void;
  steps: UserDialogSteps;
}

const initialState: UserDialog = {
  data: {
    id: '',
    email: '',
    username: '',
    role: '',
    employee_id: '',
    avatar: '',
    credits: 0,
    maxCredits: 0,
  },
  open: false,
  type: null,
  steps: 'account-identity',
};

export const useUserDialog = create<UserDialog>()(
  persist(
    (set) => ({
      ...initialState,
      toggleOpenDialog: (
        isOpen: boolean,
        type: UserDialogType,
        data: UserData | null,
      ) => {
        set((state) => ({
          ...state,
          open: isOpen,
          type,
          data,
        }));
      },
      onStep: (step: UserDialogSteps) => {
        set((state) => ({
          ...state,
          step,
        }));
      },
    }),
    {
      name: 'add-user-dialog',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
