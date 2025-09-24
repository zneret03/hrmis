'use client'

import { JSX, useState, useCallback, Fragment } from 'react'
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
  personalInfoFields,
  familyBackgroundFields,
  educationalBackgroundFields,
  otherStaticFields,
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
  type References,
  type FormField
} from '../helpers/pds-form-fields'
import type { PDFDocumentProxy } from 'pdfjs-dist'
import { Button } from '@/components/ui/button'
import { CustomButton } from '@/components/custom/CustomButton'
import { useShallow } from 'zustand/react/shallow'
import { useUserDialog } from '@/services/auth/states/user-dialog'

interface UpdatePDFDialog {
  userId: string
}

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

const personalInfoNames = new Set(personalInfoFields.map((f) => f.name))
const familyBackgroundNames = new Set(familyBackgroundFields.map((f) => f.name))
const educationalBackgroundNames = new Set(
  educationalBackgroundFields.map((f) => f.name)
)

export function UpdatePDFDialog({ userId }: UpdatePDFDialog): JSX.Element {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [scale, setScale] = useState(1.0)

  const [personalInfoData, setPersonalInfoData] = useState<
    Record<string, string | boolean>
  >({})
  const [familyBackgroundData, setFamilyBackgroundData] = useState<
    Record<string, string | boolean>
  >({})
  const [educationalBackgroundData, setEducationalBackgroundData] = useState<
    Record<string, string | boolean>
  >({})
  const [otherStaticData, setOtherStaticData] = useState<
    Record<string, string | boolean>
  >({})

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

  const resetVariables = (): void => {
    toggleOpen?.(false, null, null)
  }

  const handleStaticFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    const fieldValue = type === 'checkbox' ? checked : value

    if (personalInfoNames.has(name)) {
      setPersonalInfoData((prev) => ({ ...prev, [name]: fieldValue }))
    } else if (familyBackgroundNames.has(name)) {
      setFamilyBackgroundData((prev) => ({ ...prev, [name]: fieldValue }))
    } else if (educationalBackgroundNames.has(name)) {
      setEducationalBackgroundData((prev) => ({ ...prev, [name]: fieldValue }))
    } else {
      setOtherStaticData((prev) => ({ ...prev, [name]: fieldValue }))
    }
  }

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
    data: Record<string, any>
  ) => {
    return fields
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
            value={(data[field.name] as string) || ''}
            onChange={handleStaticFieldChange}
          />
        )
      })
  }

  const renderDynamicFields = (
    pageNumber: number,
    template: any,
    data: any[],
    changeHandler: any,
    removeHandler: any
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
              value={item[column.name]}
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
      const response = await fetch('/api/protected/pds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personalInfoData,
          familyBackgroundData,
          educationalBackgroundData,
          otherStaticData,
          eligibilities,
          workExperiences,
          voluntaryWorks,
          learningAndDevelopment,
          otherInformation,
          references,
          userId
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

      // resetVariables()
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
      <DialogContent className='sm:max-w-[80rem] xl:max-h-[45rem] lg:max-h-[40rem] md:max-h-[30rem] sm:max-h-[20rem] overflow-auto'>
        <DialogHeader>
          <DialogTitle>Personal Data Sheet</DialogTitle>
          <DialogDescription>
            update your PDS accordingly, dont forget to save your PDS before
            exiting the modal
          </DialogDescription>
        </DialogHeader>
        <div className='w-full max-w-4xl mx-auto p-4'>
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

                {renderStaticFields(
                  index + 1,
                  personalInfoFields,
                  personalInfoData
                )}
                {renderStaticFields(
                  index + 1,
                  familyBackgroundFields,
                  familyBackgroundData
                )}
                {renderStaticFields(
                  index + 1,
                  educationalBackgroundFields,
                  educationalBackgroundData
                )}
                {renderStaticFields(
                  index + 1,
                  otherStaticFields,
                  otherStaticData
                )}

                {renderDynamicFields(
                  index + 1,
                  eligibilityFieldTemplate,
                  eligibilities,
                  handleEligibilityChange,
                  removeEligibilityRow
                )}
                {renderDynamicFields(
                  index + 1,
                  workExperienceFieldTemplate,
                  workExperiences,
                  handleWorkExperienceChange,
                  removeWorkExperienceRow
                )}
                {renderDynamicFields(
                  index + 1,
                  voluntaryWorkFieldTemplate,
                  voluntaryWorks,
                  handleVoluntaryWorkChange,
                  removeVoluntaryWorkRow
                )}
                {renderDynamicFields(
                  index + 1,
                  learningAndDevelopmentFieldTemplate,
                  learningAndDevelopment,
                  handleLdChange,
                  removeLdRow
                )}
                {renderDynamicFields(
                  index + 1,
                  otherInformationFieldTemplate,
                  otherInformation,
                  handleOtherInformationChange,
                  removeOtherInformationRow
                )}
                {renderDynamicFields(
                  index + 1,
                  referencesFieldTemplate,
                  references,
                  handleReferencesChange,
                  removeReferencesRow
                )}

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
          <CustomButton type='button' onClick={handleSave}>
            Save and Download PDS
          </CustomButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
