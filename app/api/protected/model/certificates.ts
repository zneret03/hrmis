import { Certificates, CertificatesRequestForm } from '@/lib/types/certificates'
import { generalErrorResponse, successResponse } from '../../helpers/response'
import { createClient } from '@/config'

export const requestDocument = async (data: CertificatesRequestForm) => {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('certificates')
      .insert({ ...data, certificate_status: 'pending' })

    if (error) {
      return generalErrorResponse({ error: error.message })
    }

    return successResponse({
      message: 'Successfuly request document'
    })
  } catch (error) {
    const newError = error as Error
    return generalErrorResponse({ error: newError.message })
  }
}

export const updateDocument = async (
  data: Partial<Certificates>,
  id: string
) => {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('certificates')
      .update(data)
      .eq('id', id)

    if (error) {
      return generalErrorResponse({ error: error.message })
    }

    return successResponse({
      message: 'Successfuly updated document'
    })
  } catch (error) {
    const newError = error as Error
    return generalErrorResponse({ error: newError.message })
  }
}
