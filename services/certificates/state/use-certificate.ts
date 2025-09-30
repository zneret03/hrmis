import { persist } from 'zustand/middleware'
import { createJSONStorage } from 'zustand/middleware'
import { create } from 'zustand'
import { Certificates } from '@/lib/types/certificates'

type CertificatesDialogType =
  | 'add'
  | 'edit'
  | 'approve'
  | 'disapprove'
  | 'delete'
  | 'cancel'
  | null

export type CertificatesData = Omit<
  Certificates,
  'created_at' | 'updated_at' | 'archived_at'
>

export interface CertificatesDialog {
  open: boolean
  type: CertificatesDialogType
  data: Partial<CertificatesData> | null
  toggleOpenDialog?: (
    isOpen: boolean,
    type: CertificatesDialogType,
    data: CertificatesData | null
  ) => void
}

const initialState: CertificatesDialog = {
  data: null,
  open: false,
  type: null
}

export const useCertificates = create<CertificatesDialog>()(
  persist(
    (set) => ({
      ...initialState,
      toggleOpenDialog: (
        isOpen: boolean,
        type: CertificatesDialogType,
        data: CertificatesData | null
      ) => {
        set((state) => ({
          ...state,
          open: isOpen,
          type,
          data
        }))
      }
    }),
    {
      name: 'use-certificates',
      storage: createJSONStorage(() => sessionStorage)
    }
  )
)
