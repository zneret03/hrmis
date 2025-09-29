import { JSX } from 'react'
import { Container } from '@/components/custom/Container'
import { getCertificates } from '@/services/certificates/certificates.service'

export default async function Documents({
  searchParams
}: {
  searchParams: Promise<{ page: string; search: string }>
}): Promise<JSX.Element> {
  const { page, search } = await searchParams

  const response = await getCertificates(
    `?page=${page || 1}&perPage=10&search=${search}&sortBy=created_at`
  )

  console.log(response)

  return (
    <Container
      title='Document Request'
      description='you can request your documents here'
    >
      Document page
    </Container>
  )
}
