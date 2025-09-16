'use client'

import { JSX } from 'react'
import { Button } from '@/components/ui/button'
import { useUserDialog } from '@/services/auth/states/user-dialog'
import { useShallow } from 'zustand/shallow'

export function PDFAction(): JSX.Element {
  const { toggleOpen } = useUserDialog(
    useShallow((state) => ({ toggleOpen: state.toggleOpenDialog }))
  )

  return (
    <section className='flex items-center justify-between gap-2 pr-8'>
      <div>
        <h1 className='text-2xl font-bold'>Personal Data Sheet</h1>
        <span className='text-gray-500'>You can update your PDS here</span>
      </div>
      <Button
        variant='outline'
        onClick={() => toggleOpen?.(true, 'update-pdf', null)}
      >
        Update PDF
      </Button>
    </section>
  )
}
