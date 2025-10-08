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

export type CertificateType = 'ceo' | 'service_record' | 'nosa' | 'coec' | null

export type CertificatesData = Omit<
  Certificates,
  'created_at' | 'updated_at' | 'archived_at'
>

export interface CertificatesDialog {
  open: boolean
  type: CertificatesDialogType
  certificateType: CertificateType
  data: Partial<CertificatesData> | null
  toggleOpenDialog?: (
    isOpen: boolean,
    type: CertificatesDialogType,
    certificateType: CertificateType,
    data: CertificatesData | null
  ) => void
}

const initialState: CertificatesDialog = {
  data: null,
  open: false,
  type: null,
  certificateType: null
}

export const useCertificates = create<CertificatesDialog>()(
  persist(
    (set) => ({
      ...initialState,
      toggleOpenDialog: (
        isOpen: boolean,
        type: CertificatesDialogType,
        certificateType: CertificateType,
        data: CertificatesData | null
      ) => {
        set((state) => ({
          ...state,
          open: isOpen,
          type,
          certificateType,
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
