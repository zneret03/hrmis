import { Certificates } from '@/app/employee/[userId]/document_request/components/Cerficiates'
import { Database } from './db-types'

export type Certificates = Database['public']['Tables']['certificates']['Row']

export type CertificatesRequestForm = Pick<
  Certificates,
  'certificate_type' | 'title' | 'reason'
> & {
  user_id: string
}
