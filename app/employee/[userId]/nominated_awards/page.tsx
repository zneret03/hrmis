import { JSX } from 'react'
import { Container } from '@/components/custom/Container'
import { getAwards } from '@/services/awards/awards.service'

export default async function Awards({
  searchParams
}: {
  searchParams: Promise<{ page: string; search: string }>
}): Promise<JSX.Element> {
  const { page, search } = await searchParams

  const response = await getAwards(
    `?page=${page || 1}&perPage=10&search=${search}&sortBy=created_at`
  )

  console.log(response)

  return (
    <Container title='Awards' description='All your awards can be seen here'>
      awards
    </Container>
  )
}
