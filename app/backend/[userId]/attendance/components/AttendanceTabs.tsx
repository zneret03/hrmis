import { JSX } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function AttendanceTabs(): JSX.Element {
  return (
    <Tabs defaultValue='biometrics' className='w-[400px]'>
      <TabsList>
        <TabsTrigger value='biometrics'>Biometrics</TabsTrigger>
        <TabsTrigger value='rendered_hours'>Hours Rendered</TabsTrigger>
      </TabsList>
      <TabsContent value='biometrics'>
        Make changes to your account here.
      </TabsContent>
      <TabsContent value='rendered_hours'>
        Change your password here.
      </TabsContent>
    </Tabs>
  )
}
