import { createClient } from '@/config'
import { uploadImage } from '@/app/api/helpers/image/image'
import {
  successResponse,
  generalErrorResponse
} from '@/app/api/helpers/response'

export const uploadFile = async (body: FormData) => {
  try {
    const supabase = await createClient()

    const { imageUrls, error } = await uploadImage(
      [body.get('file')] as File[],
      supabase,
      body.get('email') as string,
      'application/pdf'
    )

    if (error) {
      return error
    }

    return successResponse({
      message: 'Successfully upload pdf',
      url: imageUrls[0]
    })
  } catch (error) {
    const newError = error as Error
    return generalErrorResponse({ error: newError.message })
  }
}
