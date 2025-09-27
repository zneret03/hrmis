'use client'

import { JSX, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { Button } from '@/components/ui/button'
import { EmptyPlaceholder } from '@/components/custom/EmptyPlaceholder'
import { toast } from 'sonner'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

interface PdfForm {
  file: string
  isAdmin?: boolean
}

export function PdfForm({ file, isAdmin = false }: PdfForm): JSX.Element {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState<number>(1)

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }): void => {
    setNumPages(numPages)
  }

  const onError = (error: string): void => {
    toast.error('Error!!', {
      description: error
    })
  }

  const pdfFile = !file ? '/documents/pds-form.pdf' : file
  const documentWidth = !isAdmin ? 1000 : 1300

  return (
    <div className='relative'>
      <Document
        file={pdfFile}
        noData={<EmptyPlaceholder />}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={(error) => onError(error.message)}
      >
        <Page
          width={documentWidth}
          height={500}
          pageNumber={pageNumber}
          renderAnnotationLayer={false}
          renderTextLayer={false}
        />
      </Document>
      {numPages && (
        <div className='text-right space-y-2'>
          <p>
            <strong>Page</strong> {pageNumber} of {numPages}
          </p>
          <section className='flex items-center justify-end gap-2'>
            <Button
              variant='outline'
              disabled={pageNumber === 1}
              onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))}
            >
              Previous
            </Button>
            <Button
              variant='outline'
              disabled={pageNumber === numPages}
              onClick={() =>
                setPageNumber((prev) => Math.min(numPages, prev + 1))
              }
            >
              Next
            </Button>
          </section>
        </div>
      )}
    </div>
  )
}
