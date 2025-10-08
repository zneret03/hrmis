import { NextResponse } from 'next/server'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { promises as fs } from 'fs'
import path from 'path'
import {
  formValues,
  serviceRecordFieldTemplate,
  ServiceRecordDynamic,
  type DynamicFieldTemplate
} from '@/app/helpers/service-record/service-record-form-fields'
import { createClient } from '@/config'
import { generalErrorResponse } from '../../helpers/response'
import { removeImageViaPath } from '../../helpers/image/image'

export async function POST(request: Request) {
  const body = await request.json()

  try {
    const supabase = await createClient()

    const { formValuesSR, initialState, certificateId, fileBucketPath } = body

    const pdfPath = path.join(
      process.cwd(),
      'public',
      'documents',
      'service-record.pdf'
    )

    const pdfBytes = await fs.readFile(pdfPath)
    const pdfDoc = await PDFDocument.load(pdfBytes)
    const pages = pdfDoc.getPages()
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

    const formFields = { ...formValuesSR }

    for (const field of formValues) {
      if (formFields[field.name]) {
        const page = pages[field.page - 1]
        const value = formFields[field.name]

        if (field.type === 'text' && typeof value === 'string') {
          page.drawText(value, {
            x: field.x - field.marginWidth,
            y: field.y - field.marginHeight,
            size: field.height * field.fontSize,
            font,
            color: rgb(0, 0, 0)
          })
        }
      }
    }

    const drawDynamicRows = (
      template: DynamicFieldTemplate,
      data: ServiceRecordDynamic
    ) => {
      if (data && Array.isArray(data) && data.length > 0) {
        const page = pages[template.page - 1]
        data.forEach((item, index) => {
          const yPos =
            template.startY - index * (template?.serverHeight as number)

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

    drawDynamicRows(serviceRecordFieldTemplate, initialState)
    const filledPdfBytes = await pdfDoc.save()

    const filePath = `${certificateId}/service-record-${new Date().toISOString()}.pdf`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('certificates')
      .upload(filePath, filledPdfBytes, {
        contentType: 'application/pdf',
        upsert: true
      })

    if (typeof fileBucketPath === 'string') {
      removeImageViaPath(supabase, fileBucketPath, 'certificates')
    }

    const {
      data: { publicUrl }
    } = supabase.storage
      .from('certificates')
      .getPublicUrl(uploadData?.path as string)

    if (uploadError) {
      removeImageViaPath(supabase, fileBucketPath, 'certificates')
      return generalErrorResponse({ error: uploadError.message })
    }

    const toDb = {
      data: {
        formFields,
        service_record: initialState
      },
      file: publicUrl,
      certificate_status: 'approved'
    }

    const { error } = await supabase
      .from('certificates')
      .update(toDb)
      .eq('id', certificateId)

    if (error) {
      removeImageViaPath(supabase, fileBucketPath, 'certificates')
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
