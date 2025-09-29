'use client'

import { JSX } from 'react'
import { PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyPlaceholder } from '@/components/custom/EmptyPlaceholder'
import { Pagination } from '@/components/custom/Pagination'
import { Pagination as PaginationTypes } from '@/lib/types/pagination'
import { Certificates as CertificatesType } from '@/lib/types/certificates'
import { useCertificates } from '@/services/certificates/state/use-certificate'
import { CertificateCard } from './CertificateCard'
import { useShallow } from 'zustand/shallow'

interface Certificate extends PaginationTypes {
  certificate: CertificatesType[]
}

export function Certificates({
  certificate,
  totalPages,
  currentPage,
  count
}: Certificate): JSX.Element {
  const { toggleDialog } = useCertificates(
    useShallow((state) => ({ toggleDialog: state.toggleOpenDialog }))
  )

  return (
    <main>
      <div className='text-right'>
        <Button onClick={() => toggleDialog?.(true, 'add', null)}>
          <PlusIcon /> Request Document
        </Button>
      </div>
      {certificate?.length <= 0 && <EmptyPlaceholder />}
      <div className='grid grid-cols-4 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-4'>
        {certificate?.map((item) => (
          <CertificateCard key={item.id} {...item} />
        ))}
      </div>

      <Pagination {...{ totalPages, currentPage, count }} />
    </main>
  )
}
