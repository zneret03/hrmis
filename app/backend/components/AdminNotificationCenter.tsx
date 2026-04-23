'use client';

import { useState } from 'react';
import { Bell, BellRing } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { markNotificationRead } from '@/services/notifications/notifications.services';
import { useRouter } from 'next/navigation';
import { NotificationWithSender } from '@/lib/types/notifications';

interface AdminNotificationCenterProps {
  data: NotificationWithSender[];
  leavesUrl: string;
}

const TYPE_LABELS: Record<string, string> = {
  leave_filed: 'New Leave Application',
  leave_approved: 'Leave Approved',
  leave_disapproved: 'Leave Disapproved',
};

export function AdminNotificationCenter({
  data,
  leavesUrl,
}: AdminNotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const unreadCount = data.filter((n) => !n.read_at).length;

  const handleClick = async (notification: NotificationWithSender) => {
    if (!notification.read_at) {
      await markNotificationRead(notification.id);
    }
    setIsOpen(false);
    router.push(leavesUrl);
    router.refresh();
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative rounded-full"
          aria-label="Open notifications"
        >
          {unreadCount > 0 ? (
            <>
              <BellRing className="h-5 w-5 text-foreground" />
              <Badge
                variant="destructive"
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
              >
                {unreadCount}
              </Badge>
            </>
          ) : (
            <Bell className="h-5 w-5 text-muted-foreground" />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0 sm:w-96" align="end">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold">Notifications</h4>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {unreadCount} unread
              </Badge>
            )}
          </div>
        </div>

        <ScrollArea className="h-[300px] sm:h-[400px]">
          {data.length > 0 ? (
            <div className="flex flex-col">
              {data.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => handleClick(notification)}
                  className={`flex cursor-pointer flex-col items-start gap-1 border-b px-4 py-3 text-left transition-colors hover:bg-muted/50 ${
                    !notification.read_at ? 'bg-muted/20' : ''
                  }`}
                >
                  <div className="flex w-full items-start justify-between gap-2">
                    <span
                      className={`text-sm font-medium ${
                        !notification.read_at
                          ? 'text-foreground'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {TYPE_LABELS[notification.type] ?? notification.type}
                    </span>
                    {!notification.read_at && (
                      <span className="mt-1.5 flex h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                    )}
                  </div>
                  <p className="line-clamp-2 text-xs text-muted-foreground">
                    {notification.message}
                  </p>
                  <span className="mt-1 text-[10px] text-muted-foreground/80">
                    {formatDistanceToNow(
                      new Date(notification.created_at as string),
                      { addSuffix: true },
                    )}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center space-y-3 p-6 text-center">
              <Bell className="h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                No new notifications.
              </p>
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
