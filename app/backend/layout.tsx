import { AppSidebar } from '@/components/ui/app-sidebar'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar'
import { AuthProvider } from '@/context/AuthProvider'
import { Breadcrumbs } from '@/components/custom/Breadcrumbs'
import { ReactNode } from 'react'

export default async function Layout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
          <div className='flex items-center gap-2 px-4'>
            <SidebarTrigger className='-ml-1' />
            {/*<Separator orientation='vertical' className='mr-2 h-4' />*/}
            <Breadcrumbs />
          </div>
        </header>
        <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
          <AuthProvider>{children}</AuthProvider>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
