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
import { updateDocument } from '@/services/certificates/certificates.service';
import { markNotificationRead } from '@/services/notifications/notifications.services';
import { usePathname, useRouter } from 'next/navigation';
import { useCertificates } from '@/services/certificates/state/use-certificate';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useShallow } from 'zustand/shallow';
import { parentPath } from '@/helpers/parentPath';
import { Certificates } from '@/lib/types/certificates';

type NotificationType =
  | 'document_request'
  | 'leave_approved'
  | 'leave_disapproved';

type Notification = {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read_at: boolean;
  type?: NotificationType;
};

interface NotificationCenter {
  data: Notification[];
}

const TYPE_LABELS: Record<NotificationType, string> = {
  document_request: 'Document Request',
  leave_approved: 'Leave Approved',
  leave_disapproved: 'Leave Disapproved',
};

export function NotificationCenter({ data }: NotificationCenter) {
  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const { toggleOpen } = useCertificates(
    useShallow((state) => ({ toggleOpen: state.toggleOpenDialog })),
  );

  const unreadCount = data.filter((n) => !n.read_at).length;

  const handleNotificationClick = async (args: Notification): Promise<void> => {
    setIsOpen(false);

    if (args.type === 'leave_approved' || args.type === 'leave_disapproved') {
      await markNotificationRead(args.id);
      router.push(`${parentPath(pathname)}/leave_summary?page=1`);
      router.refresh();
      return;
    }

    // default: certificate / document request
    const today = new Date();
    await updateDocument({ read_at: today }, args.id as string, false);
    toggleOpen?.(true, 'view-document-request', null, {
      id: args.id,
      remarks: args.message,
    } as Certificates);
    router.replace(`${parentPath(pathname)}/document_request?page=1`);
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
              <BellRing className="text-foreground h-5 w-5" />
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
              >
                {unreadCount}
              </Badge>
            </>
          ) : (
            <Bell className="text-muted-foreground h-5 w-5" />
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
                  onClick={() => handleNotificationClick(notification)}
                  className={`hover:bg-muted/50 flex cursor-pointer flex-col items-start gap-1 border-b px-4 py-3 text-left transition-colors ${
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
                      {notification.type
                        ? TYPE_LABELS[notification.type]
                        : notification.title}
                    </span>
                    {!notification.read_at && (
                      <span className="bg-primary mt-1.5 flex h-2 w-2 flex-shrink-0 rounded-full" />
                    )}
                  </div>
                  <p className="text-muted-foreground line-clamp-2 text-xs">
                    {notification.message}
                  </p>
                  <span className="text-muted-foreground/80 mt-1 text-[10px]">
                    {formatDistanceToNow(notification.timestamp, {
                      addSuffix: true,
                    })}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center space-y-3 p-6 text-center">
              <Bell className="text-muted-foreground/50 h-8 w-8" />
              <p className="text-muted-foreground text-sm">
                You&apos;re all caught up! No new notifications.
              </p>
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
