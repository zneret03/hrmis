import { JSX } from 'react';
import { Container } from '@/components/custom/Container';
import { getCertificates } from '@/services/certificates/certificates.service';
import { RequestDocumentDialog } from './components/RequestDocumentDialog';
import { CancelDocumentDialog } from './components/CancelDocument';
import { Certificates } from './components/Cerficiates';

export default async function Documents({
  searchParams,
  params,
}: {
  searchParams: Promise<{ page: string; search: string }>;
  params: Promise<{ userId: string }>;
}): Promise<JSX.Element> {
  const { page, search } = await searchParams;
  const { userId } = await params;

  const response = await getCertificates(
    `?page=${page || 1}&perPage=10&search=${search}&sortBy=created_at`,
  );

  return (
    <Container
      title="Document Request"
      description="you can request your documents here"
    >
      <Certificates
        {...{
          certificate: response?.certificates,
          totalPages: response.totalPages,
          currentPage: response.currentPage,
          count: response.count,
        }}
      />

      <RequestDocumentDialog userId={userId} />
      <CancelDocumentDialog />
    </Container>
  );
}
