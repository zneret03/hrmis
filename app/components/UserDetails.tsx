import { JSX } from 'react';
import { FileSpreadsheet, CalendarDays, Plane, ClockAlert } from 'lucide-react';
import { avatarName } from '@/helpers/avatarName';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CardSummary } from '../components/CardSummary';
import { Users } from '@/lib/types/users';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';

interface UserDetails {
  users: Pick<
    Users,
    'avatar' | 'email' | 'username' | 'employee_id' | 'role' | 'id'
  >;
  attendance: {
    daysPresent: number;
    daysAbsent: number;
    tardiness_count: number;
  };
  credits: number;
  isAdmin?: boolean;
}

export function UserDetails({
  users,
  attendance,
  credits,
  isAdmin = false,
}: UserDetails): JSX.Element {
  const { daysPresent, daysAbsent, tardiness_count } = attendance;
  const { avatar, email, username, employee_id, role } = users;
  const userSummary = [
    {
      title: 'Days Present',
      icon: <FileSpreadsheet className="text-gray-500" />,
      count: daysPresent,
    },
    {
      title: 'Days Absent',
      icon: <CalendarDays className="text-gray-500" />,
      count: daysAbsent,
    },
    {
      title: 'Tardiness/Late',
      icon: <ClockAlert className="text-gray-500" />,
      count: tardiness_count,
    },
    {
      title: 'Leave Credits',
      icon: <Plane className="text-gray-500" />,
      count: credits,
    },
  ];

  return (
    <main className="space-y-6">
      <section className="w-full p-8">
        <div className="flex gap-6 md:flex-col lg:flex-col xl:flex-row">
          <section className="flex items-center gap-4">
            <Avatar className="md:h-15 md:w-15 lg:h-20 lg:w-20 xl:h-30 xl:w-30">
              <AvatarImage
                className="object-cover"
                src={avatar || ''}
                alt={email}
              />
              <AvatarFallback className="rounded-lg bg-blue-400 fill-blue-500 font-semibold text-white capitalize sm:text-xl md:text-lg lg:text-xl xl:text-4xl">
                {avatarName(email)}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1">
              <div className="flex items-center gap-2 font-semibold sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
                {email}
                <Badge>{role}</Badge>
              </div>
              <div className="md:text-md text-gray-500 sm:text-sm lg:text-lg xl:text-xl">
                {username} #{employee_id}
              </div>

              {isAdmin && (
                <Link href={`/backend/${users.id}/pds_information`}>
                  <Button className="xl:text-md lg:text-md mt-2 sm:text-xs md:text-sm">
                    <FileSpreadsheet /> View PDS
                  </Button>
                </Link>
              )}
            </div>
          </section>

          <div className="flex w-full items-center gap-2">
            {userSummary.map((item) => (
              <CardSummary key={item?.title} {...item} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
