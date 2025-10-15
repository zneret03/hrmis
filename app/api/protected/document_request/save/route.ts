import {
  generalErrorResponse,
  conflictRequestResponse,
  successResponse
} from '@/app/api/helpers/response'
import { createClient } from '@/config'
import { NextRequest } from 'next/server'
import { updateDocument } from '../../model/certificates'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()

    const formData = await req.formData()
    const file = formData.get('docx') as File | null
    const id = formData.get('certificateId') as string

    if (!file) {
      return conflictRequestResponse({ error: 'No Document Provided' })
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer())

    const fileName = `${id}/${Date.now()}-${file.name}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('certificates')
      .upload(fileName, fileBuffer, {
        contentType:
          file.type ||
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        upsert: false
      })

    if (uploadError) {
      return generalErrorResponse({ error: uploadError.message })
    }

    const {
      data: { publicUrl }
    } = supabase.storage
      .from('certificates')
      .getPublicUrl(uploadData?.path as string)

    await updateDocument(
      { file: publicUrl, certificate_status: 'approved' },
      id
    )

    return successResponse({ message: 'Successfully added document' })
  } catch (error) {
    return generalErrorResponse({ error: error })
  }
}
