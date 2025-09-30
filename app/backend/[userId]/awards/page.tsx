import { JSX } from 'react'
import { EmployeeAwardsTable } from './components/AwardsTable'
import { NominateDialog } from './components/NominateDialog'
import { getAwards } from '@/services/awards/awards.service'
import { Container } from '@/components/custom/Container'

export default async function Awards({
  searchParams
}: {
  searchParams: Promise<{ page: string; search: string }>
}): Promise<JSX.Element> {
  const { page, search } = await searchParams

  const response = await getAwards(
    `?page=${page || 1}&perPage=10&search=${search}&sortBy=created_at`
  )

  return (
    <Container
      title='Employee Awards'
      description='All awarded users can be seen here.'
    >
      <EmployeeAwardsTable
        {...{
          awards: response.awards,
          totalPages: response.totalPages,
          currentPage: response.currentPage,
          count: response.count
        }}
      />

      <NominateDialog />
    </Container>
  )
}
