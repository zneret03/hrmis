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
  const unreadDocuments = await getUnreadCertificatesById(userId);

  const unreadDocs = unreadDocuments?.data?.map(
    (item: Partial<Certificates>) => ({
      id: item.id,
      title: item.title,
      message: item.remarks,
      read_at: !!item.read_at,
      timestamp: item.created_at,
    }),
  );

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="relative flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex w-full items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            {/*<Separator orientation='vertical' className='mr-2 h-4' />*/}
            <Breadcrumbs />
          </div>

          <div className="sticky top-5 px-8">
            <NotificationCenter data={unreadDocs} />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <AuthProvider>{children}</AuthProvider>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
