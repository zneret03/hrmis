'use client'

import { JSX } from 'react'
import { Plus, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePDS } from '@/services/pds/state/use-pds'
import { useShallow } from 'zustand/shallow'
import { PDS } from '@/lib/types/pds'
import Link from 'next/link'

interface PDFAction {
  data: PDS
  isAdmin?: boolean
}

export function PDFAction({ data, isAdmin = false }: PDFAction): JSX.Element {
  const { toggleOpen } = usePDS(
    useShallow((state) => ({ toggleOpen: state.toggleOpenDialog }))
  )

  const title = !data?.file ? 'Add PDS' : 'Update PDS'
  const icon = !data?.file ? <Plus /> : <RotateCcw />

  return (
    <section className='flex items-center justify-between gap-2 pr-8'>
      {!isAdmin && (
        <div>
          <h1 className='text-2xl font-bold'>Personal Data Sheet</h1>
          <span className='text-gray-500'>You can update your PDS here</span>
        </div>
      )}

      <div className={isAdmin ? 'flex justify-end gap-2 w-full' : 'space-x-2'}>
        <Button
          variant='outline'
          onClick={() => toggleOpen?.(true, 'edit', { ...data })}
        >
          {icon}
          {title}
        </Button>
        <Link href={data.file as string} target='__blank'>
          <Button>Download PDS</Button>
        </Link>
      </div>
    </section>
  )
}
