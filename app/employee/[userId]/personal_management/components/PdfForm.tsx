'use client'

import { JSX, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

export default function PdfForm(): JSX.Element {
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)

  const onDocumentLoadSuccess = (page: any): void => {
    setNumPages(page)
  }
  return (
    <div>
      <Document
        file='/documents/pds-form.pdf'
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <Page pageNumber={pageNumber} />
      </Document>
      <p>
        Page {pageNumber} of {numPages}
      </p>
      {numPages && (
        <div>
          <button
            onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))}
          >
            Previous
          </button>
          <button
            onClick={() =>
              setPageNumber((prev) => Math.min(numPages, prev + 1))
            }
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
