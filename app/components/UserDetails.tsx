import { JSX } from 'react'
import { FileSpreadsheet, CalendarDays, Plane } from 'lucide-react'
import { avatarName } from '@/helpers/avatarName'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CardSummary } from '../components/CardSummary'
import { Users } from '@/lib/types/users'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

interface UserDetails {
  users: Pick<Users, 'avatar' | 'email' | 'username' | 'employee_id' | 'role'>
  attendance: {
    daysPresent: number
    daysAbsent: number
  }
  credits: number
  isAdmin?: boolean
}

export function UserDetails({
  users,
  attendance,
  credits,
  isAdmin = false
}: UserDetails): JSX.Element {
  const { daysPresent, daysAbsent } = attendance
  const { avatar, email, username, employee_id, role } = users
  const userSummary = [
    {
      title: 'Days Present',
      icon: <FileSpreadsheet className='text-gray-500' />,
      count: daysPresent
    },
    {
      title: 'Days Absent',
      icon: <CalendarDays className='text-gray-500' />,
      count: daysAbsent
    },
    {
      title: 'Leave Credits',
      icon: <Plane className='text-gray-500' />,
      count: credits
    }
  ]

  return (
    <main className='space-y-6'>
      <section className='w-full p-8'>
        <div className='flex xl:flex-row lg:flex-col md:flex-col gap-6'>
          <section className='flex items-center gap-4'>
            <Avatar className='xl:w-30 xl:h-30 lg:w-20 lg:h-20 md:w-15 md:h-15'>
              <AvatarImage
                className='object-cover'
                src={avatar || ''}
                alt={email}
              />
              <AvatarFallback className='xl:text-4xl lg:text-xl md:text-lg sm:text-xl rounded-lg fill-blue-500 bg-blue-400 text-white font-semibold capitalize'>
                {avatarName(email)}
              </AvatarFallback>
            </Avatar>

            <div className='space-y-1'>
              <div className='font-semibold xl:text-3xl lg:text-2xl md:text-xl sm:text-lg flex items-center gap-2'>
                {email}
                <Badge>{role}</Badge>
              </div>
              <div className='xl:text-xl lg:text-lg md:text-md sm:text-sm text-gray-500'>
                {username} #{employee_id}
              </div>

              {isAdmin && (
                <Button className='mt-2 xl:text-md lg:text-md md:text-sm sm:text-xs'>
                  <FileSpreadsheet /> View PDS
                </Button>
              )}
            </div>
          </section>

          <div className='flex items-center gap-2 w-full'>
            {userSummary.map((item) => (
              <CardSummary key={item?.title} {...item} />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
