import { JSX } from 'react'
import { FileSpreadsheet, CalendarDays, Plane } from 'lucide-react'
import { avatarName } from '@/helpers/avatarName'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CardSummary } from '../../components/CardSummary'
import { Users } from '@/lib/types/users'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

interface UserDetails {
  users: Pick<Users, 'avatar' | 'email' | 'username' | 'employee_id' | 'role'>
  attendance: {
    daysPresent: number
    daysAbsent: number
  }
  credits: number
}

export function UserDetails({
  users,
  attendance,
  credits
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
            <Avatar className='w-30 h-30'>
              <AvatarImage
                className='object-cover'
                src={avatar || ''}
                alt={email}
              />
              <AvatarFallback className='rounded-lg fill-blue-500 bg-blue-400 text-white font-semibold capitalize'>
                {avatarName(email)}
              </AvatarFallback>
            </Avatar>

            <div className='space-y-1'>
              <div className='font-semibold text-3xl flex items-center gap-2'>
                {email}
                <Badge>{role}</Badge>
              </div>
              <div className='text-xl text-gray-500'>
                {username} #{employee_id}
              </div>

              <Button className='mt-2'>
                <FileSpreadsheet /> View PDS
              </Button>
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
