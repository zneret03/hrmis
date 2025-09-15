import { JSX, ReactNode } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface AttendanceTabs {
  defaultValue: string
  listTabs: {
    value: string
    title: string
  }[]
  content: {
    value: string
    tabContent: ReactNode | string
  }[]
}

export function AttendanceTabs({
  defaultValue,
  listTabs,
  content
}: AttendanceTabs): JSX.Element {
  return (
    <Tabs defaultValue={defaultValue} className='w-full'>
      <TabsList>
        {listTabs.map(({ value, title }) => (
          <TabsTrigger key={value} value={value}>
            {title}
          </TabsTrigger>
        ))}
      </TabsList>
      {content.map(({ value, tabContent }) => (
        <TabsContent key={value} value={value}>
          {tabContent}
        </TabsContent>
      ))}
    </Tabs>
  )
}
