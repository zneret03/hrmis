'use client';

import { JSX, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, Search } from 'lucide-react';
import { avatarName } from '@/helpers/avatarName';

export interface PickerEmployee {
  id: string;
  name: string | null;
  email: string;
  employee_id: string | null;
}

interface EmployeePickerListProps {
  employees: PickerEmployee[];
}

// Searchable employee card grid; selecting a card opens `<current path>/<id>`.
// Shared by the Personnel Leave Card and Employee Service Record pages.
export function EmployeePickerList({
  employees,
}: EmployeePickerListProps): JSX.Element {
  const [search, setSearch] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  const filtered = employees.filter((e) => {
    const q = search.toLowerCase();
    return (
      e.name?.toLowerCase().includes(q) ||
      e.email?.toLowerCase().includes(q) ||
      e.employee_id?.toLowerCase().includes(q)
    );
  });

  const handleSelect = (employeeId: string) => {
    router.push(`${pathname}/${employeeId}`);
  };

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          className="pl-9"
          placeholder="Search employees..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center text-sm">
          No employees found.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((emp) => (
            <Card
              key={emp.id}
              className="cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => handleSelect(emp.id)}
            >
              <CardContent className="flex items-center gap-3 py-4">
                <Avatar>
                  <AvatarImage src="" alt={emp.email} />
                  <AvatarFallback className="bg-blue-400 font-semibold text-white capitalize">
                    {avatarName(emp.email ?? '')}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium capitalize">
                    {emp.name ?? '—'}
                  </p>
                  <p className="text-muted-foreground truncate text-xs">
                    {emp.email}
                  </p>
                  {emp.employee_id && (
                    <Badge variant="outline" className="mt-1 text-xs">
                      ID: {emp.employee_id}
                    </Badge>
                  )}
                </div>

                <ChevronRight className="text-muted-foreground h-4 w-4 flex-shrink-0" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
