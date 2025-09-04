import { NextFetchEvent, NextMiddleware, NextRequest } from 'next/server'
import { updateSession } from '@/config/updateSession'

export function protectedRoutesMiddlware(next: NextMiddleware) {
  return async (req: NextRequest, event: NextFetchEvent) => {
    const response = await updateSession(req)

    if (response) {
      return response
    }

    return next(req, event)
  }
}
