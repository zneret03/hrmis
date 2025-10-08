'use client'

import { JSX, useState, useCallback, Fragment, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogDescription
} from '@/components/ui/dialog'
import { Document, Page, pdfjs } from 'react-pdf'
import { Plus } from 'lucide-react'
import {
  formValues,
  DynamicFieldTemplate,
  serviceRecordFieldTemplate,
  PDF_A4_WIDTH,
  PDF_A4_HEIGHT,
  type FormField
} from '../../helpers/service-record/service-record-form-fields'
import { useRouter } from 'next/navigation'
import type { PDFDocumentProxy } from 'pdfjs-dist'
import { Button } from '@/components/ui/button'
import { CustomButton } from '@/components/custom/CustomButton'
import { useShallow } from 'zustand/react/shallow'
import { toast } from 'sonner'
import { Json } from '@/lib/types/db-types'
import { useCertificates } from '@/services/certificates/state/use-certificate'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

const serviceRecordFormValues = new Set(formValues.map((f) => f.name))

const initialStateServiceRecord = {
  from: '',
  to: '',
  designation: '',
  status: '',
  salaray: '',
  placeOfAssignment: '',
  branch: '',
  withOrWithoutPay: '',
  date: '',
  cause: ''
}

export function ServiceRecordDialog(): JSX.Element {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [scale, setScale] = useState(1.0)

  const { open, toggleOpen, type, certificateType, data } = useCertificates(
    useShallow((state) => ({
      open: state.open,
      type: state.type,
      certificateType: state.certificateType,
      toggleOpen: state.toggleOpenDialog,
      data: state.data
    }))
  )

  const router = useRouter()

  const [formValuesSR, setFormValues] = useState<Json>(
    (data?.data?.formFields as Json) ?? {}
  )

  // --- STATES FOR DYNAMIC DATA ---
  const [initialState, setInitialState] = useState<Json[]>(
    (data?.data?.service_record as Json[]) || [initialStateServiceRecord]
  )

  useEffect(() => {
    if (data) {
      setFormValues(data?.data?.formFields as Json)
      setInitialState(data?.data?.service_record as Json[])
    }
  }, [data])

  const resetVariables = (): void => {
    toggleOpen?.(false, null, null, null)
    router.refresh()
  }

  const handleStaticFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    const fieldValue = type === 'checkbox' ? checked : value

    if (serviceRecordFormValues.has(name)) {
      setFormValues((prev) => ({ ...prev, [name]: fieldValue }))
    }
  }

  const handleServiceRecordChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target
    const newArr = [...initialState]
    newArr[index] = { ...newArr[index], [name]: value }
    setInitialState(newArr)
  }

  const addSR = (): void => {
    setInitialState([...initialState, initialStateServiceRecord])
  }

  const removeSR = (index: number): void => {
    const newArr = [...initialState]
    newArr.splice(index, 1)
    setInitialState(newArr)
  }

  // --- CORE PDF & STATIC FORM HANDLERS ---
  const onDocumentLoadSuccess = ({ numPages }: PDFDocumentProxy): void => {
    setNumPages(numPages)
  }

  const pageWrapperRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      const updateScale = () => {
        setScale(node.getBoundingClientRect().width / PDF_A4_WIDTH)
      }
      const resizeObserver = new ResizeObserver(updateScale)
      resizeObserver.observe(node)
      updateScale() // Initial call
      return () => resizeObserver.disconnect()
    }
  }, [])

  // --- RENDER FUNCTIONS ---
  const renderStaticFields = (
    pageNumber: number,
    fields: FormField[],
    data: Json
  ) =>
    fields
      .filter((field) => field.page === pageNumber)
      .map((field) => {
        const top = (PDF_A4_HEIGHT - field.y) * scale
        const left = field.x * scale
        const width = field.width * scale
        const height = field.height * scale
        const fontSize =
          field.type === 'text' ? height * field.fontSize : height * 0.6

        const commonProps = {
          key: field.name,
          name: field.name,
          style: {
            position: 'absolute',
            top: `${top}px`,
            left: `${left}px`,
            width: `${width}px`,
            height: `${height}px`,
            fontSize: `${fontSize}px`,
            zIndex: 10,
            border: 'none',
            outline: '1px solid rgba(0, 150, 255, 0.5)',
            backgroundColor: 'rgba(0, 150, 255, 0.1)',
            boxSizing: 'border-box'
          } as React.CSSProperties
        }

        if (field.type === 'checkbox') {
          return (
            <input
              type='checkbox'
              {...commonProps}
              key={field.name}
              checked={(data[field.name] as boolean) || false}
              onChange={handleStaticFieldChange}
            />
          )
        }

        if (field.type === 'textarea') {
          return (
            <textarea
              {...commonProps}
              value={(data[field.name] as string) || ''}
              onChange={handleStaticFieldChange}
              key={field.name}
              style={{
                ...commonProps.style,
                resize: 'none',
                padding: `${2 * scale}px`
              }}
            />
          )
        }

        return (
          <input
            type='text'
            {...commonProps}
            key={field.name}
            value={(data[field.name] as string) || ''}
            onChange={handleStaticFieldChange}
          />
        )
      })

  const renderDynamicFields = (
    pageNumber: number,
    template: DynamicFieldTemplate,
    data: Record<string, string>[] | Json[],
    changeHandler: (
      index: number,
      e: React.ChangeEvent<HTMLInputElement>
    ) => void,
    removeHandler: (index: number) => void
  ) => {
    if (pageNumber !== template.page) return null
    return data.map((item, index) => {
      const yPos = template.startY - index * template.rowHeight
      return template.columns.map((column, colIndex) => {
        const top = (PDF_A4_HEIGHT - yPos) * scale
        const height = (template.rowHeight - 2) * scale
        const left = column.x * scale
        const width = column.width * scale
        const fontSize = (template.fontSize || 8) * scale
        return (
          <Fragment key={`${column.name}-${index}`}>
            <input
              type='text'
              name={column.name}
              value={item[column.name] as string}
              onChange={(e) => changeHandler(index, e)}
              style={{
                position: 'absolute',
                top: `${top}px`,
                left: `${left}px`,
                width: `${width}px`,
                height: `${height}px`,
                fontSize: `${fontSize}px`,
                zIndex: 10,
                border: 'none',
                outline: '1px solid rgba(0, 150, 255, 0.5)',
                backgroundColor: 'rgba(0, 150, 255, 0.1)',
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center'
              }}
            />
            {data.length > 1 && colIndex === template.columns.length - 1 && (
              <button
                onClick={() => removeHandler(index)}
                className='absolute z-20 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-700'
                style={{
                  top: `${top + height * 0.1}px`,
                  left: `${left + width + 5 * scale}px`,
                  width: `${height}px`,
                  height: `${height}px`,
                  fontSize: `${height * 0.6}px`,
                  lineHeight: '1',
                  cursor: 'pointer'
                }}
              >
                -
              </button>
            )}
          </Fragment>
        )
      })
    })
  }

  // --- Save Handler ---
  const handleSave = async () => {
    try {
      const response = await fetch('/api/protected/service-record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formValuesSR,
          initialState,
          certificateId: data?.id,
          fileBucketPath: data?.file?.split('certificates/')[1]
        })
      })

      if (response.ok) {
        toast('Successfully', {
          description: 'Successfully updated Service Record file'
        })

        resetVariables()
      }
    } catch (error) {
      console.error('Failed to generate and download PDF:', error)
    }
  }

  const isOpenDialog =
    open && type === 'approve' && certificateType === 'service_record'

  return (
    <Dialog
      open={isOpenDialog}
      onOpenChange={() => toggleOpen?.(false, null, null, null)}
    >
      <DialogContent className='sm:max-w-[80rem] xl:max-h-[45rem] lg:max-h-[40rem] md:max-h-[30rem] sm:max-h-[20rem] overflow-auto'>
        <DialogHeader>
          <DialogTitle>Service Record</DialogTitle>
          <DialogDescription>
            update your Service record accordingly, dont forget to save your
            Service Record before exiting the modal
          </DialogDescription>
        </DialogHeader>
        <div className='w-full max-w-4xl mx-auto p-4'>
          <Document
            file='/documents/service-record.pdf'
            onLoadSuccess={onDocumentLoadSuccess}
          >
            {Array.from({ length: numPages || 0 }, (_, index) => (
              <div
                key={`page_wrapper_${index + 1}`}
                ref={pageWrapperRef}
                className='relative mb-4 shadow-lg'
              >
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  width={PDF_A4_WIDTH * scale}
                  renderAnnotationLayer={false}
                  renderTextLayer={true}
                />

                {renderStaticFields(index + 1, formValues, formValuesSR)}

                {renderDynamicFields(
                  index + 1,
                  serviceRecordFieldTemplate,
                  initialState,
                  handleServiceRecordChange,
                  removeSR
                )}

                {index + 1 === serviceRecordFieldTemplate.page && (
                  <button
                    onClick={addSR}
                    className='absolute z-20 bg-blue-500 text-white rounded-md p-1 hover:bg-blue-700'
                    style={{
                      top: `${(PDF_A4_HEIGHT - 510) * scale}px`,
                      left: `${15 * scale}px`,
                      cursor: 'pointer'
                    }}
                  >
                    <Plus className='w-4 h-4' />
                  </button>
                )}
              </div>
            ))}
          </Document>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type='button'
              variant='outline'
              onClick={() => toggleOpen?.(false, null, null, null)}
            >
              Cancel
            </Button>
          </DialogClose>
          <CustomButton type='button' onClick={handleSave}>
            Approved Form
          </CustomButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
