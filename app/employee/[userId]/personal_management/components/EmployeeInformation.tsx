import { JSX, ReactNode } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { MenuOptions } from '@/lib/types/MenuOptions';

interface EmployeeInformationType {
  employeeInfo: MenuOptions[];
  title: string;
  icon: ReactNode;
}

export async function EmployeeInformation({
  employeeInfo,
  title,
  icon,
}: EmployeeInformationType): Promise<JSX.Element> {
  return (
    <section>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            {icon}
            <h1 className="text-2xl font-bold">{title}</h1>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {employeeInfo.map((item, index) => (
            <div key={`${item.label}-${index}`}>
              <label className="text-xs font-medium text-gray-400">
                {item.label}
              </label>
              <h1 className="text-lg font-medium">{item.value}</h1>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
