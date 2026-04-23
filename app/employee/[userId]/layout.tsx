import { AppSidebar } from '@/components/ui/app-sidebar';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { NotificationCenter } from './personal_management/components/NotificationCenter';
import { AuthProvider } from '@/context/AuthProvider';
import { Breadcrumbs } from '@/components/custom/Breadcrumbs';
import { ReactNode } from 'react';
import { getUnreadCertificatesById } from '@/services/certificates/certificates.service';
import { Certificates } from '@/lib/types/certificates';
import { createClient } from '@/config';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const supabase = await createClient();

  const [unreadDocuments, leaveNotificationsResult] = await Promise.all([
    getUnreadCertificatesById(userId),
    supabase
      .from('notifications')
      .select('id, type, message, read_at, created_at')
      .eq('recipient_id', userId)
      .in('type', ['leave_approved', 'leave_disapproved'])
      .is('archived_at', null)
      .order('created_at', { ascending: false })
      .limit(20),
  ]);

  const certNotifications = (unreadDocuments?.data ?? []).map(
    (item: Partial<Certificates>) => ({
      id: item.id as string,
      title: item.title as string,
      message: item.remarks as string,
      read_at: !!item.read_at,
      timestamp: new Date(item.created_at as string),
      type: 'document_request' as const,
    }),
  );

  const leaveNotifications = (leaveNotificationsResult.data ?? []).map(
    (item) => ({
      id: item.id,
      title:
        item.type === 'leave_approved' ? 'Leave Approved' : 'Leave Disapproved',
      message: item.message,
      read_at: !!item.read_at,
      timestamp: new Date(item.created_at as string),
      type: item.type as 'leave_approved' | 'leave_disapproved',
    }),
  );

  const allNotifications = [...leaveNotifications, ...certNotifications].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
  );

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="relative flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex w-full items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Breadcrumbs />
          </div>

          <div className="sticky top-5 px-8">
            <NotificationCenter data={allNotifications} />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <AuthProvider>{children}</AuthProvider>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
