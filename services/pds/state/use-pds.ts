import { persist } from 'zustand/middleware'
import { createJSONStorage } from 'zustand/middleware'
import { create } from 'zustand'
import { PDS as PDSTypes } from '@/lib/types/pds'

type PDSType = 'edit' | null

export type PDSData = Omit<
  PDSTypes,
  'created_at' | 'updated_at' | 'archived_at'
>

export interface PDS {
  open: boolean
  type: PDSType
  data: Partial<PDSData> | null
  toggleOpenDialog?: (
    isOpen: boolean,
    type: PDSType,
    data: Partial<PDSData> | null
  ) => void
}

const initialState: PDS = {
  data: {
    id: '',
    civil_service_eligibility: null,
    educational_background: null,
    family_background: null,
    other_information: null,
    personal_information: null,
    training_programs: null,
    user_id: null,
    voluntary_work: null,
    work_experience: null,
    other_static_data: null,
    pds_references: null,
    file: ''
  },
  open: false,
  type: null
}

export const usePDS = create<PDS>()(
  persist(
    (set) => ({
      ...initialState,
      toggleOpenDialog: (
        isOpen: boolean,
        type: PDSType,
        data: Partial<PDSData> | null
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
      name: 'use-pds',
      storage: createJSONStorage(() => sessionStorage)
    }
  )
)
