import { JSX } from 'react'
import { getCertificates } from '@/services/certificates/certificates.service'
import { Container } from '@/components/custom/Container'
import { CertificatesTable } from './components/RequestedDocumentsTable'
import { DeleteDocumentDialog } from './components/DeleteDocumentDialog'
import { ServiceRecordDialog } from '@/app/components/service-record/ServiceRecordDialog'
import { DisapproveRequestDialog } from './components/DisapprovedRequestDialog'

export default async function RequestedDocuments({
  searchParams
}: {
  searchParams: Promise<{ page: string; search: string }>
}): Promise<JSX.Element> {
  const { page, search } = await searchParams

  const response = await getCertificates(
    `?page=${page || 1}&perPage=10&search=${search}&sortBy=created_at`
  )

  return (
    <Container
      title='Requested Documents'
      description='All requested documents by employee are posted here.'
    >
      <CertificatesTable
        {...{
          certificates: response.certificates,
          totalPages: response.totalPages,
          currentPage: response.currentPage,
          count: response.count
        }}
      />

      <DeleteDocumentDialog />
      <ServiceRecordDialog />
      <DisapproveRequestDialog />
    </Container>
  )
}
