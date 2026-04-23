'use client';

import { JSX, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, Search } from 'lucide-react';
import { avatarName } from '@/helpers/avatarName';

interface Employee {
  user_id: string | null;
  users: {
    id: string;
    username: string | null;
    email: string;
    employee_id: string | null;
    role: string;
  } | null;
}

interface EmployeeLeaveCardListProps {
  employees: Employee[];
}

export function EmployeeLeaveCardList({
  employees,
}: EmployeeLeaveCardListProps): JSX.Element {
  const [search, setSearch] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  const filtered = employees.filter((e) => {
    const q = search.toLowerCase();
    return (
      e.users?.username?.toLowerCase().includes(q) ||
      e.users?.email?.toLowerCase().includes(q) ||
      e.users?.employee_id?.toLowerCase().includes(q)
    );
  });

  const handleSelect = (employeeId: string) => {
    router.push(`${pathname}/${employeeId}`);
  };

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search employees..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No employees found.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((emp) => (
            <Card
              key={emp.user_id}
              className="cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => handleSelect(emp.users?.id as string)}
            >
              <CardContent className="flex items-center gap-3 py-4">
                <Avatar>
                  <AvatarImage src="" alt={emp.users?.email} />
                  <AvatarFallback className="bg-blue-400 font-semibold capitalize text-white">
                    {avatarName(emp.users?.email ?? '')}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium capitalize">
                    {emp.users?.username ?? '—'}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {emp.users?.email}
                  </p>
                  {emp.users?.employee_id && (
                    <Badge variant="outline" className="mt-1 text-xs">
                      ID: {emp.users.employee_id}
                    </Badge>
                  )}
                </div>

                <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
