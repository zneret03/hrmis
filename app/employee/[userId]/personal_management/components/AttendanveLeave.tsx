'use client'

import { JSX } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useShallow } from 'zustand/shallow'
import { useLeaveApplicationDialog } from '@/services/leave_applications/states/leave-application-dialog'

export function AttendanceLeaves(): JSX.Element {
  const { toggleOpen } = useLeaveApplicationDialog(
    useShallow((state) => ({ toggleOpen: state.toggleOpenDialog }))
  )

  return (
    <div>
      <section className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>File leave</h1>
          <span className='text-gray-500'>You can file your leaves here</span>
        </div>
        <Button onClick={() => toggleOpen?.(true, 'add', null)}>
          <Plus />
          File leave
        </Button>
      </section>
    </div>
  )
}
