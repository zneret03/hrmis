import { Database } from './db-types'
import { Users } from './users'

export type Awards = Database['public']['Tables']['awards']['Row'] & {
  users: Users
}
