import { JSX, ReactNode } from 'react';
import { Card, CardTitle, CardContent } from '@/components/ui/card';

interface CardSummary {
  title: string;
  icon: ReactNode;
  count: number;
}

export function CardSummary({ title, icon, count }: CardSummary): JSX.Element {
  return (
    <Card className="w-full">
      <CardContent>
        <div className="flex items-center justify-between">
          <CardTitle className="xl:text-md lg:text-md font-medium text-gray-500 md:text-sm">
            {title}
          </CardTitle>
          {icon}
        </div>
        <span className="font-medium text-blue-500 sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
          {count}
        </span>
      </CardContent>
    </Card>
  );
}
