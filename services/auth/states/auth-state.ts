import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type AuthUserInfo = {
  id: string;
  email: string;
  role: string;
  username: string | null;
  employee_id: string | null;
  avatar?: string | null;
};

export interface UseAuth extends AuthUserInfo {
  setUserInfo: (user: AuthUserInfo) => void;
  reset: () => void;
}

const initialState: AuthUserInfo = {
  id: '',
  email: '',
  role: '',
  username: null,
  employee_id: null,
};

export const useAuth = create<UseAuth>()(
  persist(
    (set) => ({
      ...initialState,
      setUserInfo: (user: AuthUserInfo) => {
        set({
          ...user,
        });
      },
      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'use-auth',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
