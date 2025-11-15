import { Container } from '@/components/custom/Container';
import { getTemplates } from '@/services/template/template.service';
import { TemplateTable } from './components/TemplateTable';
import { JSX } from 'react';
import { TemplateDB } from '@/lib/types/template';

export default async function LeaveCategories({
  searchParams,
}: {
  searchParams: Promise<{ page: string; document: string }>;
}): Promise<JSX.Element> {
  const { page } = await searchParams;

  const response = await getTemplates(
    `?page=${page || 1}&perPage=10&sortBy=created_at`,
  );

  return (
    <Container
      title="Document Templates"
      description="You can manage your document templates here"
    >
      <TemplateTable
        {...{
          templates: (response?.templates as TemplateDB[]) || [],
          totalPages: response?.totalPages as number,
          currentPage: response?.currentPage as number,
          count: response?.count as number,
        }}
      />
    </Container>
  );
}
