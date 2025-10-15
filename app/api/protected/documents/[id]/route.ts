import { NextRequest } from 'next/server'
import { isEmpty } from 'lodash'
import { validationErrorNextResponse } from '@/app/api/helpers/response'
import { updateDocument } from '../../model/certificates'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()

  if (isEmpty(body)) {
    return validationErrorNextResponse()
  }

  if (body.type === 'update-document') {
    return updateDocument(body.data, id)
  }
}
