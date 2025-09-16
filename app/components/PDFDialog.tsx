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
  voluntaryWorkFieldTemplate,
  learningAndDevelopmentFieldTemplate,
  otherInformationFieldTemplate,
  referencesFieldTemplate,
  type Eligibility,
  type WorkExperience,
  type VoluntaryWork,
  type LearningAndDevelopment,
  type OtherInformation,
  type References
} from '../helpers/pds-form-fields'
import type { PDFDocumentProxy } from 'pdfjs-dist'
import { Button } from '@/components/ui/button'
import { CustomButton } from '@/components/custom/CustomButton'
import { useShallow } from 'zustand/react/shallow'
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

  // --- STATES FOR DYNAMIC DATA ---
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
  const [voluntaryWorks, setVoluntaryWorks] = useState<VoluntaryWork[]>([
    {
      nameAndAddress: '',
      inclusiveDateFrom: '',
      inclusiveDateTo: '',
      numberOfHours: '',
      position: ''
    }
  ])
  const [learningAndDevelopment, setLearningAndDevelopment] = useState<
    LearningAndDevelopment[]
  >([
    {
      title: '',
      inclusiveDatesFrom: '',
      inclusiveDatesTo: '',
      numberOfHours: '',
      typeOfLd: '',
      conductedBy: ''
    }
  ])

  const [otherInformation, setOtherInformation] = useState<OtherInformation[]>([
    {
      specialSkills: '',
      nonAcademicDistrinction: '',
      membershipOrganization: ''
    }
  ])

  const [references, setReferences] = useState<References[]>([
    {
      name: '',
      address: '',
      telNo: ''
    }
  ])

  const addReferencesRow = () => {
    setReferences([
      ...references,
      {
        name: '',
        address: '',
        telNo: ''
      }
    ])
  }

  const removeReferencesRow = (index: number) => {
    const newArr = [...references]
    newArr.splice(index, 1)
    setReferences(newArr)
  }

  const handleReferencesChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target
    const newArr = [...references]
    newArr[index] = { ...newArr[index], [name]: value }
    setReferences(newArr)
  }

  const addOtherInformationRow = () => {
    setOtherInformation([
      ...otherInformation,
      {
        specialSkills: '',
        nonAcademicDistrinction: '',
        membershipOrganization: ''
      }
    ])
  }

  const removeOtherInformationRow = (index: number) => {
    const newArr = [...otherInformation]
    newArr.splice(index, 1)
    setOtherInformation(newArr)
  }

  const handleOtherInformationChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target
    const newArr = [...otherInformation]
    newArr[index] = { ...newArr[index], [name]: value }
    setOtherInformation(newArr)
  }

  // Eligibility Handlers
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
    const newArr = [...eligibilities]
    newArr.splice(index, 1)
    setEligibilities(newArr)
  }

  const handleEligibilityChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target
    const newArr = [...eligibilities]
    newArr[index] = { ...newArr[index], [name]: value }
    setEligibilities(newArr)
  }

  // Work Experience Handlers
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
    const newArr = [...workExperiences]
    newArr.splice(index, 1)
    setWorkExperiences(newArr)
  }

  const handleWorkExperienceChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target
    const newArr = [...workExperiences]
    newArr[index] = { ...newArr[index], [name]: value }
    setWorkExperiences(newArr)
  }

  // Voluntary Work Handlers
  const addVoluntaryWorkRow = () => {
    setVoluntaryWorks([
      ...voluntaryWorks,
      {
        nameAndAddress: '',
        inclusiveDateFrom: '',
        inclusiveDateTo: '',
        numberOfHours: '',
        position: ''
      }
    ])
  }

  const removeVoluntaryWorkRow = (index: number) => {
    const newArr = [...voluntaryWorks]
    newArr.splice(index, 1)
    setVoluntaryWorks(newArr)
  }

  const handleVoluntaryWorkChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target
    const newArr = [...voluntaryWorks]
    newArr[index] = { ...newArr[index], [name]: value }
    setVoluntaryWorks(newArr)
  }

  // Learning & Development Handlers
  const addLdRow = () => {
    setLearningAndDevelopment([
      ...learningAndDevelopment,
      {
        title: '',
        inclusiveDatesFrom: '',
        inclusiveDatesTo: '',
        numberOfHours: '',
        typeOfLd: '',
        conductedBy: ''
      }
    ])
  }
  const removeLdRow = (index: number) => {
    const newArr = [...learningAndDevelopment]
    newArr.splice(index, 1)
    setLearningAndDevelopment(newArr)
  }
  const handleLdChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target
    const newArr = [...learningAndDevelopment]
    newArr[index] = { ...newArr[index], [name]: value }
    setLearningAndDevelopment(newArr)
  }

  // --- CORE PDF & STATIC FORM HANDLERS ---
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
  const renderFormFields = (pageNumber: number) => {
    const fieldsForPage = formFields.filter(
      (field) => field.page === pageNumber
    )
    return fieldsForPage.map((field) => {
      const top = (PDF_A4_HEIGHT - field.y - field.height) * scale
      const left = field.x * scale
      const width = field.width * scale
      const height = field.height * scale
      const fontSize = height * 0.6

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

  const renderReferencesFields = (pageNumber: number) => {
    if (pageNumber !== referencesFieldTemplate.page) return null
    return references.map((info, index) => {
      const yPos =
        referencesFieldTemplate.startY -
        index * referencesFieldTemplate.rowHeight

      return referencesFieldTemplate.columns.map((column, colIndex) => {
        const top = (PDF_A4_HEIGHT - yPos) * scale
        const height = (referencesFieldTemplate.rowHeight - 2) * scale
        const left = column.x * scale
        const width = column.width * scale
        const fontSize = height * 0.6

        return (
          <Fragment key={`${column.name}-${index}`}>
            <input
              type='text'
              name={column.name}
              value={info[column.name as keyof References]}
              onChange={(e) => handleReferencesChange(index, e)}
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
            {references.length > 1 &&
              colIndex === referencesFieldTemplate.columns.length - 1 && (
                <button
                  onClick={() => removeReferencesRow(index)}
                  className='absolute z-20 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-700'
                  style={{
                    top: `${top + height * 0}px`,
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

  const renderOtherInformationFields = (pageNumber: number) => {
    if (pageNumber !== otherInformationFieldTemplate.page) return null
    return otherInformation.map((info, index) => {
      const yPos =
        otherInformationFieldTemplate.startY -
        index * otherInformationFieldTemplate.rowHeight

      return otherInformationFieldTemplate.columns.map((column, colIndex) => {
        const top = (PDF_A4_HEIGHT - yPos) * scale
        const height = (otherInformationFieldTemplate.rowHeight - 2) * scale
        const left = column.x * scale
        const width = column.width * scale
        const fontSize = height * 0.6

        return (
          <Fragment key={`${column.name}-${index}`}>
            <input
              type='text'
              name={column.name}
              value={info[column.name as keyof OtherInformation]}
              onChange={(e) => handleOtherInformationChange(index, e)}
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
            {otherInformation.length > 1 &&
              colIndex === otherInformationFieldTemplate.columns.length - 1 && (
                <button
                  onClick={() => removeOtherInformationRow(index)}
                  className='absolute z-20 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-700'
                  style={{
                    top: `${top + height * 0}px`,
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

      return eligibilityFieldTemplate.columns.map((column, colIndex) => {
        const top = (PDF_A4_HEIGHT - yPos) * scale
        const height = (eligibilityFieldTemplate.rowHeight - 2) * scale
        const left = column.x * scale
        const width = column.width * scale
        const fontSize = height * 0.8

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
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center'
              }}
            />
            {eligibilities.length > 1 &&
              colIndex === eligibilityFieldTemplate.columns.length - 1 && (
                <button
                  onClick={() => removeEligibilityRow(index)}
                  className='absolute z-20 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-700'
                  style={{
                    top: `${top + height * 0}px`,
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
                       {' '}
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
                  top: `${top + height * 0}px`,
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

  const renderVoluntaryWorkFields = (pageNumber: number) => {
    if (pageNumber !== voluntaryWorkFieldTemplate.page) return null
    return voluntaryWorks.map((voluntaryWork, index) => {
      const yPos =
        voluntaryWorkFieldTemplate.startY -
        index * voluntaryWorkFieldTemplate.rowHeight
      return voluntaryWorkFieldTemplate.columns.map((column, colIndex) => {
        const top = (PDF_A4_HEIGHT - yPos) * scale
        const height = (voluntaryWorkFieldTemplate.rowHeight - 2) * scale
        const left = column.x * scale
        const width = column.width * scale
        const fontSize = height * 0.5
        return (
          <Fragment key={`${column.name}-${index}`}>
            <input
              type='text'
              name={column.name}
              value={voluntaryWork[column.name as keyof VoluntaryWork]}
              onChange={(e) => handleVoluntaryWorkChange(index, e)}
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
            {voluntaryWorks.length > 1 &&
              colIndex === voluntaryWorkFieldTemplate.columns.length - 1 && (
                <button
                  onClick={() => removeVoluntaryWorkRow(index)}
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

  const renderLdFields = (pageNumber: number) => {
    if (pageNumber !== learningAndDevelopmentFieldTemplate.page) return null
    return learningAndDevelopment.map((ld, index) => {
      const yPos =
        learningAndDevelopmentFieldTemplate.startY -
        index * learningAndDevelopmentFieldTemplate.rowHeight
      return learningAndDevelopmentFieldTemplate.columns.map(
        (column, colIndex) => {
          const top = (PDF_A4_HEIGHT - yPos) * scale
          const height =
            (learningAndDevelopmentFieldTemplate.rowHeight - 2) * scale
          const left = column.x * scale
          const width = column.width * scale
          const fontSize = height * 0.5
          return (
            <Fragment key={`${column.name}-${index}`}>
              <input
                type='text'
                name={column.name}
                value={ld[column.name as keyof LearningAndDevelopment]}
                onChange={(e) => handleLdChange(index, e)}
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
              {learningAndDevelopment.length > 1 &&
                colIndex ===
                  learningAndDevelopmentFieldTemplate.columns.length - 1 && (
                  <button
                    onClick={() => removeLdRow(index)}
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
        }
      )
    })
  }

  // --- Save Handler ---
  const handleSave = async () => {
    alert(
      'Saving data... Check the browser downloads for the generated PDF file.'
    )
    try {
      const response = await fetch('/api/fill-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          eligibilities,
          workExperiences,
          voluntaryWorks,
          learningAndDevelopment
        })
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

  // --- Dialog State Management ---
  const { open, toggleOpen, type } = useUserDialog(
    useShallow((state) => ({
      open: state.open,
      type: state.type,
      toggleOpen: state.toggleOpenDialog
    }))
  )

  const isOpenDialog = open && type === 'update-pdf'

  // --- Component JSX ---
  return (
    <Dialog
      open={isOpenDialog}
      onOpenChange={() => toggleOpen?.(false, null, null)}
    >
      <DialogContent className='sm:max-w-[80rem] max-h-[50rem] lg:max-h-[40rem] md:max-h-[30rem] sm:max-h-[20rem] overflow-auto'>
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
                {renderVoluntaryWorkFields(index + 1)}
                {renderLdFields(index + 1)}
                {renderOtherInformationFields(index + 1)}
                {renderReferencesFields(index + 1)}

                {index + 1 === eligibilityFieldTemplate.page && (
                  <button
                    onClick={addEligibilityRow}
                    className='absolute z-20 bg-blue-500 text-white rounded-md p-1 hover:bg-blue-700'
                    style={{
                      top: `${(PDF_A4_HEIGHT - 785) * scale}px`,
                      left: `${40 * scale}px`,
                      cursor: 'pointer'
                    }}
                  >
                    <Plus className='w-4 h-4' />
                  </button>
                )}
                {index + 1 === workExperienceFieldTemplate.page && (
                  <button
                    onClick={addWorkExperienceRow}
                    className='absolute z-20 bg-blue-500 text-white rounded-md p-1 hover:bg-green-700'
                    style={{
                      top: `${(PDF_A4_HEIGHT - 595) * scale}px`,
                      left: `${40 * scale}px`,
                      cursor: 'pointer'
                    }}
                  >
                    <Plus className='w-4 h-4' />
                  </button>
                )}
                {index + 1 === voluntaryWorkFieldTemplate.page && (
                  <button
                    onClick={addVoluntaryWorkRow}
                    className='absolute z-20 bg-blue-500 text-white rounded-md p-1 hover:bg-purple-700'
                    style={{
                      top: `${(PDF_A4_HEIGHT - 772) * scale}px`,
                      left: `${40 * scale}px`,
                      cursor: 'pointer'
                    }}
                  >
                    <Plus className='w-4 h-4' />
                  </button>
                )}
                {index + 1 === learningAndDevelopmentFieldTemplate.page && (
                  <button
                    onClick={addLdRow}
                    className='absolute z-20 bg-blue-500 text-white rounded-md p-1 hover:bg-yellow-700'
                    style={{
                      top: `${(PDF_A4_HEIGHT - 590) * scale}px`,
                      left: `${40 * scale}px`,
                      cursor: 'pointer'
                    }}
                  >
                    <Plus className='w-4 h-4' />
                  </button>
                )}

                {index + 1 === otherInformationFieldTemplate.page && (
                  <button
                    onClick={addOtherInformationRow}
                    className='absolute z-20 bg-blue-500 text-white rounded-md p-1 hover:bg-yellow-700'
                    style={{
                      top: `${(PDF_A4_HEIGHT - 225) * scale}px`,
                      left: `${40 * scale}px`,
                      cursor: 'pointer'
                    }}
                  >
                    <Plus className='w-4 h-4' />
                  </button>
                )}

                {index + 1 === referencesFieldTemplate.page && (
                  <button
                    onClick={addReferencesRow}
                    className='absolute z-20 bg-blue-500 text-white rounded-md p-1 hover:bg-yellow-700'
                    style={{
                      top: `${(PDF_A4_HEIGHT - 375) * scale}px`,
                      left: `${35 * scale}px`,
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
