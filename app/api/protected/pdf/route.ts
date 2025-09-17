import { NextResponse } from 'next/server'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { promises as fs } from 'fs'
import path from 'path'
import {
  formFields,
  eligibilityFieldTemplate,
  workExperienceFieldTemplate,
  voluntaryWorkFieldTemplate,
  learningAndDevelopmentFieldTemplate,
  otherInformationFieldTemplate,
  referencesFieldTemplate,
  type DynamicFieldTemplate
} from '@/app/helpers/pds-form-fields'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      eligibilities,
      workExperiences,
      voluntaryWorks,
      learningAndDevelopment,
      otherInformation,
      references,
      ...formData
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

    for (const field of formFields) {
      if (formData[field.name]) {
        const page = pages[field.page - 1]
        const value = formData[field.name]

        if (field.type === 'checkbox' && value === true) {
          page.drawText('✓', {
            x: field.x,
            y: field.y,
            size: 10,
            font,
            color: rgb(0, 0, 0)
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
              x: field.x + 2,
              y: y,
              size: regularSize,
              font,
              color: rgb(0, 0, 0)
            })
            y -= lineHeight
          }
        }
      }
    }

    const drawDynamicRows = (template: DynamicFieldTemplate, data: any[]) => {
      if (data && Array.isArray(data) && data.length > 0) {
        const page = pages[template.page - 1]
        data.forEach((item, index) => {
          const yPos = template.startY - index * template.rowHeight

          template.columns.forEach((column: any) => {
            const text = item[column.name]

            if (text) {
              page.drawText(text, {
                x: column.x,
                y: yPos,
                size: regularSize,
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

    // --- 3. SAVE AND RETURN THE PDF ---
    const filledPdfBytes = await pdfDoc.save()

    return new NextResponse(filledPdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="pds-form-filled.pdf"'
      }
    })
  } catch (error) {
    console.error('PDF generation failed:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    )
  }
}
