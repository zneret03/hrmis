import { NextResponse } from 'next/server'
import { PDFDocument, rgb, StandardFonts, PDFPage } from 'pdf-lib'
import { promises as fs } from 'fs'
import path from 'path'
import {
  personalInfoFields,
  familyBackgroundFields,
  educationalBackgroundFields,
  otherStaticFields,
  eligibilityFieldTemplate,
  workExperienceFieldTemplate,
  voluntaryWorkFieldTemplate,
  learningAndDevelopmentFieldTemplate,
  otherInformationFieldTemplate,
  referencesFieldTemplate,
  type DynamicFieldTemplate,
  type Eligibility,
  type WorkExperience,
  type VoluntaryWork,
  type LearningAndDevelopment,
  type OtherInformation,
  type References
} from '@/app/helpers/pds-form-fields'
import { createClient } from '@/config'
import { generalErrorResponse } from '../../helpers/response'

const drawCheckmark = (
  page: PDFPage,
  { x = 0, y = 0, size = 10, thickness = 1.5, color = rgb(0, 0, 0) }
): void => {
  const x1 = x + size * 0.1
  const y1 = y + size * 0.4
  const x2 = x + size * 0.4
  const y2 = y + size * 0.1
  const x3 = x + size * 0.9
  const y3 = y + size * 0.7

  page.drawLine({
    start: { x: x1, y: y1 },
    end: { x: x2, y: y2 },
    thickness: thickness,
    color: color
  })
  page.drawLine({
    start: { x: x2, y: y2 },
    end: { x: x3, y: y3 },
    thickness: thickness,
    color: color
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    const {
      eligibilities,
      workExperiences,
      voluntaryWorks,
      learningAndDevelopment,
      otherInformation,
      references,
      personalInfoData,
      familyBackgroundData,
      educationalBackgroundData,
      otherStaticData,
      userId
    } = body

    const pdfPath = path.join(
      process.cwd(),
      'public',
      'documents',
      'pds-form.pdf'
    )
    const pdfBytes = await fs.readFile(pdfPath)
    const pdfDoc = await PDFDocument.load(pdfBytes)
    const pages = pdfDoc.getPages()
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const regularSize = 8
    const lineHeight = 10

    const formFields = [
      ...personalInfoFields,
      ...familyBackgroundFields,
      ...educationalBackgroundFields,
      ...otherStaticFields
    ]

    const formData = {
      ...personalInfoData,
      ...familyBackgroundData,
      ...educationalBackgroundData,
      ...otherStaticData
    }

    for (const field of formFields) {
      if (formData[field.name]) {
        const page = pages[field.page - 1]
        const value = formData[field.name]

        if (field.type === 'checkbox' && value === true) {
          drawCheckmark(page, {
            x: field.x - field.marginWidth,
            y: field.y - field.marginHeight,
            size: field.height
          })
        } else if (field.type === 'text' && typeof value === 'string') {
          page.drawText(value, {
            x: field.x - field.marginWidth,
            y: field.y - field.marginHeight,
            size: field.height * field.fontSize,
            font,
            color: rgb(0, 0, 0)
          })
        } else if (field.type === 'textarea' && typeof value === 'string') {
          const lines = value.split('\n')
          let y = field.y - regularSize

          for (const line of lines) {
            page.drawText(line, {
              x: field.x - field.marginWidth,
              y: y - field.marginHeight,
              size: regularSize,
              font,
              color: rgb(0, 0, 0)
            })
            y -= lineHeight
          }
        }
      }
    }

    const drawDynamicRows = (
      template: DynamicFieldTemplate,
      data:
        | Eligibility
        | WorkExperience
        | VoluntaryWork
        | LearningAndDevelopment
        | OtherInformation
        | References
    ) => {
      if (data && Array.isArray(data) && data.length > 0) {
        const page = pages[template.page - 1]
        data.forEach((item, index) => {
          const yPos = template.startY - index * template.rowHeight

          template.columns.map((column) => {
            const text = item[column.name]

            if (text) {
              page.drawText(text, {
                x: column.x - column.marginWidth,
                y: yPos - column.marginHeight,
                size: template.rowHeight * column.fontSize,
                font,
                color: rgb(0, 0, 0)
              })
            }
          })
        })
      }
    }

    drawDynamicRows(eligibilityFieldTemplate, eligibilities)
    drawDynamicRows(workExperienceFieldTemplate, workExperiences)
    drawDynamicRows(voluntaryWorkFieldTemplate, voluntaryWorks)
    drawDynamicRows(learningAndDevelopmentFieldTemplate, learningAndDevelopment)
    drawDynamicRows(otherInformationFieldTemplate, otherInformation)
    drawDynamicRows(referencesFieldTemplate, references)

    const filledPdfBytes = await pdfDoc.save()

    const filePath = `${userId}/pds-form-${new Date().toISOString()}.pdf`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('pds_documents')
      .upload(filePath, filledPdfBytes, {
        contentType: 'application/pdf',
        upsert: true
      })

    const {
      data: { publicUrl }
    } = supabase.storage
      .from('pds_documents')
      .getPublicUrl(uploadData?.path as string)

    if (uploadError) {
      return generalErrorResponse({ error: uploadError.message })
    }

    const toDb = {
      personal_information: personalInfoData,
      family_background: familyBackgroundData,
      educational_background: educationalBackgroundData,
      civil_service_eligibility: eligibilities,
      work_experience: workExperiences,
      voluntary_work: voluntaryWorks,
      training_programs: learningAndDevelopment,
      other_information: otherInformation,
      other_static_data: otherStaticData,
      pds_references: references,
      file: publicUrl
    }

    const { error } = await supabase
      .from('pds')
      .update(toDb)
      .eq('user_id', userId)

    if (error) {
      return generalErrorResponse({ error: error.message })
    }

    return new NextResponse(filledPdfBytes as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="pds-form-filled.pdf"'
      }
    })
  } catch (error) {
    return generalErrorResponse({ error: error })
  }
}
