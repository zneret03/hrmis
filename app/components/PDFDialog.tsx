'use client'

import { JSX, useState, useCallback, Fragment } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog'
import { Document, Page, pdfjs } from 'react-pdf'
import { Plus } from 'lucide-react'
import {
  formFields,
  PDF_A4_WIDTH,
  PDF_A4_HEIGHT,
  eligibilityFieldTemplate,
  workExperienceFieldTemplate,
  type Eligibility,
  type WorkExperience
} from '../helpers/pds-form-fields'
import type { PDFDocumentProxy } from 'pdfjs-dist'
import { Button } from '@/components/ui/button'
import { CustomButton } from '@/components/custom/CustomButton'
import { useShallow } from 'zustand/react/shallow'
// import { useRouter } from 'next/navigation'
import { useUserDialog } from '@/services/auth/states/user-dialog'

type FormData = Record<string, string | boolean>

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

export function UpdatePDFDialog(): JSX.Element {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [formData, setFormData] = useState<FormData>({})
  const [scale, setScale] = useState(1.0)
  // const router = useRouter()

  const [eligibilities, setEligibilities] = useState<Eligibility[]>([
    {
      careerService: '',
      rating: '',
      dateOfExamination: '',
      placeOfExamination: '',
      licenseNumber: '',
      licenseDateOfValidity: ''
    }
  ])

  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([
    {
      inclusiveDatesFrom: '',
      inclusiveDatesTo: '',
      positionTitle: '',
      department: '',
      monthlySalary: '',
      salaryGrade: '',
      statusOfAppointment: '',
      govtService: ''
    }
  ])

  const addEligibilityRow = () => {
    setEligibilities([
      ...eligibilities,
      {
        careerService: '',
        rating: '',
        dateOfExamination: '',
        placeOfExamination: '',
        licenseNumber: '',
        licenseDateOfValidity: ''
      }
    ])
  }

  const removeEligibilityRow = (index: number) => {
    const newEligibilities = [...eligibilities]
    newEligibilities.splice(index, 1)
    setEligibilities(newEligibilities)
  }

  const handleEligibilityChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target
    const newEligibilities = [...eligibilities]
    newEligibilities[index] = { ...newEligibilities[index], [name]: value }
    setEligibilities(newEligibilities)
  }

  const addWorkExperienceRow = () => {
    setWorkExperiences([
      ...workExperiences,
      {
        inclusiveDatesFrom: '',
        inclusiveDatesTo: '',
        positionTitle: '',
        department: '',
        monthlySalary: '',
        salaryGrade: '',
        statusOfAppointment: '',
        govtService: ''
      }
    ])
  }

  const removeWorkExperienceRow = (index: number) => {
    const newWorkExperiences = [...workExperiences]
    newWorkExperiences.splice(index, 1)
    setWorkExperiences(newWorkExperiences)
  }

  const handleWorkExperienceChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target
    const newWorkExperiences = [...workExperiences]
    newWorkExperiences[index] = { ...newWorkExperiences[index], [name]: value }
    setWorkExperiences(newWorkExperiences)
  }

  const onDocumentLoadSuccess = ({ numPages }: PDFDocumentProxy) => {
    setNumPages(numPages)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const pageWrapperRef = useCallback((node: HTMLDivElement | null) => {
    if (node !== null) {
      const parentWidth = node.getBoundingClientRect().width
      setScale(parentWidth / PDF_A4_WIDTH)
    }
    const resizeObserver = new ResizeObserver(() => {
      if (node) {
        const parentWidth = node.getBoundingClientRect().width
        setScale(parentWidth / PDF_A4_WIDTH)
      }
    })
    if (node) {
      resizeObserver.observe(node)
    }
    return () => {
      if (node) resizeObserver.unobserve(node)
    }
  }, [])

  // --- Rendering Functions ---
  const renderWorkExperienceFields = (pageNumber: number) => {
    if (pageNumber !== workExperienceFieldTemplate.page) return null

    return workExperiences.map((experience, index) => {
      const yPos =
        workExperienceFieldTemplate.startY -
        index * workExperienceFieldTemplate.rowHeight

      return workExperienceFieldTemplate.columns.map((column) => {
        const top =
          (PDF_A4_HEIGHT - yPos - workExperienceFieldTemplate.rowHeight) * scale
        const left = column.x * scale
        const width = column.width * scale
        const height = (workExperienceFieldTemplate.rowHeight - 2) * scale
        const fontSize = height * 0.4

        return (
          <Fragment key={`${column.name}-${index}`}>
            <input
              type='text'
              name={column.name}
              value={experience[column.name as keyof WorkExperience]}
              onChange={(e) => handleWorkExperienceChange(index, e)}
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
                boxSizing: 'border-box'
              }}
            />
            {workExperiences.length > 1 && column.name === 'govtService' && (
              <button
                onClick={() => removeWorkExperienceRow(index)}
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

  const renderEligibilityFields = (pageNumber: number) => {
    if (pageNumber !== eligibilityFieldTemplate.page) return null

    return eligibilities.map((eligibility, index) => {
      const yPos =
        eligibilityFieldTemplate.startY -
        index * eligibilityFieldTemplate.rowHeight

      return eligibilityFieldTemplate.columns.map((column) => {
        const top =
          (PDF_A4_HEIGHT - yPos - eligibilityFieldTemplate.rowHeight) * scale
        const left = column.x * scale
        const width = column.width * scale
        const height = (eligibilityFieldTemplate.rowHeight - 2) * scale
        const fontSize = height * 0.4

        return (
          <Fragment key={`${column.name}-${index}`}>
            <input
              type='text'
              name={column.name}
              value={eligibility[column.name as keyof Eligibility]}
              onChange={(e) => handleEligibilityChange(index, e)}
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
                boxSizing: 'border-box'
              }}
            />
            {eligibilities.length > 1 &&
              column.name === 'licenseDateOfValidity' && (
                <button
                  onClick={() => removeEligibilityRow(index)}
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

  const renderFormFields = (pageNumber: number) => {
    const fieldsForPage = formFields.filter(
      (field) => field.page === pageNumber
    )
    return fieldsForPage.map((field) => {
      const top = (PDF_A4_HEIGHT - field.y - field.height) * scale
      const left = field.x * scale
      const width = field.width * scale
      const height = field.height * scale
      const fontSize = height * 0.8

      const commonProps = {
        name: field.name,
        style: {
          position: 'absolute',
          top: `${top}px`,
          left: `${left}px`,
          width: `${width}px`,
          height: `${height}px`,
          fontSize: `${fontSize}px`,
          zIndex: 10
        } as React.CSSProperties
      }

      if (field.type === 'checkbox') {
        return (
          <input
            key={field.name}
            type='checkbox'
            checked={(formData[field.name] as boolean) || false}
            onChange={handleInputChange}
            {...commonProps}
            style={{
              ...commonProps.style,
              outline: '1px solid rgba(0, 150, 255, 0.5)',
              backgroundColor: 'rgba(0, 150, 255, 0.1)'
            }}
          />
        )
      }

      return (
        <input
          key={field.name}
          type='text'
          value={(formData[field.name] as string) || ''}
          onChange={handleInputChange}
          {...commonProps}
          style={{
            ...commonProps.style,
            border: 'none',
            outline: '1px solid rgba(0, 150, 255, 0.5)',
            backgroundColor: 'rgba(0, 150, 255, 0.1)',
            boxSizing: 'border-box'
          }}
        />
      )
    })
  }

  const handleSave = async () => {
    alert(
      'Saving data... Check the browser downloads for the generated PDF file.'
    )
    try {
      const response = await fetch('/api/fill-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, eligibilities, workExperiences })
      })
      if (!response.ok) throw new Error(`Server error: ${response.statusText}`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'pds-form-filled.pdf'
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to generate and download PDF:', error)
    }
  }

  const { open, toggleOpen, type } = useUserDialog(
    useShallow((state) => ({
      open: state.open,
      type: state.type,
      toggleOpen: state.toggleOpenDialog
    }))
  )

  const isOpenDialog = open && type === 'update-pdf'

  return (
    <Dialog
      open={isOpenDialog}
      onOpenChange={() => toggleOpen?.(false, null, null)}
    >
      <DialogContent className='sm:max-w-[80rem] max-h-[50rem] overflow-auto'>
        <DialogHeader>
          <DialogTitle>Personal Data Sheet</DialogTitle>
        </DialogHeader>

        <div className='w-full max-w-4xl mx-auto p-4'>
          <div className='flex justify-end mb-4'>
            <button
              onClick={handleSave}
              className='px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors'
            >
              Save and Download PDF
            </button>
          </div>
          <Document
            file='/documents/pds-form.pdf'
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

                {renderFormFields(index + 1)}
                {renderEligibilityFields(index + 1)}
                {renderWorkExperienceFields(index + 1)}

                {index + 1 === eligibilityFieldTemplate.page && (
                  <button
                    onClick={addEligibilityRow}
                    className='absolute z-20 bg-blue-500 text-white rounded-md px-2 py-1 text-xs hover:bg-blue-700'
                    style={{
                      top: `${(PDF_A4_HEIGHT - 785) * scale}px`,
                      left: `${40 * scale}px`,
                      cursor: 'pointer'
                    }}
                  >
                    <Plus className='w-5 h-5' />
                  </button>
                )}

                {index + 1 === workExperienceFieldTemplate.page && (
                  <button
                    onClick={addWorkExperienceRow}
                    className='absolute z-20 bg-blue-500 text-white rounded-md px-2 py-1 text-xs hover:bg-green-700'
                    style={{
                      top: `${(PDF_A4_HEIGHT - 595) * scale}px`,
                      left: `${40 * scale}px`,
                      cursor: 'pointer'
                    }}
                  >
                    <Plus className='w-5 h-5' />
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
              onClick={() => toggleOpen?.(false, null, null)}
            >
              Cancel
            </Button>
          </DialogClose>
          <CustomButton type='button'>Save to Profile</CustomButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
