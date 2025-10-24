'use client';

import { JSX } from 'react';
import { awardTypeCast } from '@/app/helpers/constants';
import { Badge } from '@/components/ui/badge';
import { Medal } from 'lucide-react';
import { Awards } from '@/lib/types/awards';
import { useAwards } from '@/services/awards/state/use-awards';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { useShallow } from 'zustand/shallow';
import { updateAward } from '@/services/awards/awards.service';

export function AwardCard(
  args: Awards & { onClickConfetti?: () => void },
): JSX.Element {
  const today = new Date();
  const { title, award_type, description, read, onClickConfetti, id } = args;

  const { toggleDialog } = useAwards(
    useShallow((state) => ({ toggleDialog: state.toggleOpenDialog })),
  );

  const onReadAward = async (): Promise<void> => {
    await updateAward({ read: today }, id);
    toggleDialog?.(true, 'read', { ...args });
  };

  const hasUserRead = !read ? 'border-blue-500' : 'border-gray-500';

  return (
    <Card
      className={`border ${hasUserRead} cursor-pointer`}
      onClick={() => {
        onReadAward();
        onClickConfetti?.();
      }}
    >
      <CardContent className="space-y-2 py-0">
        <CardTitle className="flex items-center justify-between">
          <section className="flex items-center gap-2">
            <Medal className="h-5 w-5" />
            <h1>{title}</h1>
          </section>

          <Badge variant="outline">{awardTypeCast[award_type]}</Badge>
        </CardTitle>

        <p className="mt-4">{description}</p>
      </CardContent>
    </Card>
  );
}
