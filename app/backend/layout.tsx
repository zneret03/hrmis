import { ReactNode } from 'react';
import { AppSidebar } from '@/components/ui/app-sidebar';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { AuthProvider } from '@/context/AuthProvider';
import { Breadcrumbs } from '@/components/custom/Breadcrumbs';
import { AdminNotificationCenter } from './components/AdminNotificationCenter';
import { createClient } from '@/config';
import { NotificationWithSender } from '@/lib/types/notifications';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

export default async function Layout({ children }: { children: ReactNode }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let notifications: NotificationWithSender[] = [];

  if (user) {
    const { data } = await supabase
      .from('notifications')
      .select(
        'id, recipient_id, sender_id, type, reference_id, message, read_at, created_at, archived_at, sender:users!notifications_sender_id_fkey(id, username, email)',
      )
      .eq('recipient_id', user.id)
      .is('archived_at', null)
      .order('created_at', { ascending: false })
      .limit(30);

    notifications = (data ?? []) as unknown as NotificationWithSender[];
  }

  const userId = user?.id ?? '';

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="relative flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Breadcrumbs />
          </div>

          <div className="sticky top-5 px-8">
            <AdminNotificationCenter
              data={notifications}
              leavesUrl={`/backend/${userId}/leaves?page=1`}
            />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <AuthProvider>{children}</AuthProvider>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
