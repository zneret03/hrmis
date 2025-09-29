import { Certificates } from '@/app/employee/[userId]/document_request/components/Cerficiates'
import { Database } from './db-types'
import { Users } from './users'

export type Certificates =
  Database['public']['Tables']['certificates']['Row'] & {
    users: Users
  }

export type CertificatesRequestForm = Pick<
  Certificates,
  'certificate_type' | 'title' | 'reason'
> & {
  user_id: string
}
