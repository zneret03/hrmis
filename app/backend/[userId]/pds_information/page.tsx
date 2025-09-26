import { JSX } from 'react'
import { Container } from '@/components/custom/Container'
import { PDFAction } from '@/app/components/PDFAction'
import { PdfForm } from '@/app/components/PdfForm'
import { fetchUserPds } from '@/services/pds/pds.service'
import { UpdatePDFDialog } from '@/app/components/PDFDialog'

export default async function PDSInformation({
  params
}: {
  params: Promise<{ userId: string }>
}): Promise<JSX.Element> {
  const { userId } = await params
  const pdsInfo = await fetchUserPds(userId)

  return (
    <Container
      title='Personal Data Management'
      description='You can update your PDS here'
    >
      <section className='flex gap-2'>
        <div className='flex-1'>
          <PDFAction isAdmin data={pdsInfo} />
          <PdfForm file={pdsInfo.file} />
        </div>
      </section>

      <UpdatePDFDialog userId={userId} />
    </Container>
  )
}
